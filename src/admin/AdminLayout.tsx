import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import './admin.css';

export default function AdminLayout() {
  const navigate = useNavigate();

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <span className="admin-brand">Portfolio admin</span>
        <nav className="admin-nav" aria-label="Admin">
          <NavLink to="/admin/projects" className={({ isActive }) => (isActive ? 'is-active' : '')}>
            Projects & carousel
          </NavLink>
          <NavLink to="/admin/site" className={({ isActive }) => (isActive ? 'is-active' : '')}>
            Site / About / CV
          </NavLink>
          {isSupabaseConfigured && (
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => void signOut()}>
              Sign out
            </button>
          )}
        </nav>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
