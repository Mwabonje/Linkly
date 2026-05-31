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
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile."
  on public.profiles for update
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
drop policy if exists "Links are viewable by everyone." on public.links;
create policy "Links are viewable by everyone."
  on public.links for select
  using ( true );

drop policy if exists "Users can insert their own links." on public.links;
create policy "Users can insert their own links."
  on public.links for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Users can update their own links." on public.links;
create policy "Users can update their own links."
  on public.links for update
  using ( auth.uid() = user_id );

drop policy if exists "Users can delete their own links." on public.links;
create policy "Users can delete their own links."
  on public.links for delete
  using ( auth.uid() = user_id );

-- 3. Analytics Tracking Tables
create table if not exists public.link_clicks (
  id uuid default gen_random_uuid() primary key,
  link_id uuid references public.links(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create index if not exists link_clicks_link_id_idx on public.link_clicks(link_id);
create index if not exists link_clicks_created_at_idx on public.link_clicks(created_at);

create table if not exists public.profile_views (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create index if not exists profile_views_profile_id_idx on public.profile_views(profile_id);
create index if not exists profile_views_created_at_idx on public.profile_views(created_at);


-- 4. Click Tracking Function (RPC)
create or replace function increment_click(link_id uuid)
returns void as $$
begin
  update public.links
  set clicks = clicks + 1
  where id = link_id;
  
  insert into public.link_clicks (link_id) values (link_id);
end;
$$ language plpgsql security definer;

-- 5. Profile View Tracking Function (RPC)
create or replace function increment_profile_view(profile_id uuid)
returns void as $$
begin
  update public.profiles
  set views = views + 1
  where id = profile_id;

  insert into public.profile_views (profile_id) values (profile_id);
end;
$$ language plpgsql security definer;

-- 6. Get Analytics Data Function (RPC)
create or replace function get_analytics_data(p_profile_id uuid, p_start_date timestamp with time zone default null)
returns json as $$
declare
  v_total_views integer;
  v_total_clicks integer;
  v_link_clicks json;
  v_daily_data json;
  v_chart_start_date timestamp with time zone;
begin
  if p_start_date is null then
    -- all time stats for totals
    select views into v_total_views from public.profiles where id = p_profile_id;
    
    select coalesce(sum(clicks), 0) into v_total_clicks from public.links where user_id = p_profile_id;
    
    select coalesce(json_agg(json_build_object('link_id', id, 'clicks', coalesce(clicks, 0))), '[]'::json) into v_link_clicks
    from public.links
    where user_id = p_profile_id;

    v_chart_start_date := current_date - interval '30 days';
  else
    -- time filtered stats
    select count(*) into v_total_views
    from public.profile_views
    where profile_id = p_profile_id
    and created_at >= p_start_date;
    
    select count(*) into v_total_clicks
    from public.link_clicks lc
    join public.links l on l.id = lc.link_id
    where l.user_id = p_profile_id
    and lc.created_at >= p_start_date;
    
    select coalesce(json_agg(json_build_object('link_id', l.id, 'clicks', coalesce(lc_counts.clicks, 0))), '[]'::json) into v_link_clicks
    from public.links l
    left join (
      select link_id, count(*) as clicks
      from public.link_clicks
      where created_at >= p_start_date
      group by link_id
    ) lc_counts on lc_counts.link_id = l.id
    where l.user_id = p_profile_id;

    v_chart_start_date := date_trunc('day', p_start_date);
  end if;

  -- Generate daily data for charts
  select coalesce(json_agg(json_build_object('date', date_txt, 'views', views, 'clicks', clicks)), '[]'::json) into v_daily_data
  from (
      select to_char(d.date, 'Dy, Mon DD, YYYY') as date_txt, d.date, coalesce(v.views, 0) as views, coalesce(c.clicks, 0) as clicks
      from (
        select generate_series(v_chart_start_date, current_date + interval '1 day', '1 day'::interval)::date as date
      ) d
      left join (
        select date_trunc('day', created_at)::date as date, count(*) as views
        from public.profile_views
        where profile_id = p_profile_id and created_at >= v_chart_start_date
        group by 1
      ) v on v.date = d.date
      left join (
        select date_trunc('day', lc.created_at)::date as date, count(*) as clicks
        from public.link_clicks lc
        join public.links l on l.id = lc.link_id
        where l.user_id = p_profile_id and lc.created_at >= v_chart_start_date
        group by 1
      ) c on c.date = d.date
      where d.date <= current_date
      order by d.date
  ) aggregated;

  return json_build_object(
    'totalViews', coalesce(v_total_views, 0),
    'totalClicks', coalesce(v_total_clicks, 0),
    'linkClicks', coalesce(v_link_clicks, '[]'::json),
    'dailyData', v_daily_data
  );
end;
$$ language plpgsql security definer;


