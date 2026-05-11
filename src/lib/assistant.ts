// Client for the Grace Assistant Supabase Edge Function.
//
// VITE_AI_ENDPOINT must be the full URL, e.g.
//   https://abcdef12345.supabase.co/functions/v1/chat
// Optional VITE_SUPABASE_ANON_KEY is sent as the apikey header (some Supabase
// projects require it even for --no-verify-jwt functions).

export type AssistantTurn = { role: 'user' | 'model'; text: string };

const ENDPOINT = import.meta.env.VITE_AI_ENDPOINT as string | undefined;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isAssistantConfigured = Boolean(ENDPOINT);

export async function askGraceAssistant(
  message: string,
  history: AssistantTurn[],
  context?: string,
): Promise<string> {
  if (!ENDPOINT) {
    throw new Error('AI endpoint not configured');
  }
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (ANON_KEY) {
    headers.apikey = ANON_KEY;
    headers.Authorization = `Bearer ${ANON_KEY}`;
  }
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({ message, history, ...(context ? { context } : {}) }),
  });
  if (!r.ok) {
    const txt = await r.text().catch(() => '');
    throw new Error(`Assistant error (${r.status}): ${txt.slice(0, 200)}`);
  }
  const data = (await r.json()) as { text?: string; error?: string };
  if (data.error) throw new Error(data.error);
  if (!data.text) throw new Error('Empty response');
  return data.text;
}
