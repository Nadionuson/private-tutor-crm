create type lesson_status as enum ('scheduled', 'completed', 'cancelled');

create table students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age integer not null check (age > 0),
  grade text not null,
  parent_name text not null,
  parent_email text not null,
  parent_phone text not null,
  hourly_rate numeric(10,2) not null check (hourly_rate > 0),
  start_date date not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  scheduled_at timestamptz not null,
  duration_minutes integer not null check (duration_minutes > 0),
  rate_at_time numeric(10,2) not null,
  status lesson_status not null default 'scheduled',
  created_at timestamptz not null default now()
);

create table lesson_notes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null unique references lessons(id) on delete cascade,
  topic text not null default '',
  prep_notes text not null default '',
  outcome_notes text not null default '',
  created_at timestamptz not null default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  amount numeric(10,2) not null check (amount > 0),
  paid_at date not null,
  notes text,
  created_at timestamptz not null default now()
);

create table allowed_emails (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  added_at timestamptz not null default now(),
  added_by text not null default ''
);

-- Storage bucket for avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict do nothing;

create policy "Public avatar read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Auth avatar upload" on storage.objects
  for insert with check (bucket_id = 'avatars');

create policy "Auth avatar update" on storage.objects
  for update using (bucket_id = 'avatars');

create policy "Auth avatar delete" on storage.objects
  for delete using (bucket_id = 'avatars');
