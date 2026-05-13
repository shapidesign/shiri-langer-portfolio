import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function buildClient(url: string, key: string): SupabaseClient {
  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

const envUrl = process.env.REACT_APP_SUPABASE_URL;
const envKey =
  process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY ?? process.env.REACT_APP_SUPABASE_ANON_KEY;

export let supabase: SupabaseClient | null =
  envUrl && envKey ? buildClient(envUrl, envKey) : null;

export let isSupabaseConfigured = Boolean(supabase);

/**
 * When REACT_APP_* are empty in the static bundle (e.g. integration vars only exist
 * at runtime on Vercel), load URL + publishable key from /api/supabase-public-config.
 * Call once before rendering the app (see index.tsx).
 */
export async function initSupabaseClient(): Promise<void> {
  if (supabase) return;
  try {
    const r = await fetch('/api/supabase-public-config');
    if (!r.ok) return;
    const data = (await r.json()) as { url?: string; publishableKey?: string };
    if (!data?.url || !data?.publishableKey) return;
    supabase = buildClient(data.url, data.publishableKey);
    isSupabaseConfigured = true;
  } catch {
    /* offline or local dev without API route */
  }
}
