/**
 * One-time seed: copies bundled portfolio JSON into Supabase.
 *
 * Usage (from repo root):
 *   SUPABASE_URL="https://xxx.supabase.co" \
 *   SUPABASE_SERVICE_ROLE_KEY="eyJ..." \
 *   npm run seed:supabase
 *
 * Use the service role key only locally / in CI — never in the browser.
 */
import { createClient } from '@supabase/supabase-js';
import { PROJECT_TEXTS } from '../src/config/projectTexts';
import { DEFAULT_SITE_SETTINGS } from '../src/config/portfolioDefaults';
import {
  DEFAULT_ABOUT_DATA,
  DEFAULT_CONTACT_DATA,
  DEFAULT_CV_FILE_NAME,
  DEFAULT_CV_PUBLIC_URL,
} from '../src/config/siteContentDefaults';

const url = process.env.SUPABASE_URL ?? process.env.REACT_APP_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function main() {
  if (!url || !serviceKey) {
    console.error('Missing SUPABASE_URL (or REACT_APP_SUPABASE_URL) or SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
  }

  const sb = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

  for (const p of PROJECT_TEXTS) {
    const { error } = await sb.from('projects').upsert(
      {
        id: p.id,
        data: p,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    );
    if (error) {
      console.error('Project upsert failed', p.id, error.message);
      process.exit(1);
    }
  }

  const { error: sErr } = await sb.from('site_settings').upsert(
    {
      id: 1,
      carousel_order: DEFAULT_SITE_SETTINGS.carouselOrder,
      featured_ids: DEFAULT_SITE_SETTINGS.featuredIds,
      hidden_project_ids: DEFAULT_SITE_SETTINGS.hiddenProjectIds,
      default_hero_project_id: DEFAULT_SITE_SETTINGS.defaultHeroProjectId,
      about_data: DEFAULT_ABOUT_DATA,
      contact_data: DEFAULT_CONTACT_DATA,
      cv_public_url: DEFAULT_CV_PUBLIC_URL,
      cv_file_name: DEFAULT_CV_FILE_NAME,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );

  if (sErr) {
    console.error('site_settings upsert failed', sErr.message);
    process.exit(1);
  }

  console.log(`Seeded ${PROJECT_TEXTS.length} projects and site_settings.`);
}

main();
