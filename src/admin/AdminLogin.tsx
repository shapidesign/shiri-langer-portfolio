import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/admin/projects';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isSupabaseConfigured || !supabase) {
    return (
      <div className="admin-panel" role="alert">
        <h1>Admin unavailable</h1>
        <p>Supabase environment variables are not set.</p>
        <Link to="/">Back to site</Link>
      </div>
    );
  }

  const sb = supabase;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setBusy(true);
    const { error } = await sb.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    navigate(from, { replace: true });
  };

  const sendMagicLink = async () => {
    if (!email.trim()) {
      setMessage('Enter your email first.');
      return;
    }
    setBusy(true);
    setMessage(null);
    const redirectTo = `${window.location.origin}/admin`;
    const { error } = await sb.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    });
    setBusy(false);
    if (error) setMessage(error.message);
    else setMessage('Check your email for the sign-in link.');
  };

  return (
    <div className="admin-login">
      <div className="admin-panel admin-panel--card">
        <h1>Sign in</h1>
        <p className="admin-muted">Manage portfolio projects and carousel order.</p>
        <form className="admin-form" onSubmit={onSubmit}>
          <label className="admin-label" htmlFor="admin-email">
            Email
          </label>
          <input
            id="admin-email"
            className="admin-input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="admin-label" htmlFor="admin-password">
            Password
          </label>
          <input
            id="admin-password"
            className="admin-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {message && (
            <p className="admin-form-error" role="status">
              {message}
            </p>
          )}

          <div className="admin-actions">
            <button type="submit" className="admin-btn admin-btn--primary" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in with password'}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--secondary"
              disabled={busy}
              onClick={() => void sendMagicLink()}
            >
              Email magic link
            </button>
          </div>
        </form>
        <p className="admin-muted admin-login-foot">
          <Link to="/">← Back to site</Link>
        </p>
      </div>
    </div>
  );
}

// If already signed in, redirect away from login (handled by parent — optional improvement)
