// Frontend-only admin allowlist — decides what's visible in the UI.
// The server-side source of truth lives in the `ADMIN_EMAILS` env var of
// the send-push Edge Function. BOTH lists must be kept in sync.
export const FRONTEND_ADMIN_EMAILS = new Set<string>([
  'daniel.lordson@icloud.com',
  // TODO: add Pastor Stephen Essah's email once confirmed.
]);

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return FRONTEND_ADMIN_EMAILS.has(email.toLowerCase());
}
