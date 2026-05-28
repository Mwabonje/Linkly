-- Supabase Schema for Linkly

-- 1. Create the `profiles` table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique not null,
  full_name text,
  role text,
  avatar_url text,
  theme text default 'dark-minimal',
  views integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add views column if the table already existed before the above was added
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='views') then
    alter table public.profiles add column views integer default 0;
  end if;
end $$;

-- Turn on Row Level Security (RLS) for profiles
alter table public.profiles enable row level security;

-- Create policies for profiles
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 2. Create the `links` table
create table if not exists public.links (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  url text not null,
  clicks integer default 0,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security (RLS) for links
alter table public.links enable row level security;

-- Create policies for links
create policy "Links are viewable by everyone."
  on links for select
  using ( true );

create policy "Users can insert their own links."
  on links for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own links."
  on links for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own links."
  on links for delete
  using ( auth.uid() = user_id );

-- 3. Click Tracking Function (RPC)
create or replace function increment_click(link_id uuid)
returns void as $$
begin
  update public.links
  set clicks = clicks + 1
  where id = link_id;
end;
$$ language plpgsql security definer;

-- 4. Profile View Tracking Function (RPC)
create or replace function increment_profile_view(profile_id uuid)
returns void as $$
begin
  update public.profiles
  set views = views + 1
  where id = profile_id;
end;
$$ language plpgsql security definer;

