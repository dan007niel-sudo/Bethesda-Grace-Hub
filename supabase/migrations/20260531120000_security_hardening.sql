-- Security Hardening v2
-- Bundles:
--   H1     — rate_limits table + atomic increment RPC for chat IP throttling
--   CX-H1  — enable RLS on push_sent_log (service_role only)
--   CX-H2  — push_subscriptions: endpoint allowlist + length caps + per-user quota
-- See: 01 Inbox/Bethesda Grace Hub - Code Review 2026-05-19.md
--
-- All new CHECK constraints on `push_subscriptions` are added as NOT VALID
-- so the migration never blocks on legacy rows already in production.
-- After deploy, run the audit queries below and, once clean,
-- `alter table public.push_subscriptions validate constraint <name>;`
-- manually to promote each constraint to fully validated.
--
-- Audit queries (run post-deploy before VALIDATE):
--   select count(*) from public.push_subscriptions
--     where endpoint !~ '^https://(fcm\.googleapis\.com|.*\.push\.apple\.com|.*\.notify\.windows\.com|updates\.push\.services\.mozilla\.com)/'
--        or length(endpoint) > 2000;
--   select count(*) from public.push_subscriptions
--     where length(p256dh) not between 64 and 200;
--   select count(*) from public.push_subscriptions
--     where length(auth_secret) not between 16 and 50;
-- If any return > 0, widen the regex / bounds via follow-up migration before VALIDATE.

-- ---------------------------------------------------------------------------
-- H1 — Rate limit storage for the public `chat` Edge Function.
-- One row per (ip, window_start). Two windows are used at runtime:
--   - per-minute (floor-to-minute timestamps)
--   - per-day    (floor-to-day timestamps)
-- Old rows can age in place; the bucket key naturally renders them inert.
-- ---------------------------------------------------------------------------

create table if not exists public.rate_limits (
  ip            text        not null,
  window_start  timestamptz not null,
  count         int         not null default 0,
  unique (ip, window_start)
);

-- Full index on (ip, window_start). A partial index with a now()-based
-- predicate would be ideal for steady-state size, but Postgres rejects
-- non-IMMUTABLE functions in index predicates (SQLSTATE 42P17). Storage
-- impact is negligible on a bucketed rate-limit table; clean up old rows
-- via a future pg_cron job if it grows.
create index if not exists rate_limits_lookup_idx
  on public.rate_limits (ip, window_start);

alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from anon, authenticated;
-- No policies → only service_role can touch this table.

-- Atomic upsert + increment + return new count. Service-role only.
create or replace function public.increment_rate_limit(
  p_ip text,
  p_window_start timestamptz
) returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  insert into public.rate_limits (ip, window_start, count)
  values (p_ip, p_window_start, 1)
  on conflict (ip, window_start)
    do update set count = public.rate_limits.count + 1
  returning count into v_count;
  return v_count;
end
$$;

revoke all on function public.increment_rate_limit(text, timestamptz) from public;
grant execute on function public.increment_rate_limit(text, timestamptz) to service_role;

-- ---------------------------------------------------------------------------
-- CX-H1 — push_sent_log: lock down to service_role only.
-- The dedupe gate for cron-driven reminders must not be writable by anon
-- or authenticated clients, otherwise the Sunday-Service reminder can be
-- suppressed by inserting a matching reminder_key.
-- ---------------------------------------------------------------------------

alter table public.push_sent_log enable row level security;
revoke all on public.push_sent_log from anon, authenticated;
-- No policies → service_role only.

-- ---------------------------------------------------------------------------
-- CX-H2 — push_subscriptions hardening: endpoint allowlist, length caps,
-- per-user quota (max 5 active subscriptions).
--
-- All CHECK constraints are added NOT VALID so production rows that don't
-- match (legacy data, unusual gateways) don't block the migration. New
-- inserts/updates are still rejected; existing rows are tolerated until
-- they're cleaned up and VALIDATE is run manually.
-- ---------------------------------------------------------------------------

-- 1) Endpoint must be HTTPS and point at one of the known web-push
--    gateways. Enumerated explicitly rather than a wildcard so a
--    malicious "https://evil.com" cannot be inserted.
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'push_endpoint_valid') then
    alter table public.push_subscriptions
      add constraint push_endpoint_valid
      check (
        length(endpoint) <= 2000
        and endpoint ~ '^https://(fcm\.googleapis\.com/|.*\.push\.apple\.com/|web\.push\.apple\.com/|.*\.notify\.windows\.com/|updates\.push\.services\.mozilla\.com/)'
      ) not valid;
  end if;
end $$;

-- 2) Length caps on the keys. Per RFC 8291 / web-push the p256dh public
--    key is 65 raw bytes → ~88 base64url chars; the auth secret is
--    16 raw bytes → ~22 base64url chars. Generous bounds prevent
--    storage-bloat from a malicious client.
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'push_p256dh_len') then
    alter table public.push_subscriptions
      add constraint push_p256dh_len
      check (length(p256dh) between 64 and 200) not valid;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'push_auth_len') then
    alter table public.push_subscriptions
      add constraint push_auth_len
      check (length(auth_secret) between 16 and 50) not valid;
  end if;
end $$;

-- 3) Per-user quota: max 5 active push subscriptions.
--    Advisory xact lock per user_id serializes concurrent inserts so the
--    count(*) check can't be raced (two concurrent inserts both seeing 4).
create or replace function public.enforce_push_quota()
returns trigger
language plpgsql
as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 0));
  if (select count(*) from public.push_subscriptions where user_id = new.user_id) >= 5 then
    raise exception 'push subscription quota exceeded (max 5)' using errcode = '23514';
  end if;
  return new;
end
$$;

drop trigger if exists push_quota_trigger on public.push_subscriptions;
create trigger push_quota_trigger
  before insert on public.push_subscriptions
  for each row execute function public.enforce_push_quota();
