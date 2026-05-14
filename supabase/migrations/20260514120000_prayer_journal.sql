-- Prayer Journal: per-user private entries, protected by row-level security.
-- See plan: /Users/daniel.lordson/.claude/plans/lies-die-claude-md-und-keen-coral.md

create table public.prayer_journal (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  body        text not null check (length(body) between 1 and 4000),
  answered_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index prayer_journal_user_created_idx
  on public.prayer_journal (user_id, created_at desc);

alter table public.prayer_journal enable row level security;

create policy "own rows readable"   on public.prayer_journal
  for select using (auth.uid() = user_id);
create policy "own rows insertable" on public.prayer_journal
  for insert with check (auth.uid() = user_id);
create policy "own rows updatable"  on public.prayer_journal
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows deletable"  on public.prayer_journal
  for delete using (auth.uid() = user_id);

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger prayer_journal_touch_updated_at
before update on public.prayer_journal
for each row execute function public.touch_updated_at();
