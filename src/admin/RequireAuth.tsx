import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function RequireAuth() {
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured || !supabase) {
    return (
      <div className="admin-panel" role="alert">
        <h1>Admin unavailable</h1>
        <p>
          The CMS needs Supabase credentials. On Vercel, open{' '}
          <code>/supabase-runtime.json</code> and <code>/api/supabase-public-config</code> — one should
          return JSON with <code>url</code> and <code>publishableKey</code>. If both fail, add{' '}
          <code>SUPABASE_URL</code> and <code>SUPABASE_PUBLISHABLE_KEY</code> (or{' '}
          <code>REACT_APP_SUPABASE_URL</code> + <code>REACT_APP_SUPABASE_PUBLISHABLE_KEY</code>) and
          ensure they are enabled for <strong>Build</strong> as well as Runtime, then redeploy.
        </p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="admin-panel admin-panel--muted" aria-busy="true">
        <p>Checking session…</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
