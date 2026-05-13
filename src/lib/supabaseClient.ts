import { createClient, type SupabaseClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    /** Injected by scripts/ensure-react-app-supabase-env.cjs after production build */
    __SHIRI_SUPABASE__?: { url: string; publishableKey: string };
  }
}

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
 * Load public Supabase settings when REACT_APP_* were not in the webpack bundle:
 * 1) window.__SHIRI_SUPABASE__ (inlined in index.html at build time — most reliable on Vercel)
 * 2) /supabase-runtime.json
 * 3) /api/supabase-public-config
 */
export async function initSupabaseClient(): Promise<void> {
  if (supabase) return;

  const applyRemote = (data: { url?: string; publishableKey?: string }) => {
    if (!data?.url?.trim() || !data?.publishableKey?.trim()) return false;
    supabase = buildClient(data.url.trim(), data.publishableKey.trim());
    isSupabaseConfigured = true;
    return true;
  };

  if (typeof window !== 'undefined' && window.__SHIRI_SUPABASE__) {
    if (applyRemote(window.__SHIRI_SUPABASE__)) return;
  }

  try {
    const r = await fetch('/supabase-runtime.json', { cache: 'no-store' });
    if (r.ok) {
      const ct = r.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const data = (await r.json()) as { url?: string; publishableKey?: string };
        if (applyRemote(data)) return;
      }
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
