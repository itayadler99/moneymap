-- MoneyMap DB schema
-- Paste this in Supabase SQL Editor and run.
-- Safe to re-run (uses IF NOT EXISTS / DROP IF EXISTS where needed).

-- =============================================================
-- 1. PROFILES (extends auth.users)
-- =============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  monthly_income_avg numeric(12,2),
  primary_goal text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================================
-- 2. CATEGORIES
-- =============================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  icon text not null default '📦',
  color text not null default '#64748b',
  type text not null check (type in ('fixed', 'variable', 'income')),
  created_at timestamptz default now() not null
);

create index if not exists idx_categories_user on public.categories(user_id);

alter table public.categories enable row level security;

drop policy if exists "Users can view own categories" on public.categories;
create policy "Users can view own categories"
  on public.categories for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own categories" on public.categories;
create policy "Users can insert own categories"
  on public.categories for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own categories" on public.categories;
create policy "Users can update own categories"
  on public.categories for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own categories" on public.categories;
create policy "Users can delete own categories"
  on public.categories for delete
  using (auth.uid() = user_id);

-- =============================================================
-- 3. TRANSACTIONS
-- =============================================================
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  type text not null check (type in ('income', 'expense')),
  category_id uuid not null references public.categories(id) on delete restrict,
  description text,
  date date not null default current_date,
  is_recurring boolean not null default false,
  created_at timestamptz default now() not null
);

create index if not exists idx_transactions_user_date on public.transactions(user_id, date desc);
create index if not exists idx_transactions_user_category on public.transactions(user_id, category_id);

alter table public.transactions enable row level security;

drop policy if exists "Users can view own transactions" on public.transactions;
create policy "Users can view own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own transactions" on public.transactions;
create policy "Users can insert own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own transactions" on public.transactions;
create policy "Users can update own transactions"
  on public.transactions for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own transactions" on public.transactions;
create policy "Users can delete own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- =============================================================
-- 4. BUDGETS (monthly limit per category)
-- =============================================================
create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  monthly_limit numeric(12,2) not null check (monthly_limit >= 0),
  month text not null,  -- format: 'YYYY-MM'
  created_at timestamptz default now() not null,
  unique (user_id, category_id, month)
);

create index if not exists idx_budgets_user_month on public.budgets(user_id, month);

alter table public.budgets enable row level security;

drop policy if exists "Users can view own budgets" on public.budgets;
create policy "Users can view own budgets"
  on public.budgets for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own budgets" on public.budgets;
create policy "Users can insert own budgets"
  on public.budgets for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own budgets" on public.budgets;
create policy "Users can update own budgets"
  on public.budgets for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own budgets" on public.budgets;
create policy "Users can delete own budgets"
  on public.budgets for delete using (auth.uid() = user_id);

-- =============================================================
-- 5. GOALS
-- =============================================================
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  target_amount numeric(12,2) not null check (target_amount > 0),
  current_amount numeric(12,2) not null default 0 check (current_amount >= 0),
  target_date date,
  created_at timestamptz default now() not null
);

create index if not exists idx_goals_user on public.goals(user_id);

alter table public.goals enable row level security;

drop policy if exists "Users can view own goals" on public.goals;
create policy "Users can view own goals"
  on public.goals for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own goals" on public.goals;
create policy "Users can insert own goals"
  on public.goals for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own goals" on public.goals;
create policy "Users can update own goals"
  on public.goals for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own goals" on public.goals;
create policy "Users can delete own goals"
  on public.goals for delete using (auth.uid() = user_id);

-- =============================================================
-- DONE
-- =============================================================
