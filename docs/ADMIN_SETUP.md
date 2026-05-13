# Portfolio CMS setup (Supabase + `/admin`)

This site can load portfolio projects from **Supabase** instead of the bundled [`src/config/projectTexts.ts`](src/config/projectTexts.ts). Until the database is seeded, the public site keeps using that bundled file (safe fallback).

## 1. Create a Supabase project

1. In [Supabase](https://supabase.com), create a project.
2. Open **SQL Editor** and run migrations in order:
   - [`supabase/migrations/001_initial.sql`](../supabase/migrations/001_initial.sql) (tables, RLS, storage bucket).
   - [`supabase/migrations/002_site_content.sql`](../supabase/migrations/002_site_content.sql) (About, contact, CV columns on `site_settings`).

## 2. Environment variables (Vercel / local)

| Variable | Where to find it | Used by |
|----------|------------------|---------|
| `REACT_APP_SUPABASE_URL` | Project Settings → API → Project URL | Browser (public + admin) |
| `REACT_APP_SUPABASE_PUBLISHABLE_KEY` | Project Settings → API → publishable key | Browser |
| `REACT_APP_SUPABASE_ANON_KEY` | (Optional) legacy `anon` JWT if not using publishable | Browser |

Add the URL and at least one browser key (publishable **or** legacy `anon` JWT) in the Vercel project (**Settings → Environment Variables**) for Production and Preview, then redeploy.

Never commit or expose the **service role** key in the frontend.

## 3. Auth for the client

1. In Supabase: **Authentication → Providers → Email** — enable email (magic link and/or password).
2. **Authentication → Users** — invite or create a user for your client.
3. If using magic links, add your site URL under **Authentication → URL Configuration** (e.g. `https://shirilangerdesigns.com` and `http://localhost:3000` for local dev).

The admin UI lives at **`/admin`** (e.g. `https://shirilangerdesigns.com/admin`).

## 4. Seed the database (one-time)

From the repo root, with the **service role** key (Settings → API, **service_role** — local use only):

```bash
export SUPABASE_URL="https://<ref>.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="<service_role_jwt>"
npm run seed:supabase
```

This upserts all bundled projects, default carousel settings, **About modal JSON**, **contact email/LinkedIn**, and **CV path** into Postgres.

## 5. Admin areas

| Path | Purpose |
|------|---------|
| `/admin/projects` | List, **New project**, **Delete**, carousel order, featured/hidden |
| `/admin/projects/:id` | Edit project fields, gallery + challenge/solution/result images (reorder), uploads |
| `/admin/site` | CV PDF upload, contact fields, full About content (sections, highlights, tools) |

### Removing projects

Deleting a project removes it from the database and strips its id from carousel, featured, and hidden lists. **About “Notable Projects”** highlights that pointed at that id are removed automatically. If the deleted project was the default hero, the first id in the carousel order becomes the new default when possible.

## 6. Storage limits and uploads

- Media uploads go to the **`portfolio-media`** bucket (public read, authenticated write per migration policies).
- Free-tier storage and egress limits apply; large videos are better hosted externally (paste URL in gallery/hero fields).

## 7. Client handoff checklist

- Give her the **admin URL** and login method (password and/or magic link).
- Confirm she can use **Site / About / CV** for the résumé PDF, contact info, and About modal copy.
- Confirm she can edit projects (**Save project**), manage carousel (**Save carousel & visibility**), and add/remove projects as needed.
- Explain: changes appear on the live site **after a normal page refresh** (no redeploy).

## 8. Troubleshooting

- **Admin says “not configured”** — missing `REACT_APP_*` vars; redeploy after setting them.
- **Save fails with RLS** — user must be logged in; policies require `authenticated` role for writes.
- **Site still shows old text** — run seed; check Supabase **Table Editor** for rows in `projects`; hard-refresh the browser.
- **CORS / redirect issues on magic link** — add exact redirect URLs in Supabase Auth settings.
