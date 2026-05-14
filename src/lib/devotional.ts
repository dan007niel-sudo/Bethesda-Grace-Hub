// Client for the daily devotional Supabase Edge Function.
//
// Endpoint is derived from VITE_AI_ENDPOINT by swapping the trailing
// /chat for /devotional, so a single Render env var configures both.

export type Devotional = {
  date: string;
  verse: string;
  reference: string;
  reflection: string;
};

const AI_ENDPOINT = import.meta.env.VITE_AI_ENDPOINT as string | undefined;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const DEVOTIONAL_ENDPOINT = AI_ENDPOINT
  ? AI_ENDPOINT.replace(/\/chat$/, '/devotional')
  : undefined;

export const isDevotionalConfigured = Boolean(DEVOTIONAL_ENDPOINT);

export async function getDevotional(): Promise<Devotional> {
  if (!DEVOTIONAL_ENDPOINT) {
    throw new Error('Devotional endpoint not configured');
  }
  const headers: Record<string, string> = {};
  if (ANON_KEY) {
    headers.apikey = ANON_KEY;
    headers.Authorization = `Bearer ${ANON_KEY}`;
  }
  const r = await fetch(DEVOTIONAL_ENDPOINT, { method: 'GET', headers });
  if (!r.ok) {
    const txt = await r.text().catch(() => '');
    throw new Error(`Devotional error (${r.status}): ${txt.slice(0, 200)}`);
  }
  const data = (await r.json()) as Partial<Devotional> & { error?: string };
  if (data.error) throw new Error(data.error);
  if (
    typeof data.date !== 'string' ||
    typeof data.verse !== 'string' ||
    typeof data.reference !== 'string' ||
    typeof data.reflection !== 'string' ||
    !data.verse.trim() ||
    !data.reference.trim() ||
    !data.reflection.trim()
  ) {
    throw new Error('Devotional response malformed');
  }
  return {
    date: data.date,
    verse: data.verse,
    reference: data.reference,
    reflection: data.reflection,
  };
}
