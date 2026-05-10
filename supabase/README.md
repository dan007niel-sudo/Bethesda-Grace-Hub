# Supabase Edge Function — Grace Assistant

The `chat` function proxies a conversation through Google Gemini, with the
church's own knowledge base injected as the system prompt. This keeps the
Gemini API key on the server side (the static frontend never sees it).

## One-time setup

```bash
# 1. Install the Supabase CLI (macOS)
brew install supabase/tap/supabase

# 2. Sign in
supabase login

# 3. From the repo root, init Supabase config (adds supabase/config.toml)
supabase init           # safe to run; will skip the functions folder

# 4. Link to your Supabase project (create one at https://supabase.com/dashboard)
supabase link --project-ref <your-project-ref>

# 5. Store the Gemini API key as a function secret
supabase secrets set GEMINI_API_KEY=<your-google-ai-key>

# Optional: tighten CORS to the prod origin
supabase secrets set ALLOWED_ORIGIN=https://bethesda-grace-hub.onrender.com

# Optional: pick a different Gemini model (default: gemini-2.5-flash)
supabase secrets set GEMINI_MODEL=gemini-2.5-flash
```

## Deploying

```bash
# Refresh the embedded knowledge after editing src/data/knowledge.md
npm run knowledge:sync

# Deploy the function as a public endpoint (no Supabase JWT required)
supabase functions deploy chat --no-verify-jwt
```

The function URL is then:

```
https://<your-project-ref>.supabase.co/functions/v1/chat
```

## Wiring the frontend

Set these on Render → service → Environment (for the static site):

```
VITE_AI_ENDPOINT=https://<your-project-ref>.supabase.co/functions/v1/chat
VITE_SUPABASE_ANON_KEY=<anon-key>     # only if your project requires it
```

After saving, Render rebuilds the static site and the Grace Assistant
free-text input is automatically enabled.

## Quick smoke test

```bash
curl -s -X POST \
  -H 'content-type: application/json' \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -d '{"message":"What time is the Sunday Service?"}' \
  https://<your-project-ref>.supabase.co/functions/v1/chat
```

You should get a short, on-tone answer mentioning 13:30 and the Lange Str.
address.

## Updating knowledge

`src/data/knowledge.md` is the single source of truth.
After editing, run `npm run knowledge:sync` (also runs automatically on
`npm run build`) and redeploy: `supabase functions deploy chat --no-verify-jwt`.
