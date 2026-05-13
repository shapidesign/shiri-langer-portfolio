-- Site-wide About, Contact, CV fields on existing site_settings row
alter table public.site_settings
  add column if not exists about_data jsonb,
  add column if not exists contact_data jsonb,
  add column if not exists cv_public_url text,
  add column if not exists cv_file_name text;

-- RLS unchanged (existing policies cover UPDATE/SELECT on site_settings)
