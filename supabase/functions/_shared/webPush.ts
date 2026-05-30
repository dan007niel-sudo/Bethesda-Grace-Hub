// Shared web-push helper used by both `send-push` and `cron-reminders`.
// Wraps the npm:web-push library so the VAPID setup lives in one place.
//
// Server-side env vars (set as Supabase function secrets):
//   VAPID_PUBLIC_KEY  — VAPID public key (base64url)
//   VAPID_PRIVATE_KEY — VAPID private key (base64url)
//   VAPID_SUBJECT     — mailto: or https:// identifying the sender
//
// If any of those are missing, `sendPushToAll` throws so the calling
// function can return a clear 500 instead of silently dropping pushes.
import webpush from 'npm:web-push@3.6.7';
import type { SupabaseClient } from 'jsr:@supabase/supabase-js@2';

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

export type PushFanoutResult = {
  sent: number;
  failed: number;
  removed: number;
};

type SubscriptionRow = {
  id: string;
  endpoint: string;
  p256dh: string;
  auth_secret: string;
};

let configured = false;

function configure() {
  if (configured) return;
  const pub = Deno.env.get('VAPID_PUBLIC_KEY');
  const priv = Deno.env.get('VAPID_PRIVATE_KEY');
  const subject = Deno.env.get('VAPID_SUBJECT');
  if (!pub || !priv || !subject) {
    throw new Error(
      'Push not configured: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, and VAPID_SUBJECT must be set.',
    );
  }
  webpush.setVapidDetails(subject, pub, priv);
  configured = true;
}

export function isPushConfigured(): boolean {
  return Boolean(
    Deno.env.get('VAPID_PUBLIC_KEY') &&
      Deno.env.get('VAPID_PRIVATE_KEY') &&
      Deno.env.get('VAPID_SUBJECT'),
  );
}

// CX-H2 #4 — bounded fan-out. Sub-set is paged so a malicious user
// cannot cause one giant in-memory blob, and each batch is sent with a
// hard concurrency cap + per-request timeout so the function cannot be
// stalled by a slow push gateway.
const PAGE_SIZE = 1000;
const CONCURRENCY = 50;
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Fan out a push payload to every row in `push_subscriptions`. Stale
 * endpoints (404/410) are deleted so the table self-heals.
 */
export async function sendPushToAll(
  client: SupabaseClient,
  payload: PushPayload,
): Promise<PushFanoutResult> {
  configure();

  const json = JSON.stringify(payload);

  let sent = 0;
  let failed = 0;
  const staleIds: string[] = [];

  let from = 0;
  while (true) {
    const { data, error } = await client
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth_secret')
      .order('id', { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    const subs = (data ?? []) as SubscriptionRow[];
    if (subs.length === 0) break;

    for (let i = 0; i < subs.length; i += CONCURRENCY) {
      const chunk = subs.slice(i, i + CONCURRENCY);
      const results = await Promise.allSettled(
        chunk.map((row) => sendOne(row, json)),
      );
      for (let j = 0; j < results.length; j++) {
        const r = results[j];
        const row = chunk[j];
        if (r.status === 'fulfilled') {
          sent++;
        } else {
          const err = r.reason;
          const statusCode = (err as { statusCode?: number })?.statusCode;
          if (statusCode === 404 || statusCode === 410) {
            staleIds.push(row.id);
          } else {
            failed++;
            console.error('[webPush] send failed', statusCode, err);
          }
        }
      }
    }

    if (subs.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  let removed = 0;
  if (staleIds.length > 0) {
    const { error: delError } = await client
      .from('push_subscriptions')
      .delete()
      .in('id', staleIds);
    if (delError) {
      console.error('[webPush] failed to clean up stale subscriptions', delError);
    } else {
      removed = staleIds.length;
    }
  }

  return { sent, failed, removed };
}

async function sendOne(row: SubscriptionRow, payloadJson: string): Promise<void> {
  // Belt-and-suspenders timeout: pass `signal` (in case web-push forwards
  // it to fetch in this version) AND race the whole call against a
  // wall-clock timer so a stalled gateway can't hang the fan-out even if
  // the library swallows the AbortSignal.
  const controller = new AbortController();
  let timeoutTimer: number | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutTimer = setTimeout(() => {
      controller.abort();
      reject(new Error('web-push request timeout'));
    }, REQUEST_TIMEOUT_MS) as unknown as number;
  });
  try {
    await Promise.race([
      webpush.sendNotification(
        {
          endpoint: row.endpoint,
          keys: { p256dh: row.p256dh, auth: row.auth_secret },
        },
        payloadJson,
        { signal: controller.signal } as Record<string, unknown>,
      ),
      timeoutPromise,
    ]);
  } finally {
    if (timeoutTimer !== undefined) clearTimeout(timeoutTimer);
  }
}
