-- Portfolio CMS: projects + site_settings + storage
-- Run in Supabase SQL Editor or via supabase db push

-- Projects: one row per portfolio item; payload mirrors ProjectText (JSON).
create table if not exists public.projects (
  id bigint primary key,
  data jsonb not null,
  updated_at timestamptz default now() not null
);

create index if not exists projects_updated_at_idx on public.projects (updated_at desc);

-- Single-row site configuration (carousel order, featured flags, etc.)
create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  carousel_order bigint[] default '{}',
  featured_ids bigint[] default '{}',
  hidden_project_ids bigint[] default '{}',
  default_hero_project_id bigint,
  updated_at timestamptz default now() not null
);

-- RLS
alter table public.projects enable row level security;
alter table public.site_settings enable row level security;

create policy "Public read projects"
  on public.projects for select
  using (true);

create policy "Authenticated insert projects"
  on public.projects for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated update projects"
  on public.projects for update
  using (auth.role() = 'authenticated');

create policy "Authenticated delete projects"
  on public.projects for delete
  using (auth.role() = 'authenticated');

create policy "Public read site_settings"
  on public.site_settings for select
  using (true);

create policy "Authenticated insert site_settings"
  on public.site_settings for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated update site_settings"
  on public.site_settings for update
  using (auth.role() = 'authenticated');

-- Storage bucket (public read, auth write)
insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

create policy "Public read portfolio media"
  on storage.objects for select
  using (bucket_id = 'portfolio-media');

create policy "Authenticated upload portfolio media"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

create policy "Authenticated update portfolio media"
  on storage.objects for update
  using (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');

create policy "Authenticated delete portfolio media"
  on storage.objects for delete
  using (bucket_id = 'portfolio-media' and auth.role() = 'authenticated');
