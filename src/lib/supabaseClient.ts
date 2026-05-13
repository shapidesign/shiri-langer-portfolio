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
 * When REACT_APP_* are empty in the static bundle, load public settings from:
 * 1) /supabase-runtime.json (written at build time if env was present)
 * 2) /api/supabase-public-config (serverless; needs env on functions)
 */
export async function initSupabaseClient(): Promise<void> {
  if (supabase) return;

  const applyRemote = (data: { url?: string; publishableKey?: string }) => {
    if (!data?.url?.trim() || !data?.publishableKey?.trim()) return false;
    supabase = buildClient(data.url.trim(), data.publishableKey.trim());
    isSupabaseConfigured = true;
    return true;
  };

  try {
    const r = await fetch('/supabase-runtime.json', { cache: 'no-store' });
    if (r.ok) {
      const data = (await r.json()) as { url?: string; publishableKey?: string };
      if (applyRemote(data)) return;
    }
  } catch {
    /* missing file or network */
  }

  try {
    const r = await fetch('/api/supabase-public-config', { cache: 'no-store' });
    if (!r.ok) return;
    const data = (await r.json()) as { url?: string; publishableKey?: string };
    applyRemote(data);
  } catch {
    /* offline or local dev without API route */
  }
}
