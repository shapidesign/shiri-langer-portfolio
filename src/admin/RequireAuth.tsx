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
          The CMS could not load Supabase settings. Keep <code>public/supabase-runtime.json</code> in the
          repo (or set Vercel <strong>Build</strong> env) so the key is in the deployment. If{' '}
          <code>/supabase-runtime.json</code> shows the portfolio instead of JSON, redeploy the latest
          commit.
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
