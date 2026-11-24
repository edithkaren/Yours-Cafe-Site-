-- Run in Supabase SQL editor. Creates all tables with RLS.

create extension if not exists "pgcrypto";

-- Admins are Supabase Auth users listed here
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.menu_categories(id) on delete cascade,
  name text not null,
  description text not null default '',
  price numeric(10,2) not null check (price >= 0),
  is_veg boolean not null default true,
  spice_level smallint not null default 0 check (spice_level between 0 and 3),
  is_bestseller boolean not null default false,
  is_available boolean not null default true,
  add_ons jsonb not null default '[]'::jsonb,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.specials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  price numeric(10,2),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  event_date text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  image_url text not null,
  alt_text text not null default '',
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  phone text not null check (char_length(phone) between 7 and 20),
  email text,
  reservation_date date not null,
  reservation_time time not null,
  guests int not null check (guests between 1 and 50),
  occasion text not null default 'casual',
  seating text not null default 'indoor',
  notes text check (char_length(notes) <= 500),
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','completed')),
  created_at timestamptz not null default now()
);
create index if not exists reservations_date_idx on public.reservations (reservation_date, reservation_time);

create table if not exists public.group_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  inquiry_date date,
  guests int not null check (guests between 1 and 500),
  occasion text not null default 'other',
  message text not null default '',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  name text,
  visit_date date,
  overall_rating smallint not null check (overall_rating between 1 and 5),
  food_rating smallint check (food_rating between 1 and 5),
  service_rating smallint check (service_rating between 1 and 5),
  ambience_rating smallint check (ambience_rating between 1 and 5),
  message text not null default '',
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.loyalty_signups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------- Row Level Security ----------
alter table public.admins enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.offers enable row level security;
alter table public.specials enable row level security;
alter table public.events enable row level security;
alter table public.gallery_images enable row level security;
alter table public.reservations enable row level security;
alter table public.group_inquiries enable row level security;
alter table public.feedback enable row level security;
alter table public.loyalty_signups enable row level security;
alter table public.site_settings enable row level security;

-- Admins table: users can only see whether they themselves are admin
create policy "admins read self" on public.admins for select using (user_id = auth.uid());

-- Public read of published content
create policy "categories public read" on public.menu_categories for select using (true);
create policy "menu public read" on public.menu_items for select using (true);
create policy "offers public read" on public.offers for select using (is_active);
create policy "specials public read" on public.specials for select using (is_active);
create policy "events public read" on public.events for select using (is_active);
create policy "gallery public read" on public.gallery_images for select using (is_visible);
create policy "feedback public read" on public.feedback for select using (is_public);
create policy "settings public read" on public.site_settings for select using (true);

-- Public write: submissions only (no reads of other people's submissions)
create policy "reservations public insert" on public.reservations for insert
  with check (status = 'pending' and reservation_date >= current_date);
create policy "group public insert" on public.group_inquiries for insert with check (true);
create policy "feedback public insert" on public.feedback for insert with check (is_public = false);
create policy "loyalty public insert" on public.loyalty_signups for insert with check (true);

-- Admin full access
do $$
declare t text;
begin
  foreach t in array array[
    'menu_categories','menu_items','offers','specials','events','gallery_images',
    'reservations','group_inquiries','feedback','loyalty_signups','site_settings'
  ]
  loop
    execute format('create policy "admin all %1$s" on public.%1$s for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- Overlap prevention: a seat-slot cannot be double-booked for the same date/time
-- (simple guard; tune to your seating capacity in the admin settings)
create or replace function public.count_bookings_at(d date, t time)
returns int language sql stable security definer set search_path = public as $$
  select count(*)::int from public.reservations
  where reservation_date = d and reservation_time = t and status in ('pending','confirmed');
$$;
