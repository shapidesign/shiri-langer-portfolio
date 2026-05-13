import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { ProjectText } from '../config/projectTexts';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { supabase } from '../lib/supabaseClient';
import { createEmptyProject } from '../utils/newProjectTemplate';
import { slugifyMediaFolder, safeMediaFolderSlug } from '../utils/mediaSlug';
import './admin.css';

const GIT_IMAGE_TYPES = new Set(['image/jpeg', 'image/webp']);
const MAX_GIT_UPLOAD_BYTES = 4 * 1024 * 1024;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result;
      if (typeof r !== 'string') {
        reject(new Error('Could not read file'));
        return;
      }
      const comma = r.indexOf(',');
      resolve(comma >= 0 ? r.slice(comma + 1) : r);
    };
    reader.onerror = () => reject(reader.error ?? new Error('read failed'));
    reader.readAsDataURL(file);
  });
}

export default function AdminProjectEdit() {
  const { id: idParam } = useParams();
  const id = Number(idParam);
  const navigate = useNavigate();
  const { getProjectById, reload, source, loading, error: dataSourceError } = usePortfolioData();

  const [draft, setDraft] = useState<ProjectText | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!idParam || Number.isNaN(id)) {
      setDraft(null);
      return;
    }
    const base = getProjectById(id);
    setDraft(
      base
        ? {
            ...base,
            gallery: [...(base.gallery || [])],
            challengeImages: [...(base.challengeImages || [])],
            solutionImages: [...(base.solutionImages || [])],
            resultsImages: [...(base.resultsImages || [])],
            mediaFolder: base.mediaFolder ?? '',
          }
        : createEmptyProject(id),
    );
  }, [id, idParam, getProjectById]);

  if (!idParam || Number.isNaN(id) || !draft) {
    return (
      <div className="admin-panel">
        <p>Invalid project.</p>
        <Link to="/admin/projects">Back</Link>
      </div>
    );
  }

  const setField = <K extends keyof ProjectText>(key: K, value: ProjectText[K]) => {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  };

  const gitMediaEnabled = process.env.REACT_APP_ENABLE_GIT_MEDIA_COMMIT === 'true';
  const commitApiOrigin = (process.env.REACT_APP_COMMIT_MEDIA_API_ORIGIN || '').replace(/\/$/, '');

  const assetFolderSlug = safeMediaFolderSlug(draft.mediaFolder, draft.title);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase || !draft) return;
    setSaving(true);
    setErr(null);
    setMsg(null);
    const payload = { ...draft, id };
    const { error } = await supabase.from('projects').upsert(
      {
        id,
        data: payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    );
    setSaving(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setMsg('Saved.');
    await reload();
  };

  const appendMediaUrl = (
    bucketPath: 'gallery' | 'hero' | 'thumb' | 'challenge' | 'solution' | 'results',
    url: string,
  ) => {
    setDraft((d) => {
      if (!d) return d;
      if (bucketPath === 'hero') return { ...d, heroMedia: url };
      if (bucketPath === 'thumb') return { ...d, thumbMedia: url };
      if (bucketPath === 'challenge') return { ...d, challengeImages: [...(d.challengeImages || []), url] };
      if (bucketPath === 'solution') return { ...d, solutionImages: [...(d.solutionImages || []), url] };
      if (bucketPath === 'results') return { ...d, resultsImages: [...(d.resultsImages || []), url] };
      return { ...d, gallery: [...(d.gallery || []), url] };
    });
  };

  const uploadFile = async (
    file: File,
    bucketPath: 'gallery' | 'hero' | 'thumb' | 'challenge' | 'solution' | 'results',
  ) => {
    if (!draft) return;

    if (bucketPath === 'gallery') {
      const ok = file.type.startsWith('image/') || file.type.startsWith('video/');
      if (!ok) {
        setErr('Gallery supports images and videos only.');
        return;
      }
    }

    const useGit =
      gitMediaEnabled &&
      Boolean(supabase) &&
      GIT_IMAGE_TYPES.has(file.type) &&
      file.size <= MAX_GIT_UPLOAD_BYTES;

    if (useGit && supabase) {
      setUploading(true);
      setErr(null);
      try {
        const { data: sess } = await supabase.auth.getSession();
        const accessToken = sess.session?.access_token;
        if (!accessToken) {
          setErr('Sign in again to commit files to the repository.');
          setUploading(false);
          return;
        }
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const prefix =
          bucketPath === 'gallery'
            ? 'gal'
            : bucketPath === 'hero'
              ? 'hero'
              : bucketPath === 'thumb'
                ? 'thumb'
                : bucketPath === 'challenge'
                  ? 'challenge'
                  : bucketPath === 'solution'
                    ? 'solution'
                    : 'results';
        const rel = `public/assets/images/${assetFolderSlug}/${prefix}-${Date.now()}-${safeName}`;
        const b64 = await fileToBase64(file);
        const res = await fetch(`${commitApiOrigin}/api/commit-media`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ path: rel, contentBase64: b64, mime: file.type }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          setErr(typeof json.error === 'string' ? json.error : 'Git upload failed');
          setUploading(false);
          return;
        }
        const publicUrl = `/${rel.replace(/^public\//, '')}`;
        appendMediaUrl(bucketPath, publicUrl);
        setMsg(
          'File committed to Git. Save the project, then pull locally or wait for deployment to see it on the site.',
        );
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'Git upload failed');
      }
      setUploading(false);
      return;
    }

    if (!supabase) return;
    setUploading(true);
    setErr(null);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${id}/${bucketPath}/${Date.now()}-${safeName}`;
    const { error: upErr } = await supabase.storage.from('portfolio-media').upload(path, file, {
      upsert: false,
      contentType: file.type || undefined,
    });
    setUploading(false);
    if (upErr) {
      setErr(upErr.message);
      return;
    }
    const { data } = supabase.storage.from('portfolio-media').getPublicUrl(path);
    appendMediaUrl(bucketPath, data.publicUrl);
  };

  type ListKey = 'gallery' | 'challengeImages' | 'solutionImages' | 'resultsImages';

  const moveInList = (key: ListKey, index: number, dir: -1 | 1) => {
    setDraft((d) => {
      if (!d) return d;
      const list = [...((d[key] as string[]) || [])];
      const j = index + dir;
      if (j < 0 || j >= list.length) return d;
      const next = [...list];
      const t = next[index];
      next[index] = next[j];
      next[j] = t;
      return { ...d, [key]: next };
    });
  };

  const removeAt = (key: ListKey, index: number) => {
    setDraft((d) => {
      if (!d) return d;
      const list = ((d[key] as string[]) || []).filter((_, i) => i !== index);
      return { ...d, [key]: list };
    });
  };

  const setUrlAt = (key: ListKey, index: number, url: string) => {
    setDraft((d) => {
      if (!d) return d;
      const list = [...((d[key] as string[]) || [])];
      list[index] = url;
      return { ...d, [key]: list };
    });
  };

  const appendEmpty = (key: ListKey) => {
    setDraft((d) => {
      if (!d) return d;
      const list = [...((d[key] as string[]) || []), ''];
      return { ...d, [key]: list };
    });
  };

  const renderOrderedUrlList = (
    listKey: ListKey,
    heading: string,
    uploadKind: 'gallery' | 'challenge' | 'solution' | 'results',
    fileInputId: string,
  ) => {
    const urls = (draft[listKey] as string[]) || [];
    return (
      <div className="admin-section">
        <h3>{heading}</h3>
        <ol style={{ listStyle: 'decimal', paddingLeft: '1.25rem' }}>
          {urls.map((url, idx) => (
            <li key={`${listKey}-${idx}`} style={{ marginBottom: 12 }}>
              <input
                className="admin-input"
                value={url}
                onChange={(e) => setUrlAt(listKey, idx, e.target.value)}
                aria-label={`${heading} ${idx + 1}`}
              />
              <div className="admin-actions" style={{ marginTop: 6, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn--secondary"
                  disabled={idx === 0}
                  onClick={() => moveInList(listKey, idx, -1)}
                >
                  Up
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn--secondary"
                  disabled={idx >= urls.length - 1}
                  onClick={() => moveInList(listKey, idx, 1)}
                >
                  Down
                </button>
                <button type="button" className="admin-btn admin-btn--danger" onClick={() => removeAt(listKey, idx)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ol>
        <button type="button" className="admin-btn admin-btn--secondary" onClick={() => appendEmpty(listKey)}>
          Add URL row
        </button>
        <label className="admin-label" htmlFor={fileInputId}>
          Upload file
        </label>
        <input
          id={fileInputId}
          type="file"
          accept={uploadKind === 'gallery' ? 'image/*,video/mp4,video/webm' : 'image/*'}
          disabled={uploading || source !== 'supabase'}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void uploadFile(f, uploadKind);
            e.target.value = '';
          }}
        />
      </div>
    );
  };

  const tagsStr = (draft.tags || []).join(', ');
  const techStr = (draft.technologies || []).join('\n');
  const processStr = (draft.processImages || []).join('\n');

  return (
    <div>
      <p>
        <Link to="/admin/projects">← Projects</Link>
      </p>
      <form className="admin-panel" onSubmit={onSave}>
        <h1 style={{ marginTop: 0 }}>{draft.title || `Project #${id}`}</h1>
        <p className="admin-muted">Project id: {id}</p>

        {!loading && source !== 'supabase' && (
          <p className="admin-form-error" role="alert">
            {dataSourceError ? (
              <>
                Could not load live portfolio data: <strong>{dataSourceError}</strong>. Saving is disabled until the
                projects table loads. Check migrations and that this deployment’s Supabase URL/key match your project.
              </>
            ) : (
              <>Supabase is not the active data source. Check CMS configuration and reload.</>
            )}
          </p>
        )}

        <div className="admin-grid-2">
          <div>
            <label className="admin-label" htmlFor="f-title">
              Title
            </label>
            <input
              id="f-title"
              className="admin-input"
              value={draft.title}
              onChange={(e) => setField('title', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="f-year">
              Year
            </label>
            <input
              id="f-year"
              className="admin-input"
              type="number"
              value={draft.year}
              onChange={(e) => setField('year', Number(e.target.value))}
            />
          </div>
        </div>

        <label className="admin-label" htmlFor="f-subtitle">
          Subtitle
        </label>
        <input
          id="f-subtitle"
          className="admin-input"
          value={draft.subtitle}
          onChange={(e) => setField('subtitle', e.target.value)}
        />

        <label className="admin-label" htmlFor="f-media-folder">
          Assets folder (Git uploads)
        </label>
        <input
          id="f-media-folder"
          className="admin-input"
          value={draft.mediaFolder ?? ''}
          onChange={(e) => setField('mediaFolder', e.target.value)}
          placeholder={slugifyMediaFolder(draft.title)}
          autoComplete="off"
        />
        <p className="admin-muted">
          Files go to <code>public/assets/images/</code>
          <strong>{assetFolderSlug}</strong>
          {process.env.REACT_APP_ENABLE_GIT_MEDIA_COMMIT === 'true'
            ? ' when you upload JPEG or WebP (Git commit). Other types still use Supabase storage.'
            : ' only when Git uploads are enabled for this deployment. Otherwise uploads use Supabase storage.'}
        </p>

        <label className="admin-label" htmlFor="f-tags">
          Tags (comma-separated)
        </label>
        <input
          id="f-tags"
          className="admin-input"
          value={tagsStr}
          onChange={(e) =>
            setField(
              'tags',
              e.target.value
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean),
            )
          }
        />

        <label className="admin-label" htmlFor="f-description">
          Short description
        </label>
        <textarea
          id="f-description"
          className="admin-textarea"
          value={draft.description}
          onChange={(e) => setField('description', e.target.value)}
        />

        <label className="admin-label" htmlFor="f-client">
          Client / award line
        </label>
        <input
          id="f-client"
          className="admin-input"
          value={draft.client}
          onChange={(e) => setField('client', e.target.value)}
        />

        <label className="admin-label" htmlFor="f-full">
          Full description
        </label>
        <textarea
          id="f-full"
          className="admin-textarea"
          value={draft.fullDescription}
          onChange={(e) => setField('fullDescription', e.target.value)}
        />

        <label className="admin-label" htmlFor="f-challenges">
          Challenges
        </label>
        <textarea
          id="f-challenges"
          className="admin-textarea"
          value={draft.challenges}
          onChange={(e) => setField('challenges', e.target.value)}
        />
        <p className="admin-muted">Shown in the project modal when “Body text” is empty (structured layout).</p>
        {renderOrderedUrlList('challengeImages', 'Images under Challenges', 'challenge', 'up-challenge')}

        <label className="admin-label" htmlFor="f-solutions">
          Solutions
        </label>
        <textarea
          id="f-solutions"
          className="admin-textarea"
          value={draft.solutions}
          onChange={(e) => setField('solutions', e.target.value)}
        />
        {renderOrderedUrlList('solutionImages', 'Images under Solutions', 'solution', 'up-solution')}

        <label className="admin-label" htmlFor="f-tech">
          Technologies (one per line)
        </label>
        <textarea
          id="f-tech"
          className="admin-textarea"
          value={techStr}
          onChange={(e) =>
            setField(
              'technologies',
              e.target.value
                .split('\n')
                .map((t) => t.trim())
                .filter(Boolean),
            )
          }
        />

        <label className="admin-label" htmlFor="f-results">
          Results
        </label>
        <textarea
          id="f-results"
          className="admin-textarea"
          value={draft.results}
          onChange={(e) => setField('results', e.target.value)}
        />
        {renderOrderedUrlList('resultsImages', 'Images under Results', 'results', 'up-results')}

        <label className="admin-label" htmlFor="f-body">
          Body text (optional)
        </label>
        <textarea
          id="f-body"
          className="admin-textarea"
          value={draft.bodyText ?? ''}
          onChange={(e) => setField('bodyText', e.target.value)}
        />

        <h2 className="admin-section">Gallery (main modal strip)</h2>
        {renderOrderedUrlList('gallery', 'Ordered gallery media', 'gallery', 'up-gallery')}

        <div className="admin-grid-2">
          <div>
            <label className="admin-label" htmlFor="f-hero">
              Hero media URL
            </label>
            <input
              id="f-hero"
              className="admin-input"
              value={draft.heroMedia ?? ''}
              onChange={(e) => setField('heroMedia', e.target.value)}
            />
            <input
              aria-label="Upload hero media"
              type="file"
              accept="image/*,video/mp4,video/webm"
              disabled={uploading || source !== 'supabase'}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void uploadFile(f, 'hero');
                e.target.value = '';
              }}
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="f-thumb">
              Thumbnail URL
            </label>
            <input
              id="f-thumb"
              className="admin-input"
              value={draft.thumbMedia ?? ''}
              onChange={(e) => setField('thumbMedia', e.target.value)}
            />
            <input
              aria-label="Upload thumbnail"
              type="file"
              accept="image/*"
              disabled={uploading || source !== 'supabase'}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void uploadFile(f, 'thumb');
                e.target.value = '';
              }}
            />
          </div>
        </div>

        <div className="admin-grid-2">
          <div>
            <label className="admin-label" htmlFor="f-sticker-c">
              Sticker color
            </label>
            <input
              id="f-sticker-c"
              className="admin-input"
              value={draft.stickerColor}
              onChange={(e) => setField('stickerColor', e.target.value)}
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="f-sticker-i">
              Sticker image URL
            </label>
            <input
              id="f-sticker-i"
              className="admin-input"
              value={draft.stickerImage}
              onChange={(e) => setField('stickerImage', e.target.value)}
            />
          </div>
        </div>

        <label className="admin-label" htmlFor="f-badge">
          Badge image URL
        </label>
        <input
          id="f-badge"
          className="admin-input"
          value={draft.badge ?? ''}
          onChange={(e) => setField('badge', e.target.value)}
        />

        <h3>Links</h3>
        <div className="admin-grid-2">
          <div>
            <label className="admin-label" htmlFor="f-live">
              Live
            </label>
            <input
              id="f-live"
              className="admin-input"
              value={draft.links?.live ?? ''}
              onChange={(e) =>
                setField('links', { ...draft.links, live: e.target.value || undefined })
              }
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="f-gh">
              GitHub
            </label>
            <input
              id="f-gh"
              className="admin-input"
              value={draft.links?.github ?? ''}
              onChange={(e) =>
                setField('links', { ...draft.links, github: e.target.value || undefined })
              }
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="f-be">
              Behance
            </label>
            <input
              id="f-be"
              className="admin-input"
              value={draft.links?.behance ?? ''}
              onChange={(e) =>
                setField('links', { ...draft.links, behance: e.target.value || undefined })
              }
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="f-dr">
              Dribbble
            </label>
            <input
              id="f-dr"
              className="admin-input"
              value={draft.links?.dribbble ?? ''}
              onChange={(e) =>
                setField('links', { ...draft.links, dribbble: e.target.value || undefined })
              }
            />
          </div>
        </div>

        <h3>Testimonial (optional)</h3>
        <label className="admin-label" htmlFor="f-txt">
          Quote
        </label>
        <textarea
          id="f-txt"
          className="admin-textarea"
          value={draft.testimonial?.text ?? ''}
          onChange={(e) =>
            setField('testimonial', {
              ...draft.testimonial,
              text: e.target.value,
              author: draft.testimonial?.author ?? '',
              role: draft.testimonial?.role ?? '',
            })
          }
        />
        <div className="admin-grid-2">
          <div>
            <label className="admin-label" htmlFor="f-ta">
              Author
            </label>
            <input
              id="f-ta"
              className="admin-input"
              value={draft.testimonial?.author ?? ''}
              onChange={(e) =>
                setField('testimonial', {
                  ...draft.testimonial,
                  text: draft.testimonial?.text ?? '',
                  author: e.target.value,
                  role: draft.testimonial?.role ?? '',
                })
              }
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="f-tr">
              Role
            </label>
            <input
              id="f-tr"
              className="admin-input"
              value={draft.testimonial?.role ?? ''}
              onChange={(e) =>
                setField('testimonial', {
                  ...draft.testimonial,
                  text: draft.testimonial?.text ?? '',
                  author: draft.testimonial?.author ?? '',
                  role: e.target.value,
                })
              }
            />
          </div>
        </div>

        <h3>Process images (URLs, one per line)</h3>
        <textarea
          id="f-proc"
          className="admin-textarea"
          value={processStr}
          onChange={(e) =>
            setField(
              'processImages',
              e.target.value
                .split('\n')
                .map((t) => t.trim())
                .filter(Boolean),
            )
          }
        />

        {err && (
          <p className="admin-form-error" role="alert">
            {err}
          </p>
        )}
        {msg && (
          <p className="admin-status-ok" role="status">
            {msg}
          </p>
        )}

        <div className="admin-actions">
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving || source !== 'supabase'}>
            {saving ? 'Saving…' : 'Save project'}
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--secondary"
            onClick={() => navigate('/admin/projects')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

