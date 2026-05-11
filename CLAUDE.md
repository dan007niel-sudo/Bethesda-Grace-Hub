# Bethesda Grace Hub — Project CLAUDE.md

The digital companion app of Bethesda Evangelical Church · House of Grace
(Lange Str. 19A, 49080 Osnabrück). Static PWA + Supabase Edge Function +
Gemini for the in-app Grace Assistant.

## What this app is — and isn't

It is **not** a duplicate of the church's website
(<https://bethesda-five.vercel.app/>). The website covers about/mission/
sermons/ministries/events for visitors. This app is the member-facing daily
tool: schedule, AI assistant grounded in the church's teaching, prayer,
directions, future push notifications and personal devotional. When in doubt
about whether a feature belongs in the app, ask: "would a daily member open
this every day?"

## Stack

| Layer | Tech |
|---|---|
| Frontend | Vite 8 + React 18 + TypeScript |
| Styling | Tailwind v3 with design tokens (burgundy / gold / cream / charcoal / soft-border) |
| Routing | React Router v6 |
| i18n | react-i18next, single `en.json` (German planned) |
| PWA | vite-plugin-pwa, manifest + minimal app-shell SW |
| Map | Leaflet + OpenStreetMap |
| Backend (AI) | Supabase Edge Function (Deno) calling Gemini |
| Hosting | Render Static Site (frontend) + Supabase (function) |

## Architecture

```
Browser
  ├── Static site (Render)  ──── images, fonts, OSM tiles
  └── POST /functions/v1/chat  ──→  Supabase Edge Function (chat)
                                       │
                                       │ system prompt = knowledge.md
                                       └──→ Gemini 2.5 Flash
```

No database, no auth, no server-side sessions in MVP. The Edge Function is
the only backend.

## Key files (single sources of truth)

| File | Owns |
|---|---|
| `src/data/knowledge.md` | **The truth for the AI.** Everything the Grace Assistant knows about the church. Edit here → `npm run knowledge:sync` → redeploy function. |
| `src/i18n/locales/en.json` | **The truth for UI copy.** Every user-facing string in the app. No hardcoded strings outside `src/features/dev/`. |
| `src/data/events.ts` | Weekly schedule + biweekly recurrence + Zoom info + church address constants. |
| `src/data/sermons.ts` | Placeholder sermon archive — replaced with real recordings later. |
| `src/data/admin.ts` | Mock rows for the read-only Admin Preview. |
| `supabase/functions/chat/index.ts` | The AI proxy. Holds the system prompt scaffold; imports `_knowledge.ts` (generated). |
| `scripts/sync-knowledge.mjs` | Bundles knowledge.md into `_knowledge.ts` for the function. |
| `scripts/generate-icons.mjs` | Generates PWA icons from `public/logo-source.jpg` with a circular alpha mask. |
| `render.yaml` | Static site config (build cmd, SPA rewrite, cache headers). |

## Conventions (non-negotiable)

1. **No hardcoded user-facing strings in components.** Every string goes through `t('key')` with the key defined in `en.json`. Exception: `src/features/dev/` is explicitly dev-only and exempt (file has a top-of-file comment saying so).
2. **Data is accessed via async loaders** (`getSermons()`, `getEvents()`, …) — not by importing raw arrays. Loaders live in `src/data/*.ts`. This is what lets us swap to Supabase later without touching pages.
3. **Colors come from design tokens**, never hex literals. Use Tailwind classes `text-burgundy`, `bg-cream`, `border-soft-border`, etc.
4. **Charcoal text opacity ≥ /70** for any visible text on cream. Lower opacities fail WCAG AA contrast. `/50` etc. is only OK for disabled states (WCAG-exempt).
5. **Icon-only buttons must have `aria-label`** (use `<IconButton label="…">`, which enforces it).
6. **Forms** — `FormField` handles label/`aria-describedby`/`aria-invalid`/`role="alert"` correctly; don't reinvent these.
7. **No mock success states.** Prayer form opens `mailto:` honestly. Admin Preview is read-only. Grace Assistant says "I don't know" instead of inventing.
8. **MVP non-goals** (do not silently add): real auth, database, Supabase Auth UI, sermon media playback, dark mode, offline data caching, push notifications. These are roadmap items, not drift.

## Deploy workflow

### Frontend (Render Static)
```
git push origin main
```
Render auto-rebuilds. Verify: `curl -s https://bethesda-grace-hub.onrender.com/ | grep -oE 'index-[A-Za-z0-9_-]+\.js'` returns a new hash within ~2 min.

### AI backend (Supabase Edge Function)
After editing `src/data/knowledge.md` or `supabase/functions/chat/index.ts`:
```
npm run knowledge:sync
SUPABASE_ACCESS_TOKEN=... ~/.local/bin/supabase functions deploy chat --no-verify-jwt
```
Edge Function deploys instantly, no Render rebuild needed.

Smoke test:
```
curl -s -X POST -H 'content-type: application/json' \
  -H "apikey: $ANON_KEY" \
  -d '{"message":"What time is the Sunday Service?"}' \
  https://kpculuksmtmqtmvmcjvn.supabase.co/functions/v1/chat
```
Expected: warm pastoral answer mentioning 13:30 and Lange Str.

### Render environment variables (set in dashboard, not render.yaml)
- `NODE_VERSION=22.14.0` (required — Vite 8 minimum)
- `VITE_AI_ENDPOINT=https://kpculuksmtmqtmvmcjvn.supabase.co/functions/v1/chat`
- `VITE_SUPABASE_ANON_KEY=<anon key>`

Changing any of these requires **Manual Deploy → Clear build cache & deploy** in the Render dashboard. Static-site env vars are baked at build time.

## Secrets / env vars

Server-side (Supabase function secrets, not in repo):
- `GEMINI_API_KEY` — Google AI key
- `ALLOWED_ORIGIN` — `https://bethesda-grace-hub.onrender.com`
- `GEMINI_MODEL` — defaults to `gemini-2.5-flash`

Client-side (Render env, baked into static bundle):
- `VITE_AI_ENDPOINT`
- `VITE_SUPABASE_ANON_KEY`

## Lessons Learned

Bugs and footguns we've already solved. **Always add to this list** when a non-obvious problem bites and gets fixed.

### Build / hosting
- **Vite 8 requires Node ≥ 20.19 or ≥ 22.12.** Render's default Node is too old. Pin `NODE_VERSION=22.14.0` in the Render dashboard env vars (the dashboard value overrides `render.yaml`).
- **Render Static Site env-vars are baked at build time.** Changing `VITE_*` vars does *not* auto-trigger a rebuild; the site shows "Live" but with the old bundle. Fix: dashboard → Manual Deploy → "Clear build cache & deploy".
- **Render dashboard env-var values override `render.yaml`.** If a value is set in the dashboard, the YAML is ignored for that key. Either remove it from the dashboard or update both.
- **Rolldown native binding errors at build** (`Cannot find module '@rolldown/binding-linux-x64-gnu'`) almost always mean the runtime Node version is below Vite 8's requirement. Bump Node, don't blindly reinstall.

### Assets / icons
- **JPEG logos can't carry transparency.** A JPEG source on a cream background shows as a white square. Fix in `scripts/generate-icons.mjs`: apply a circular alpha mask via sharp's `composite([{ input: circleMaskSvg, blend: 'dest-in' }])`.
- **Home-screen icons should be solid-brand-color, not cream.** iOS shows the apple-touch-icon raw on the home screen alongside other vivid icons; a cream square looks pale. Use burgundy fill + circular logo inside.
- **Maskable PWA icons need ~15% padding** so the OS's circle/squircle crop doesn't eat the logo. Standard "any" icons can sit at ~11% padding.

### Supabase
- **Supabase CLI can't be installed as a global npm module** — installer rejects it. Either `brew install supabase/tap/supabase` or download the binary tarball from GitHub releases (`supabase_darwin_arm64.tar.gz`) and put it on PATH.
- **Edge Functions deploy instantly**, no static-site rebuild needed. After `supabase functions deploy chat`, the new behavior is live within seconds. Don't wait on Render.
- **`--no-verify-jwt` is required** for the chat function to be callable from the public app without a session. The frontend still sends the anon key in `apikey` + `Authorization` headers because Supabase's gateway expects them.

### AI / knowledge base
- **The Grace Assistant only knows what's in `src/data/knowledge.md`.** Any time it answers "I don't see X listed", the fix is to add X to knowledge.md, then sync + redeploy. Single source of truth.
- **The assistant must know it lives inside an app called "Bethesda Grace Hub"** — without that note in the knowledge base, it confuses the app's name with a separate ministry.

### Scraping
- **`bethesda-five.vercel.app/sermons` and `/events` return 404** as of 2026-05-10, even though navigation links to them. The pages aren't deployed yet. Don't trust the nav — check the actual URLs.

### Content
- **Official church email is `besthesdahouseofgrace1010@gmail.com`** (note `bes`thesda, not `be`thesda) — preserved verbatim from the website. Likely a typo on the site itself; do not silently "fix" it without confirming with the church first.
