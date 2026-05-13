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

Never commit or expose the **service role** / **secret** key in the frontend.

### Vercel ↔ Supabase integration (marketplace / linked project)

If you connected Supabase in Vercel, these variables are usually synced automatically:

- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_SUPABASE_*`, and Postgres URLs.

**Create React App only bundles `REACT_APP_*` into the browser.** The repo runs
[`scripts/ensure-react-app-supabase-env.cjs`](../scripts/ensure-react-app-supabase-env.cjs) before `react-scripts build`. After build it **inlines** `window.__SHIRI_SUPABASE__` into `index.html` when env vars are present, and writes **`supabase-runtime.json`**. CRA also copies **[`public/supabase-runtime.json`](../public/supabase-runtime.json)** into `build/` so production can load **`/supabase-runtime.json`** even when Vercel build env is empty (same exposure as any public anon/publishable key).

- **Important:** In Vercel → **Settings → Environment Variables**, Supabase-linked variables must be available at **build** time (not only “runtime” / functions). If the integration only injects into serverless, either enable build-time exposure or **manually add** `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_PUBLISHABLE_KEY` with the same values as `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`.
- **Local `npm start`** still uses **`.env.local`** with `REACT_APP_*` (the wrapper is only used for `npm run build`).
- Serverless **[`api/commit-media.js`](../api/commit-media.js)** uses `SUPABASE_URL` and `SUPABASE_ANON_KEY` or **`SUPABASE_PUBLISHABLE_KEY`** — already provided by the integration.
- **`npm run seed:supabase`** can use **`SUPABASE_SECRET_KEY`** if your integration exposes it as the service role; otherwise set **`SUPABASE_SERVICE_ROLE_KEY`** from the Supabase dashboard (API → service_role) for local seeding.

Add your **Vercel production and preview URLs** under Supabase **Authentication → URL Configuration** so admin login and magic links work on every deployment host.

When you connect Supabase through Vercel, some variables exist only at **runtime** for serverless. The app reads **`window.__SHIRI_SUPABASE__`** (build-time inline), then **`/supabase-runtime.json`**, then **[`/api/supabase-public-config`](../api/supabase-public-config.js)**.

### Browser (optional explicit embed)

| Variable | Purpose |
|----------|---------|
| `REACT_APP_SUPABASE_URL` | Same as `SUPABASE_URL` — used if set at **build** time |
| `REACT_APP_SUPABASE_PUBLISHABLE_KEY` | Same as publishable/anon key — optional if API fallback works |

### Vercel serverless (from integration — no `REACT_APP_` prefix required)

These must be present for **`/api/supabase-public-config`** and **`/api/commit-media`**:

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Public key (or `SUPABASE_ANON_KEY`) |

You can still set **`REACT_APP_*`** duplicates in Vercel to skip the extra request.

## 3. Auth for the client

The admin UI **must** sign in through **Supabase Auth** (email + password or magic link). There is no separate “hardcoded” login in the app: project data, storage uploads, and Row Level Security all depend on a real Supabase session. You choose the email and password by **creating that user in Supabase** (not in this repo).

1. In Supabase: **Authentication → Providers → Email** — enable email (password and/or magic link).
2. **Authentication → Users → Add user** — e.g. email `shirilanger@gmail.com` and a password.  
   If Supabase rejects a short password, either use a longer one or relax **Authentication → Providers → Email → Password / minimum length** in the dashboard.
3. **Authentication → URL Configuration** — add your production URL, preview URLs, and local dev URLs (e.g. `http://localhost:3000`).

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

## 6. Git-backed JPEG / WebP uploads (optional)

When enabled, project uploads of **JPEG or WebP** (up to ~4 MiB) are committed to this repository under
`public/assets/images/<assets-folder>/` via the Vercel serverless route [`api/commit-media.js`](../api/commit-media.js).
**GIF, PNG, and video** still use **Supabase Storage** (same as before).

### Browser (Vercel / `.env.local`)

| Variable | Purpose |
|----------|---------|
| `REACT_APP_ENABLE_GIT_MEDIA_COMMIT` | Set to `true` to use Git commits for JPEG/WebP uploads |
| `REACT_APP_COMMIT_MEDIA_API_ORIGIN` | Leave empty on Vercel (same origin). For local CRA against a deployed API, set e.g. `https://your-site.vercel.app` |

Each project has an **Assets folder (Git uploads)** field in the editor (defaults from the title slug). Paths are sanitized server-side.

### Vercel (server only — do not expose in the CRA bundle)

| Variable | Purpose |
|----------|---------|
| `GITHUB_TOKEN` | Personal access token with **Contents: Read and write** on this repo |
| `GITHUB_REPO` | `owner/repo-name` (e.g. `acme/portfolio`) |
| `GITHUB_BRANCH` | Optional; default `main` |
| `SUPABASE_URL` | Same as project API URL |
| `SUPABASE_ANON_KEY` | Same anon / publishable key used by the app (validates the signed-in admin) |

The API checks the admin’s **Supabase access token**; anonymous callers cannot commit files.

After a successful upload, click **Save project** so the new `/assets/images/...` URL is stored in Supabase. **Production** picks up the binary on the **next Vercel deploy** triggered by the new commit. Locally, **git pull** to see the file.

## 7. Storage limits and uploads

- Media uploads go to the **`portfolio-media`** bucket (public read, authenticated write per migration policies).
- Free-tier storage and egress limits apply; large videos are better hosted externally (paste URL in gallery/hero fields).

## 8. Client handoff checklist

- Give her the **admin URL** and login method (password and/or magic link).
- Confirm she can use **Site / About / CV** for the résumé PDF, contact info, and About modal copy.
- Confirm she can edit projects (**Save project**), manage carousel (**Save carousel & visibility**), and add/remove projects as needed.
- Explain: text and carousel changes from Supabase appear after **refresh**. **Git-backed** JPEG/WebP files need a **new deployment** (or local `git pull`) before the new asset URL resolves.

## 9. Troubleshooting

- **Admin says “not configured”** — Open `https://yoursite.com/supabase-runtime.json` (should be JSON). If 404 or HTML, open `https://yoursite.com/api/supabase-public-config`. If both fail, set **`SUPABASE_URL`** + **`SUPABASE_PUBLISHABLE_KEY`** (or **`NEXT_PUBLIC_*`**) for **Build** on Vercel, or add **`REACT_APP_*`** duplicates, then redeploy.
- **Save fails with RLS** — user must be logged in; policies require `authenticated` role for writes.
- **Site still shows old text** — run seed; check Supabase **Table Editor** for rows in `projects`; hard-refresh the browser.
- **CORS / redirect issues on magic link** — add exact redirect URLs in Supabase Auth settings.
- **Git upload 401** — session expired; sign out and sign in again.
- **GET `/api/supabase-public-config` returns HTML or is empty** — the SPA rewrite was catching `/api/*`. The project uses an **API-first** rewrite in [`vercel.json`](../vercel.json); redeploy. You should see JSON: `{"url":"…","publishableKey":"…"}`.
- **Git upload 502 from GitHub** — check `GITHUB_TOKEN` scopes and that `GITHUB_REPO` matches this deployment repo.
- **`/admin` shows Vercel or host 404** — In Vercel → Project → Settings → General, set **Root Directory** to the folder that contains this repo’s **`vercel.json`** (usually the repository root, not a subfolder like `portfolio-react`). **Build Output** should be **`build`**. Redeploy after changing. The app uses SPA fallback: static files and `/api/*` resolve first, then everything else serves **`index.html`** so React Router can handle `/admin`.
