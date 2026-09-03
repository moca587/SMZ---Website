-- SMZ Zürich website backend
-- Run this once in the Supabase SQL editor (Dashboard > SQL Editor > New query).
-- It is safe to re-run: every statement is idempotent.

-- ---------------------------------------------------------------- helpers
create extension if not exists "pgcrypto";

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------- tables
-- Every visible string exists twice, de and en, to match the site rule that
-- no string may be single-language.

create table if not exists public.news (
  id           uuid primary key default gen_random_uuid(),
  published_on date        not null default current_date,
  title_de     text        not null,
  title_en     text        not null,
  body_de      text        not null default '',
  body_en      text        not null default '',
  link         text,                 -- optional hash route, e.g. #/teams
  image_path   text,                 -- key in the media bucket
  featured     boolean     not null default false,
  published    boolean     not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.events (
  id           uuid primary key default gen_random_uuid(),
  starts_on    date        not null,
  ends_on      date,
  all_month    boolean     not null default false,  -- show "NOV 2026" instead of a day
  title_de     text        not null,
  title_en     text        not null,
  detail_de    text        not null default '',
  detail_en    text        not null default '',
  location     text,
  published    boolean     not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.photos (
  id           uuid primary key default gen_random_uuid(),
  image_path   text        not null,
  alt          text        not null default '',
  caption_de   text        not null default '',
  caption_en   text        not null default '',
  in_marquee   boolean     not null default true,
  sort         integer     not null default 100,
  published    boolean     not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.people (
  id           uuid primary key default gen_random_uuid(),
  kind         text        not null check (kind in ('board','coach')),
  name         text        not null,
  initials     text        not null default '',   -- avatar text, e.g. HW or U10
  role_de      text        not null default '',
  role_en      text        not null default '',
  email        text,
  sort         integer     not null default 100,
  published    boolean     not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.sponsors (
  id           uuid primary key default gen_random_uuid(),
  name         text        not null,
  tier         text        not null default 'partner' check (tier in ('gold','partner')),
  logo_path    text,
  url          text,
  label_de     text        not null default '',
  label_en     text        not null default '',
  dark_tile    boolean     not null default false, -- for logos that are white ink
  sort         integer     not null default 100,
  published    boolean     not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- keep updated_at honest
do $$
declare t text;
begin
  foreach t in array array['news','events','photos','people','sponsors'] loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format(
      'create trigger touch_%1$s before update on public.%1$s
       for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ---------------------------------------------------------------- indexes
create index if not exists news_order_idx     on public.news (published, published_on desc);
create index if not exists events_order_idx   on public.events (published, starts_on);
create index if not exists photos_order_idx   on public.photos (published, sort);
create index if not exists people_order_idx   on public.people (published, kind, sort);
create index if not exists sponsors_order_idx on public.sponsors (published, sort);

-- ---------------------------------------------------------------- security
-- Anyone may read published rows. Only a signed-in committee member may write.
-- The anon key is public by design; these policies are what actually protect
-- the data, so do not weaken them.

do $$
declare t text;
begin
  foreach t in array array['news','events','photos','people','sponsors'] loop
    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists "public reads published" on public.%I', t);
    execute format(
      'create policy "public reads published" on public.%I
       for select to anon, authenticated using (published = true)', t);

    execute format('drop policy if exists "editors read all" on public.%I', t);
    execute format(
      'create policy "editors read all" on public.%I
       for select to authenticated using (true)', t);

    execute format('drop policy if exists "editors insert" on public.%I', t);
    execute format(
      'create policy "editors insert" on public.%I
       for insert to authenticated with check (true)', t);

    execute format('drop policy if exists "editors update" on public.%I', t);
    execute format(
      'create policy "editors update" on public.%I
       for update to authenticated using (true) with check (true)', t);

    execute format('drop policy if exists "editors delete" on public.%I', t);
    execute format(
      'create policy "editors delete" on public.%I
       for delete to authenticated using (true)', t);
  end loop;
end $$;

-- ---------------------------------------------------------------- storage
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media public read"    on storage.objects;
drop policy if exists "media editors write"  on storage.objects;
drop policy if exists "media editors update" on storage.objects;
drop policy if exists "media editors delete" on storage.objects;

create policy "media public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');
create policy "media editors write" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');
create policy "media editors update" on storage.objects
  for update to authenticated using (bucket_id = 'media');
create policy "media editors delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media');
