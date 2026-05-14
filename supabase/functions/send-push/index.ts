// Supabase Edge Function: send a push notification to every subscribed
// member. Caller must be an authenticated user whose email is in the
// `ADMIN_EMAILS` env list (comma-separated, lowercase-compared).
//
// Endpoint: POST {SUPABASE_URL}/functions/v1/send-push
// Body:     { title: string, body: string, url?: string }
// Response: { sent, failed, removed } | { error: string }
//
// Deploy:
//   1. supabase secrets set VAPID_PUBLIC_KEY=... VAPID_PRIVATE_KEY=... \
//        VAPID_SUBJECT=mailto:... ADMIN_EMAILS=a@x.com,b@y.com
//   2. supabase functions deploy send-push --no-verify-jwt
//
// The service-role key is auto-injected as SUPABASE_SERVICE_ROLE_KEY in the
// Edge Function runtime — used to bypass RLS for the fan-out query.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { isPushConfigured, sendPushToAll } from '../_shared/webPush.ts';

const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') ?? '*';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const TITLE_MAX = 60;
const BODY_MAX = 200;

function adminEmails(): Set<string> {
  const raw = Deno.env.get('ADMIN_EMAILS') ?? '';
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  if (!isPushConfigured()) {
    return json({ error: 'Push not configured on server' }, 500);
  }
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    return json({ error: 'Supabase keys not configured' }, 500);
  }

  // 1) Identify caller via their JWT, then check the allowlist.
  const authHeader = req.headers.get('Authorization') ?? '';
  const token = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7)
    : '';
  if (!token) return json({ error: 'Missing bearer token' }, 401);

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser(token);
  if (userError || !userData.user) {
    return json({ error: 'Unauthenticated' }, 401);
  }
  const email = userData.user.email?.toLowerCase() ?? '';
  if (!adminEmails().has(email)) {
    return json({ error: 'Not authorized' }, 403);
  }

  // 2) Validate body.
  let body: { title?: unknown; body?: unknown; url?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const message = typeof body.body === 'string' ? body.body.trim() : '';
  const url = typeof body.url === 'string' ? body.url.trim() : '';
  if (!title || title.length > TITLE_MAX) {
    return json({ error: 'Invalid title' }, 400);
  }
  if (!message || message.length > BODY_MAX) {
    return json({ error: 'Invalid body' }, 400);
  }

  // 3) Fan out with the service role (bypasses RLS).
  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  try {
    const result = await sendPushToAll(adminClient, {
      title,
      body: message,
      url: url || undefined,
    });
    return json(result);
  } catch (err) {
    console.error('[send-push] fan-out failed', err);
    return json({ error: 'Internal error' }, 500);
  }
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}
