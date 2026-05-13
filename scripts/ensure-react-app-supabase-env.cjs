/**
 * Create React App only embeds env vars prefixed with REACT_APP_ in the client bundle.
 * The Vercel ↔ Supabase integration exposes SUPABASE_* and NEXT_PUBLIC_* but not REACT_APP_*.
 * This script maps those into REACT_APP_* before react-scripts runs (Vercel build and local npm run build).
 *
 * After build, writes build/supabase-runtime.json when URL + key are known so the browser can
 * bootstrap without relying on serverless (/api) if functions do not receive integration env vars.
 *
 * Explicit REACT_APP_* values always win when set.
 */
'use strict';

const fs = require('fs');
const path = require('path');

function apply() {
  if (!process.env.REACT_APP_SUPABASE_URL?.trim()) {
    process.env.REACT_APP_SUPABASE_URL =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  }

  const publishable =
    process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  if (publishable) {
    if (!process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY?.trim()) {
      process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY = publishable;
    }
    if (!process.env.REACT_APP_SUPABASE_ANON_KEY?.trim()) {
      process.env.REACT_APP_SUPABASE_ANON_KEY =
        process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || publishable;
    }
  }
}

function writeRuntimeConfig() {
  const url = (process.env.REACT_APP_SUPABASE_URL || '').trim();
  const key = (
    process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY ||
    process.env.REACT_APP_SUPABASE_ANON_KEY ||
    ''
  ).trim();
  const buildDir = path.join(__dirname, '..', 'build');
  const outFile = path.join(buildDir, 'supabase-runtime.json');
  if (!url || !key) {
    console.warn(
      '[build] Supabase public URL/key missing after env alias — check Vercel env is available at **build** time, or add REACT_APP_SUPABASE_URL + REACT_APP_SUPABASE_PUBLISHABLE_KEY.',
    );
    return;
  }
  if (!fs.existsSync(buildDir)) {
    console.warn('[build] No build/ directory; skip supabase-runtime.json');
    return;
  }
  fs.writeFileSync(outFile, JSON.stringify({ url, publishableKey: key }), 'utf8');
  console.log('[build] Wrote supabase-runtime.json');
}

apply();
require('react-scripts/scripts/build.js');
writeRuntimeConfig();
