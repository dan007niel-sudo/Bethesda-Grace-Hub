# Bethesda Grace Hub

A digital home for grace, growth, and service — the web app / PWA for **Bethesda Evangelical Church · House of Grace**.

> "For all have sinned, and come short of the glory of God; being justified freely by his grace through the redemption that is in Christ Jesus."
> Romans 3:23–24

## Status

MVP foundation. Static / mock data only — no backend, no auth, no real assistant.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS (design tokens: burgundy / gold / cream / charcoal)
- React Router v6
- react-i18next (single `en.json`, German planned)
- vite-plugin-pwa (installable, app-shell service worker)
- lucide-react

## Develop

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production build (regenerates icons)
npm run preview      # preview built app + PWA install prompt
npm run icons        # regenerate PWA icons from scripts/generate-icons.mjs
```

## Layout

```
src/
  app/          App shell + router
  components/   Reusable UI (Button, Card, Modal, FormField, …)
  data/         Mock data with async loaders (getSermons, …)
  features/     Page-level feature folders
  i18n/         react-i18next setup + locales/en.json
  styles/       Design tokens + global CSS
public/         PWA icons + favicon
scripts/        Build-time icon generator (sharp)
```

## Notes

- All user-facing copy lives in `src/i18n/locales/en.json` — no hard-coded strings in components.
- Data is fetched through small async getters so the loaders can be swapped to Supabase later without touching pages.
- The Grace Assistant is a constrained preview: only the four suggested prompts work; the free-text input is intentionally disabled.
- The Prayer form opens the user's mail client (`mailto:`) on submit — no fake success state.
- The Admin Preview is read-only — no create / edit / delete in the MVP.
