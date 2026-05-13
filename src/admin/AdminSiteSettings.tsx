import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DEFAULT_ABOUT_DATA,
  type AboutContent,
  type AboutExpertiseItem,
  type AboutHighlight,
  type AboutSection,
  type AboutSectionVariant,
} from '../config/siteContentDefaults';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { supabase } from '../lib/supabaseClient';
import './admin.css';

function cloneAbout(a: AboutContent): AboutContent {
  return JSON.parse(JSON.stringify(a)) as AboutContent;
}

export default function AdminSiteSettings() {
  const {
    aboutData,
    contactData,
    cvPublicUrl,
    cvFileName,
    siteSettings,
    loading,
    reload,
    source,
  } = usePortfolioData();

  const [about, setAbout] = useState<AboutContent>(() => cloneAbout(DEFAULT_ABOUT_DATA));
  const [contact, setContact] = useState({ email: '', linkedin: '' });
  const [cvUrl, setCvUrl] = useState('');
  const [cvName, setCvName] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    setAbout(cloneAbout(aboutData));
    setContact({ ...contactData });
    setCvUrl(cvPublicUrl);
    setCvName(cvFileName);
  }, [loading, aboutData, contactData, cvPublicUrl, cvFileName]);

  const saveAll = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    setErr(null);
    setMsg(null);
    const { error } = await supabase.from('site_settings').upsert(
      {
        id: 1,
        carousel_order: siteSettings.carouselOrder,
        featured_ids: siteSettings.featuredIds,
        hidden_project_ids: siteSettings.hiddenProjectIds,
        default_hero_project_id: siteSettings.defaultHeroProjectId,
        about_data: about,
        contact_data: contact,
        cv_public_url: cvUrl.trim() || null,
        cv_file_name: cvName.trim() || null,
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

  const uploadCv = async (file: File) => {
    if (!supabase) return;
    setUploading(true);
    setErr(null);
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `cv/${Date.now()}-${safe}`;
    const { error: upErr } = await supabase.storage.from('portfolio-media').upload(path, file, {
      upsert: false,
      contentType: file.type || 'application/pdf',
    });
    setUploading(false);
    if (upErr) {
      setErr(upErr.message);
      return;
    }
    const { data } = supabase.storage.from('portfolio-media').getPublicUrl(path);
    setCvUrl(data.publicUrl);
    if (!cvName.trim()) {
      setCvName(file.name.toLowerCase().endsWith('.pdf') ? file.name : `${file.name}.pdf`);
    }
    setMsg('CV uploaded — click Save site settings to persist the URL in the database.');
  };

  const updateSection = (index: number, patch: Partial<AboutSection>) => {
    setAbout((prev) => {
      const sections = [...prev.sections];
      sections[index] = { ...sections[index], ...patch };
      return { ...prev, sections };
    });
  };

  const addSection = () => {
    setAbout((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: `section-${Date.now()}`,
          title: 'New section',
          variant: 'text' as AboutSectionVariant,
          body: '',
        },
      ],
    }));
  };

  const removeSection = (index: number) => {
    setAbout((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const setExpertiseItems = (sectionIndex: number, items: AboutExpertiseItem[]) => {
    updateSection(sectionIndex, { expertiseItems: items });
  };

  const setHighlights = (sectionIndex: number, highlights: AboutHighlight[]) => {
    updateSection(sectionIndex, { highlights });
  };

  return (
    <div>
      <p>
        <Link to="/admin/projects">← Projects</Link>
      </p>
      <form className="admin-panel" onSubmit={saveAll}>
        <h1 style={{ marginTop: 0 }}>Site: CV, contact, About</h1>
        {source !== 'supabase' && (
          <p className="admin-form-error" role="alert">
            Saving requires Supabase (live data source).
          </p>
        )}

        <h2>CV</h2>
        <label className="admin-label" htmlFor="cv-url">
          CV public URL
        </label>
        <input
          id="cv-url"
          className="admin-input"
          value={cvUrl}
          onChange={(e) => setCvUrl(e.target.value)}
        />
        <label className="admin-label" htmlFor="cv-name">
          Download file name
        </label>
        <input
          id="cv-name"
          className="admin-input"
          value={cvName}
          onChange={(e) => setCvName(e.target.value)}
        />
        <label className="admin-label" htmlFor="cv-file">
          Upload PDF (storage)
        </label>
        <input
          id="cv-file"
          type="file"
          accept="application/pdf"
          disabled={uploading || source !== 'supabase'}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void uploadCv(f);
            e.target.value = '';
          }}
        />

        <h2 className="admin-section">Contact</h2>
        <label className="admin-label" htmlFor="c-email">
          Email
        </label>
        <input
          id="c-email"
          className="admin-input"
          type="email"
          value={contact.email}
          onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
        />
        <label className="admin-label" htmlFor="c-li">
          LinkedIn URL
        </label>
        <input
          id="c-li"
          className="admin-input"
          value={contact.linkedin}
          onChange={(e) => setContact((c) => ({ ...c, linkedin: e.target.value }))}
        />

        <h2 className="admin-section">About — hero</h2>
        <div className="admin-grid-2">
          <div>
            <label className="admin-label" htmlFor="h-img">
              Hero image URL
            </label>
            <input
              id="h-img"
              className="admin-input"
              value={about.heroImage}
              onChange={(e) => setAbout((a) => ({ ...a, heroImage: e.target.value }))}
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="h-alt">
              Hero image alt
            </label>
            <input
              id="h-alt"
              className="admin-input"
              value={about.heroImageAlt}
              onChange={(e) => setAbout((a) => ({ ...a, heroImageAlt: e.target.value }))}
            />
          </div>
        </div>
        <label className="admin-label" htmlFor="h-title">
          Name / title (H1)
        </label>
        <input
          id="h-title"
          className="admin-input"
          value={about.heroTitle}
          onChange={(e) => setAbout((a) => ({ ...a, heroTitle: e.target.value }))}
        />
        <label className="admin-label" htmlFor="h-sub">
          Subtitle (H2)
        </label>
        <input
          id="h-sub"
          className="admin-input"
          value={about.heroSubtitle}
          onChange={(e) => setAbout((a) => ({ ...a, heroSubtitle: e.target.value }))}
        />
        <label className="admin-label" htmlFor="h-intro">
          Intro (use line presses for new lines)
        </label>
        <textarea
          id="h-intro"
          className="admin-textarea"
          value={about.intro}
          onChange={(e) => setAbout((a) => ({ ...a, intro: e.target.value }))}
        />

        <h2 className="admin-section">About — sections</h2>
        <button type="button" className="admin-btn admin-btn--secondary" onClick={addSection}>
          Add section
        </button>

        {about.sections.map((section, i) => (
          <div key={section.id} className="admin-panel admin-section" style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <strong>
                Section {i + 1}: {section.title}
              </strong>
              <button type="button" className="admin-btn admin-btn--danger" onClick={() => removeSection(i)}>
                Remove
              </button>
            </div>
            <label className="admin-label" htmlFor={`sid-${i}`}>
              Section id (stable key)
            </label>
            <input
              id={`sid-${i}`}
              className="admin-input"
              value={section.id}
              onChange={(e) => updateSection(i, { id: e.target.value })}
            />
            <label className="admin-label" htmlFor={`stitle-${i}`}>
              Heading
            </label>
            <input
              id={`stitle-${i}`}
              className="admin-input"
              value={section.title}
              onChange={(e) => updateSection(i, { title: e.target.value })}
            />
            <label className="admin-label" htmlFor={`svar-${i}`}>
              Layout
            </label>
            <select
              id={`svar-${i}`}
              className="admin-select"
              value={section.variant}
              onChange={(e) => {
                const v = e.target.value as AboutSectionVariant;
                const base: AboutSection = {
                  ...section,
                  variant: v,
                  body: v === 'text' ? section.body ?? '' : undefined,
                  expertiseItems: v === 'expertise' ? section.expertiseItems ?? [{ title: '', body: '' }] : undefined,
                  highlights: v === 'highlights' ? section.highlights ?? [] : undefined,
                  toolTags: v === 'tools' ? section.toolTags ?? [] : undefined,
                };
                updateSection(i, base);
              }}
            >
              <option value="text">Text paragraphs</option>
              <option value="expertise">Expertise grid</option>
              <option value="highlights">Project highlights</option>
              <option value="tools">Tool tags</option>
            </select>

            {section.variant === 'text' && (
              <>
                <label className="admin-label">Body (blank line = new paragraph)</label>
                <textarea
                  className="admin-textarea"
                  value={section.body ?? ''}
                  onChange={(e) => updateSection(i, { body: e.target.value })}
                />
              </>
            )}

            {section.variant === 'expertise' && (
              <div>
                {(section.expertiseItems ?? []).map((item, j) => (
                  <div key={j} className="admin-section" style={{ borderLeft: '3px solid #e4e4e7', paddingLeft: 12 }}>
                    <label className="admin-label">Item {j + 1} title</label>
                    <input
                      className="admin-input"
                      value={item.title}
                      onChange={(e) => {
                        const items = [...(section.expertiseItems ?? [])];
                        items[j] = { ...items[j], title: e.target.value };
                        setExpertiseItems(i, items);
                      }}
                    />
                    <label className="admin-label">Body</label>
                    <textarea
                      className="admin-textarea"
                      value={item.body}
                      onChange={(e) => {
                        const items = [...(section.expertiseItems ?? [])];
                        items[j] = { ...items[j], body: e.target.value };
                        setExpertiseItems(i, items);
                      }}
                    />
                    <button
                      type="button"
                      className="admin-btn admin-btn--secondary"
                      onClick={() => {
                        const items = (section.expertiseItems ?? []).filter((_, x) => x !== j);
                        setExpertiseItems(i, items);
                      }}
                    >
                      Remove item
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="admin-btn admin-btn--secondary"
                  onClick={() =>
                    setExpertiseItems(i, [...(section.expertiseItems ?? []), { title: '', body: '' }])
                  }
                >
                  Add expertise item
                </button>
              </div>
            )}

            {section.variant === 'highlights' && (
              <div>
                {(section.highlights ?? []).map((h, j) => (
                  <div key={j} className="admin-section" style={{ borderLeft: '3px solid #e4e4e7', paddingLeft: 12 }}>
                    <label className="admin-label">Project id (carousel)</label>
                    <input
                      className="admin-input"
                      type="number"
                      value={h.projectId}
                      onChange={(e) => {
                        const list = [...(section.highlights ?? [])];
                        list[j] = { ...list[j], projectId: Number(e.target.value) };
                        setHighlights(i, list);
                      }}
                    />
                    <label className="admin-label">Title</label>
                    <input
                      className="admin-input"
                      value={h.title}
                      onChange={(e) => {
                        const list = [...(section.highlights ?? [])];
                        list[j] = { ...list[j], title: e.target.value };
                        setHighlights(i, list);
                      }}
                    />
                    <label className="admin-label">Year</label>
                    <input
                      className="admin-input"
                      value={h.year}
                      onChange={(e) => {
                        const list = [...(section.highlights ?? [])];
                        list[j] = { ...list[j], year: e.target.value };
                        setHighlights(i, list);
                      }}
                    />
                    <label className="admin-label">Description</label>
                    <textarea
                      className="admin-textarea"
                      value={h.description}
                      onChange={(e) => {
                        const list = [...(section.highlights ?? [])];
                        list[j] = { ...list[j], description: e.target.value };
                        setHighlights(i, list);
                      }}
                    />
                    <label className="admin-label">Image URL</label>
                    <input
                      className="admin-input"
                      value={h.imageUrl}
                      onChange={(e) => {
                        const list = [...(section.highlights ?? [])];
                        list[j] = { ...list[j], imageUrl: e.target.value };
                        setHighlights(i, list);
                      }}
                    />
                    <label className="admin-label">Award (optional)</label>
                    <input
                      className="admin-input"
                      value={h.award ?? ''}
                      onChange={(e) => {
                        const list = [...(section.highlights ?? [])];
                        list[j] = { ...list[j], award: e.target.value || undefined };
                        setHighlights(i, list);
                      }}
                    />
                    <button
                      type="button"
                      className="admin-btn admin-btn--secondary"
                      onClick={() => setHighlights(i, (section.highlights ?? []).filter((_, x) => x !== j))}
                    >
                      Remove highlight
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="admin-btn admin-btn--secondary"
                  onClick={() =>
                    setHighlights(i, [
                      ...(section.highlights ?? []),
                      {
                        projectId: 1,
                        title: '',
                        year: '',
                        description: '',
                        imageUrl: '',
                      },
                    ])
                  }
                >
                  Add highlight
                </button>
              </div>
            )}

            {section.variant === 'tools' && (
              <>
                <label className="admin-label">Tags (comma-separated)</label>
                <textarea
                  className="admin-textarea"
                  value={(section.toolTags ?? []).join(', ')}
                  onChange={(e) =>
                    updateSection(i, {
                      toolTags: e.target.value
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </>
            )}
          </div>
        ))}

        <h2 className="admin-section">About — closing</h2>
        <label className="admin-label" htmlFor="cta-t">
          CTA title
        </label>
        <input
          id="cta-t"
          className="admin-input"
          value={about.ctaTitle}
          onChange={(e) => setAbout((a) => ({ ...a, ctaTitle: e.target.value }))}
        />
        <label className="admin-label" htmlFor="cta-b">
          CTA body
        </label>
        <textarea
          id="cta-b"
          className="admin-textarea"
          value={about.ctaBody}
          onChange={(e) => setAbout((a) => ({ ...a, ctaBody: e.target.value }))}
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
            {saving ? 'Saving…' : 'Save site settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
