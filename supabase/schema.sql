create table if not exists public.player_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  points integer not null default 0,
  purchased_coupons jsonb not null default '[]'::jsonb,
  used_coupon_ids jsonb not null default '[]'::jsonb,
  roulette_state jsonb not null default '{}'::jsonb,
  migrated_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.mock_exam_answers (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  answer_date date not null,
  question text not null,
  answer text not null,
  answered_at timestamptz not null default now(),
  unique (user_id, answer_date)
);

alter table public.player_state enable row level security;
alter table public.mock_exam_answers enable row level security;

drop policy if exists "Players can read their own state" on public.player_state;
create policy "Players can read their own state"
  on public.player_state for select
  using (auth.uid() = user_id);

drop policy if exists "Players can create their own state" on public.player_state;
create policy "Players can create their own state"
  on public.player_state for insert
  with check (auth.uid() = user_id);

drop policy if exists "Players can update their own state" on public.player_state;
create policy "Players can update their own state"
  on public.player_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Players can read their own answers" on public.mock_exam_answers;
create policy "Players can read their own answers"
  on public.mock_exam_answers for select
  using (auth.uid() = user_id);

drop policy if exists "Players can create their own answers" on public.mock_exam_answers;
create policy "Players can create their own answers"
  on public.mock_exam_answers for insert
  with check (auth.uid() = user_id);
