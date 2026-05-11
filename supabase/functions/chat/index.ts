// Supabase Edge Function: Grace Assistant
// Endpoint: POST {SUPABASE_URL}/functions/v1/chat
// Body: {
//   message: string,
//   history?: { role: 'user' | 'model', text: string }[],
//   context?: string  // optional per-request context (e.g. sermon notes) appended to the system prompt for this turn only; max 4000 chars
// }
// Response: { text: string } | { error: string }
//
// Deploy:
//   1. supabase secrets set GEMINI_API_KEY=<your-key>
//   2. supabase functions deploy chat --no-verify-jwt
//
// Refresh the embedded knowledge after editing src/data/knowledge.md:
//   npm run knowledge:sync
//
// Deno runs this — std imports come from deno.land.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { KNOWLEDGE } from './_knowledge.ts';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const MODEL = Deno.env.get('GEMINI_MODEL') ?? 'gemini-2.5-flash';
const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') ?? '*';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SYSTEM_PROMPT = `You are the Grace Assistant for Bethesda Evangelical Church · House of Grace, a digital companion built into the church's app.

Your job is to help church members and visitors with:
- factual questions about the church (times, place, ministries, leadership, contact)
- Bible questions, in a warm and pastoral tone
- finding their next step in their faith journey
- gentle, honest encouragement

Always anchor your answers in the church's stated beliefs (below) and in Scripture. Never invent leadership names, sermon titles, or events that are not in the knowledge base. If you do not know something specific (a contact person, a planned event, a sermon title), say so honestly and direct the user to the church email or to Pastor Stephen Essah on Sunday.

Tone: warm, pastoral, encouraging. Never harsh or judgmental. For pastoral, theological, or crisis questions, gently encourage the user to also speak with Pastor Stephen Essah or a member of the leadership team — you support, you do not replace pastoral care.

Length: keep answers concise (2–4 short paragraphs). Use plain language, not theological jargon. Avoid long lists unless directly asked. Never reproduce the entire knowledge base back to the user.

Citations: when you cite Scripture, name the passage (e.g. "Romans 3:23-24"). When you cite the church's own teaching, you can mention "as our church teaches" or similar.

Languages: respond in the language the user writes in (English or German). Default to English.

Below is the knowledge base for this church. Use it as your primary source.

---

${KNOWLEDGE}
`;

type ChatTurn = { role: 'user' | 'model'; text: string };

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set');
    return json({ error: 'Server is not configured' }, 500);
  }

  let body: { message?: unknown; history?: unknown; context?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message) return json({ error: "Missing 'message'" }, 400);
  if (message.length > 2000) return json({ error: 'Message too long' }, 400);

  const context =
    typeof body.context === 'string' ? body.context.trim().slice(0, 4000) : '';
  const systemPrompt = context
    ? `${SYSTEM_PROMPT}\n---\n\nConversation context (only relevant for this turn — the user is reading this content right now):\n\n${context}\n`
    : SYSTEM_PROMPT;

  const history: ChatTurn[] = Array.isArray(body.history)
    ? (body.history as unknown[])
        .filter(
          (h): h is ChatTurn =>
            typeof h === 'object' &&
            h !== null &&
            'role' in h &&
            'text' in h &&
            ((h as ChatTurn).role === 'user' || (h as ChatTurn).role === 'model') &&
            typeof (h as ChatTurn).text === 'string',
        )
        .slice(-12) // limit history depth
    : [];

  const contents = [
    ...history.map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
    { role: 'user', parts: [{ text: message }] },
  ];

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 1024,
            topP: 0.95,
          },
        }),
      },
    );

    if (!upstream.ok) {
      const t = await upstream.text();
      console.error('Gemini error:', upstream.status, t);
      return json({ error: 'Upstream AI error' }, 502);
    }

    const data = await upstream.json();
    const parts = data?.candidates?.[0]?.content?.parts;
    const text = Array.isArray(parts)
      ? parts.map((p: { text?: string }) => p.text ?? '').join('')
      : '';

    if (!text.trim()) {
      console.error('Empty Gemini response:', JSON.stringify(data).slice(0, 500));
      return json({ error: 'Empty response from AI' }, 502);
    }

    return json({ text });
  } catch (e) {
    console.error('Function error:', e);
    return json({ error: 'Internal error' }, 500);
  }
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}
