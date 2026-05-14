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

/**
 * Fan out a push payload to every row in `push_subscriptions`. Stale
 * endpoints (404/410) are deleted so the table self-heals.
 */
export async function sendPushToAll(
  client: SupabaseClient,
  payload: PushPayload,
): Promise<PushFanoutResult> {
  configure();

  const { data, error } = await client
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth_secret');
  if (error) throw error;

  const subs = (data ?? []) as SubscriptionRow[];
  const json = JSON.stringify(payload);

  let sent = 0;
  let failed = 0;
  const staleIds: string[] = [];

  await Promise.all(
    subs.map(async (row) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: row.endpoint,
            keys: { p256dh: row.p256dh, auth: row.auth_secret },
          },
          json,
        );
        sent++;
      } catch (err) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          staleIds.push(row.id);
        } else {
          failed++;
          console.error('[webPush] send failed', statusCode, err);
        }
      }
    }),
  );

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
