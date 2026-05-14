-- Push notifications: per-user web-push subscriptions + dedupe log for
-- automated reminder fan-out.
-- See plan: /Users/daniel.lordson/.claude/plans/lies-die-claude-md-und-keen-coral.md

create table public.push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  endpoint    text not null,
  p256dh      text not null,
  auth_secret text not null,
  user_agent  text,
  created_at  timestamptz not null default now(),
  unique (user_id, endpoint)
);

create index push_subscriptions_user_idx
  on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;

create policy "own rows readable"   on public.push_subscriptions
  for select using (auth.uid() = user_id);
create policy "own rows insertable" on public.push_subscriptions
  for insert with check (auth.uid() = user_id);
create policy "own rows updatable"  on public.push_subscriptions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows deletable"  on public.push_subscriptions
  for delete using (auth.uid() = user_id);

-- Dedupe log for cron-driven reminders. Only ever written to by the
-- service_role from the cron-reminders Edge Function, so no RLS policies.
create table public.push_sent_log (
  id               uuid primary key default gen_random_uuid(),
  reminder_key     text not null unique,  -- e.g. "sunday-service:2026-05-17"
  sent_at          timestamptz not null default now(),
  recipients_count int not null default 0
);
