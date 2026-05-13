import { DragEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mergeAboutData } from '../config/siteContentDefaults';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { createEmptyProject } from '../utils/newProjectTemplate';
import { buildOrderedCarouselItems } from '../utils/portfolioOrdering';
import { supabase } from '../lib/supabaseClient';
import './admin.css';

function toggleInSet<T>(set: Set<T>, value: T, on: boolean): Set<T> {
  const next = new Set(set);
  if (on) next.add(value);
  else next.delete(value);
  return next;
}

export default function AdminProjectList() {
  const navigate = useNavigate();
  const { projects, siteSettings, reload, source, loading, error } = usePortfolioData();

  const [carouselOrder, setCarouselOrder] = useState<number[]>([]);
  const [hiddenIds, setHiddenIds] = useState<Set<number>>(new Set());
  const [featuredIds, setFeaturedIds] = useState<Set<number>>(new Set());
  const [heroId, setHeroId] = useState<number>(1);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    if (loading) return;
    const ordered = buildOrderedCarouselItems(projects, siteSettings).map((p) => p.id);
    setCarouselOrder(ordered);
    setHiddenIds(new Set(siteSettings.hiddenProjectIds));
    setFeaturedIds(new Set(siteSettings.featuredIds));
    setHeroId(siteSettings.defaultHeroProjectId);
  }, [loading, projects, siteSettings]);

  const byId = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects]);

  const stripProjects = useMemo(
    () => carouselOrder.map((id) => byId.get(id)).filter(Boolean) as typeof projects,
    [carouselOrder, byId],
  );

  const resetForm = () => {
    const ordered = buildOrderedCarouselItems(projects, siteSettings).map((p) => p.id);
    setCarouselOrder(ordered);
    setHiddenIds(new Set(siteSettings.hiddenProjectIds));
    setFeaturedIds(new Set(siteSettings.featuredIds));
    setHeroId(siteSettings.defaultHeroProjectId);
    setSaveMsg(null);
    setSaveErr(null);
  };

  const onToggleHidden = (id: number, hidden: boolean) => {
    setHiddenIds((prev) => toggleInSet(prev, id, hidden));
    if (hidden) {
      setCarouselOrder((o) => o.filter((x) => x !== id));
    } else {
      setCarouselOrder((o) => (o.includes(id) ? o : [...o, id]));
    }
  };

  const onToggleFeatured = (id: number, on: boolean) => {
    setFeaturedIds((prev) => toggleInSet(prev, id, on));
  };

  const onDragStart = (e: DragEvent, id: number) => {
    e.dataTransfer.setData('text/plain', String(id));
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDropRow = (e: DragEvent, targetId: number) => {
    e.preventDefault();
    const draggedId = Number(e.dataTransfer.getData('text/plain'));
    if (!draggedId || draggedId === targetId) return;
    setCarouselOrder((order) => {
      const next = order.filter((x) => x !== draggedId);
      const idx = next.indexOf(targetId);
      if (idx < 0) return [...next, draggedId];
      next.splice(idx, 0, draggedId);
      return next;
    });
  };

  const saveSettings = async () => {
    if (!supabase) return;
    setSaving(true);
    setSaveMsg(null);
    setSaveErr(null);
    const visibleOrder = carouselOrder.filter((pid) => !hiddenIds.has(pid));
    const { data: row } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
    const { error: err } = await supabase.from('site_settings').upsert(
      {
        id: 1,
        carousel_order: visibleOrder,
        featured_ids: Array.from(featuredIds),
        hidden_project_ids: Array.from(hiddenIds),
        default_hero_project_id: heroId,
        about_data: row?.about_data ?? undefined,
        contact_data: row?.contact_data ?? undefined,
        cv_public_url: row?.cv_public_url ?? undefined,
        cv_file_name: row?.cv_file_name ?? undefined,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    );
    setSaving(false);
    if (err) {
      setSaveErr(err.message);
      return;
    }
    setSaveMsg('Saved. Reload the public site to see changes.');
    await reload();
  };

  const addProject = async () => {
    if (!supabase) {
      setSaveErr('Supabase is not configured.');
      return;
    }
    if (source !== 'supabase') {
      setSaveErr('Cannot add projects while data is in fallback mode (check Supabase connection and errors above).');
      return;
    }
    setSaveErr(null);
    const nextId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1;
    const template = createEmptyProject(nextId);
    const { error: insErr } = await supabase.from('projects').insert({
      id: nextId,
      data: template,
      updated_at: new Date().toISOString(),
    });
    if (insErr) {
      setSaveErr(insErr.message);
      return;
    }
    const { data: row } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
    const prevOrder = (row?.carousel_order || []).map(Number);
    const order = prevOrder.includes(nextId) ? prevOrder : [...prevOrder, nextId];
    const { error: setErr } = await supabase.from('site_settings').upsert(
      {
        id: 1,
        carousel_order: order,
        featured_ids: row?.featured_ids ?? [],
        hidden_project_ids: row?.hidden_project_ids ?? [],
        default_hero_project_id: row?.default_hero_project_id ?? nextId,
        about_data: row?.about_data ?? undefined,
        contact_data: row?.contact_data ?? undefined,
        cv_public_url: row?.cv_public_url ?? undefined,
        cv_file_name: row?.cv_file_name ?? undefined,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    );
    if (setErr) {
      setSaveErr(setErr.message);
      return;
    }
    await reload();
    navigate(`/admin/projects/${nextId}`);
  };

  const deleteProject = async (projectId: number) => {
    if (!supabase || source !== 'supabase') return;
    if (!window.confirm(`Delete project #${projectId} permanently? This cannot be undone.`)) return;
    setBusyId(projectId);
    setSaveErr(null);
    const { data: row } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
    let aboutPayload = row?.about_data;
    if (row?.about_data) {
      const cleaned = mergeAboutData(row.about_data);
      cleaned.sections = cleaned.sections.map((s) => {
        if (s.variant === 'highlights' && s.highlights) {
          return { ...s, highlights: s.highlights.filter((h) => h.projectId !== projectId) };
        }
        return s;
      });
      aboutPayload = cleaned;
    }
    const { error: delErr } = await supabase.from('projects').delete().eq('id', projectId);
    if (delErr) {
      setSaveErr(delErr.message);
      setBusyId(null);
      return;
    }
    const co = (row?.carousel_order || []).map(Number).filter((x: number) => x !== projectId);
    const fi = (row?.featured_ids || []).map(Number).filter((x: number) => x !== projectId);
    const hi = (row?.hidden_project_ids || []).map(Number).filter((x: number) => x !== projectId);
    let hero = row?.default_hero_project_id != null ? Number(row.default_hero_project_id) : siteSettings.defaultHeroProjectId;
    if (hero === projectId) hero = co[0] ?? siteSettings.defaultHeroProjectId;

    const { error: upErr } = await supabase.from('site_settings').upsert(
      {
        id: 1,
        carousel_order: co,
        featured_ids: fi,
        hidden_project_ids: hi,
        default_hero_project_id: hero,
        about_data: aboutPayload ?? undefined,
        contact_data: row?.contact_data ?? undefined,
        cv_public_url: row?.cv_public_url ?? undefined,
        cv_file_name: row?.cv_file_name ?? undefined,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    );
    setBusyId(null);
    if (upErr) setSaveErr(upErr.message);
    await reload();
  };

  return (
    <div>
      <div className="admin-panel">
        <p className="admin-muted" style={{ marginTop: 0 }}>
          Data: <strong>{source === 'supabase' ? 'Live (Supabase)' : 'Built-in fallback'}</strong>
          {loading && ' — loading…'}
          {error && ` — ${error}`}
        </p>
        <button type="button" className="admin-btn admin-btn--secondary" onClick={resetForm}>
          Reset form to loaded settings
        </button>
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          disabled={source !== 'supabase' || saving}
          onClick={() => void addProject()}
        >
          New project
        </button>
      </div>

      <section className="admin-section admin-panel">
        <h2>Carousel strip</h2>
        <p className="admin-muted">
          Drag to reorder visible projects. Use the table below to hide projects from the strip or mark featured
          styling.
        </p>
        <ul className="admin-reorder" aria-label="Carousel order">
          {stripProjects.map((p) => (
            <li
              key={p.id}
              draggable
              onDragStart={(e) => onDragStart(e, p.id)}
              onDragOver={onDragOver}
              onDrop={(e) => onDropRow(e, p.id)}
            >
              <span className="drag-hint" aria-hidden="true">
                ⋮⋮
              </span>
              <span style={{ flex: 1 }}>
                <strong>{p.title}</strong> <span className="admin-muted">#{p.id}</span>
              </span>
              <Link to={`/admin/projects/${p.id}`}>Edit</Link>
            </li>
          ))}
        </ul>

        <div className="admin-grid-2 admin-section">
          <div>
            <label className="admin-label" htmlFor="hero-default">
              Default centered project
            </label>
            <select
              id="hero-default"
              className="admin-select"
              value={heroId}
              onChange={(e) => setHeroId(Number(e.target.value))}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} (#{p.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        <table className="admin-table admin-section">
          <thead>
            <tr>
              <th>Title</th>
              <th>Hidden from strip</th>
              <th>Featured badge</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.title} <span className="admin-muted">#{p.id}</span>
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="admin-check"
                    checked={hiddenIds.has(p.id)}
                    onChange={(e) => onToggleHidden(p.id, e.target.checked)}
                    aria-label={`Hide ${p.title} from carousel`}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    className="admin-check"
                    checked={featuredIds.has(p.id)}
                    onChange={(e) => onToggleFeatured(p.id, e.target.checked)}
                    aria-label={`Featured strip style for ${p.title}`}
                  />
                </td>
                <td>
                  <Link to={`/admin/projects/${p.id}`}>Edit</Link>
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger"
                    style={{ marginLeft: 8 }}
                    disabled={source !== 'supabase' || busyId === p.id}
                    onClick={() => void deleteProject(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {saveErr && (
          <p className="admin-form-error" role="alert">
            {saveErr}
          </p>
        )}
        {saveMsg && (
          <p className="admin-status-ok" role="status">
            {saveMsg}
          </p>
        )}
        <div className="admin-actions" style={{ marginTop: 16 }}>
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            disabled={saving || source !== 'supabase'}
            onClick={() => void saveSettings()}
          >
            {saving ? 'Saving…' : 'Save carousel & visibility'}
          </button>
          {!loading && source !== 'supabase' && (
            <p className={error ? 'admin-form-error' : 'admin-muted'} role={error ? 'alert' : undefined}>
              {error ? (
                <>
                  Loading projects from Supabase failed: <strong>{error}</strong>. Typical causes: migrations not applied
                  in this Supabase project (no <code>public.projects</code> table), project paused, or this site’s
                  Supabase URL/key pointing at a different project than where you created tables and users. Fix the error,
                  then hard-refresh.
                </>
              ) : (
                <>
                  The CMS is not connected to a database for reads (see <code>docs/ADMIN_SETUP.md</code> and{' '}
                  <code>public/supabase-runtime.json</code> / Vercel env), or data is still loading.
                </>
              )}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
