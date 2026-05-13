/**
 * Create React App only embeds env vars prefixed with REACT_APP_ in the client bundle.
 * The Vercel ↔ Supabase integration exposes SUPABASE_* and NEXT_PUBLIC_* but not REACT_APP_*.
 * This script maps those into REACT_APP_* before react-scripts runs (Vercel build and local npm run build).
 *
 * After build, inlines public Supabase settings into build/index.html (window.__SHIRI_SUPABASE__)
 * and writes build/supabase-runtime.json so the client can bootstrap even when serverless env is empty.
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

function publishSupabaseToBuildOutput() {
  const url = (process.env.REACT_APP_SUPABASE_URL || '').trim();
  const key = (
    process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY ||
    process.env.REACT_APP_SUPABASE_ANON_KEY ||
    ''
  ).trim();
  const buildDir = path.join(__dirname, '..', 'build');
  if (!url || !key) {
    console.warn(
      '[build] Supabase public URL/key missing after env alias — check Vercel env is available at **build** time, or add REACT_APP_SUPABASE_URL + REACT_APP_SUPABASE_PUBLISHABLE_KEY.',
    );
    return;
  }
  if (!fs.existsSync(buildDir)) {
    console.warn('[build] No build/ directory; skip Supabase publish step');
    return;
  }

  const payload = { url, publishableKey: key };
  const json = JSON.stringify(payload);
  const safeForScript = json.replace(/</g, '\\u003c');

  const indexPath = path.join(buildDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');
    if (!html.includes('__SHIRI_SUPABASE__')) {
      const tag = `<script>window.__SHIRI_SUPABASE__=${safeForScript}</script>`;
      html = html.replace('</head>', `${tag}</head>`);
      fs.writeFileSync(indexPath, html);
      console.log('[build] Inlined Supabase public config in index.html');
    }
  }

  fs.writeFileSync(path.join(buildDir, 'supabase-runtime.json'), json, 'utf8');
  console.log('[build] Wrote supabase-runtime.json');
}

apply();
require('react-scripts/scripts/build.js');
publishSupabaseToBuildOutput();
