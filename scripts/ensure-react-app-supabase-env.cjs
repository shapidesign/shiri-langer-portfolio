/**
 * Create React App only embeds env vars prefixed with REACT_APP_ in the client bundle.
 * The Vercel ↔ Supabase integration exposes SUPABASE_* and NEXT_PUBLIC_* but not REACT_APP_*.
 * This script maps those into REACT_APP_* before react-scripts runs (Vercel build and local npm run build).
 *
 * Explicit REACT_APP_* values always win when set.
 */
'use strict';

function apply() {
  if (!process.env.REACT_APP_SUPABASE_URL?.trim()) {
    process.env.REACT_APP_SUPABASE_URL =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  }

  const publishable =
    process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    '';

  if (publishable) {
    if (!process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY?.trim()) {
      process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY = publishable;
    }
    if (!process.env.REACT_APP_SUPABASE_ANON_KEY?.trim()) {
      process.env.REACT_APP_SUPABASE_ANON_KEY =
        process.env.SUPABASE_ANON_KEY || publishable;
    }
  }
}

apply();
require('react-scripts/scripts/build.js');
