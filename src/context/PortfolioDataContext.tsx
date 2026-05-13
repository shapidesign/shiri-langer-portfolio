import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { PROJECT_TEXTS, type ProjectText } from '../config/projectTexts';
import { DEFAULT_SITE_SETTINGS, type PortfolioSiteSettings } from '../config/portfolioDefaults';
import {
  DEFAULT_ABOUT_DATA,
  DEFAULT_CONTACT_DATA,
  DEFAULT_CV_FILE_NAME,
  DEFAULT_CV_PUBLIC_URL,
  mergeAboutData,
  mergeContactData,
  type AboutContent,
  type ContactSiteContent,
} from '../config/siteContentDefaults';
import { buildOrderedCarouselItems } from '../utils/portfolioOrdering';
import { supabase } from '../lib/supabaseClient';
import { LoadingManager } from '../managers/LoadingManager';
import { getDisplayImage } from '../utils/imagePathUtils';

export type PortfolioDataSource = 'supabase' | 'fallback';

interface SiteSettingsRow {
  id: number;
  carousel_order: number[] | null;
  featured_ids: number[] | null;
  hidden_project_ids: number[] | null;
  default_hero_project_id: number | null;
  about_data?: unknown;
  contact_data?: unknown;
  cv_public_url?: string | null;
  cv_file_name?: string | null;
}

function isVideoSrc(src: string): boolean {
  const s = src.toLowerCase();
  return s.endsWith('.mp4') || s.endsWith('.webm') || s.endsWith('.mov');
}

function heroPreloadUrl(project: ProjectText): string | null {
  const gallery = project.gallery || [];
  if (project.heroMedia && !isVideoSrc(project.heroMedia)) return project.heroMedia;
  const firstStill = gallery.find((g) => !isVideoSrc(g));
  if (firstStill) return firstStill;
  const fallback = getDisplayImage(gallery);
  return fallback && !isVideoSrc(fallback) ? fallback : null;
}

function mergeCarouselFromRow(row: SiteSettingsRow | null): PortfolioSiteSettings {
  if (!row) return { ...DEFAULT_SITE_SETTINGS };
  return {
    carouselOrder:
      row.carousel_order && row.carousel_order.length > 0
        ? row.carousel_order.map(Number)
        : [...DEFAULT_SITE_SETTINGS.carouselOrder],
    featuredIds:
      row.featured_ids && row.featured_ids.length > 0
        ? row.featured_ids.map(Number)
        : [...DEFAULT_SITE_SETTINGS.featuredIds],
    hiddenProjectIds:
      row.hidden_project_ids != null
        ? row.hidden_project_ids.map(Number)
        : [...DEFAULT_SITE_SETTINGS.hiddenProjectIds],
    defaultHeroProjectId:
      row.default_hero_project_id != null
        ? Number(row.default_hero_project_id)
        : DEFAULT_SITE_SETTINGS.defaultHeroProjectId,
  };
}

function siteContentFromRow(row: SiteSettingsRow | null): {
  aboutData: AboutContent;
  contactData: ContactSiteContent;
  cvPublicUrl: string;
  cvFileName: string;
} {
  if (!row) {
    return {
      aboutData: mergeAboutData(null),
      contactData: mergeContactData(null),
      cvPublicUrl: DEFAULT_CV_PUBLIC_URL,
      cvFileName: DEFAULT_CV_FILE_NAME,
    };
  }
  return {
    aboutData: mergeAboutData(row.about_data),
    contactData: mergeContactData(row.contact_data),
    cvPublicUrl: row.cv_public_url?.trim() || DEFAULT_CV_PUBLIC_URL,
    cvFileName: row.cv_file_name?.trim() || DEFAULT_CV_FILE_NAME,
  };
}

export interface PortfolioDataContextValue {
  projects: ProjectText[];
  projectsById: Map<number, ProjectText>;
  orderedCarouselItems: ProjectText[];
  siteSettings: PortfolioSiteSettings;
  aboutData: AboutContent;
  contactData: ContactSiteContent;
  cvPublicUrl: string;
  cvFileName: string;
  featuredIds: Set<number>;
  loading: boolean;
  error: string | null;
  source: PortfolioDataSource;
  reload: () => Promise<void>;
  getProjectById: (id: number) => ProjectText | undefined;
}

const PortfolioDataContext = createContext<PortfolioDataContextValue | null>(null);

async function fetchFromSupabase(): Promise<{
  projects: ProjectText[];
  siteSettings: PortfolioSiteSettings;
  aboutData: AboutContent;
  contactData: ContactSiteContent;
  cvPublicUrl: string;
  cvFileName: string;
  source: PortfolioDataSource;
  error: string | null;
}> {
  if (!supabase) {
    return {
      projects: PROJECT_TEXTS,
      siteSettings: { ...DEFAULT_SITE_SETTINGS },
      aboutData: mergeAboutData(null),
      contactData: mergeContactData(null),
      cvPublicUrl: DEFAULT_CV_PUBLIC_URL,
      cvFileName: DEFAULT_CV_FILE_NAME,
      source: 'fallback',
      error: null,
    };
  }

  const [projRes, settingsRes] = await Promise.all([
    supabase.from('projects').select('id, data').order('id'),
    supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
  ]);

  const row = settingsRes.data as SiteSettingsRow | null;
  const content = siteContentFromRow(row);

  if (projRes.error) {
    return {
      projects: PROJECT_TEXTS,
      siteSettings: mergeCarouselFromRow(row),
      ...content,
      source: 'fallback',
      error: projRes.error.message,
    };
  }

  const rows = projRes.data;
  if (!rows || rows.length === 0) {
    // DB is reachable but empty: still "supabase" so admin can seed via UI (add/save).
    // Public site keeps showing built-in PROJECT_TEXTS until rows exist.
    return {
      projects: PROJECT_TEXTS,
      siteSettings: mergeCarouselFromRow(row),
      ...content,
      source: 'supabase',
      error: null,
    };
  }

  const projects: ProjectText[] = rows.map((r) => {
    const payload = r.data as ProjectText;
    return { ...payload, id: Number(r.id) };
  });

  return {
    projects,
    siteSettings: settingsRes.error ? { ...DEFAULT_SITE_SETTINGS } : mergeCarouselFromRow(row),
    ...content,
    source: 'supabase',
    error: settingsRes.error?.message ?? null,
  };
}

export const PortfolioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectText[]>(PROJECT_TEXTS);
  const [siteSettings, setSiteSettings] = useState<PortfolioSiteSettings>({
    ...DEFAULT_SITE_SETTINGS,
  });
  const [aboutData, setAboutData] = useState<AboutContent>(DEFAULT_ABOUT_DATA);
  const [contactData, setContactData] = useState<ContactSiteContent>(DEFAULT_CONTACT_DATA);
  const [cvPublicUrl, setCvPublicUrl] = useState(DEFAULT_CV_PUBLIC_URL);
  const [cvFileName, setCvFileName] = useState(DEFAULT_CV_FILE_NAME);
  const [loading, setLoading] = useState(() => Boolean(supabase));
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<PortfolioDataSource>('fallback');

  const load = useCallback(async () => {
    if (!supabase) {
      setProjects(PROJECT_TEXTS);
      setSiteSettings({ ...DEFAULT_SITE_SETTINGS });
      setAboutData(mergeAboutData(null));
      setContactData(mergeContactData(null));
      setCvPublicUrl(DEFAULT_CV_PUBLIC_URL);
      setCvFileName(DEFAULT_CV_FILE_NAME);
      setSource('fallback');
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    try {
      const result = await fetchFromSupabase();
      setProjects(result.projects);
      setSiteSettings(result.siteSettings);
      setAboutData(result.aboutData);
      setContactData(result.contactData);
      setCvPublicUrl(result.cvPublicUrl);
      setCvFileName(result.cvFileName);
      setSource(result.source);
      setError(result.error);
    } catch (e) {
      setProjects(PROJECT_TEXTS);
      setSiteSettings({ ...DEFAULT_SITE_SETTINGS });
      setAboutData(mergeAboutData(null));
      setContactData(mergeContactData(null));
      setCvPublicUrl(DEFAULT_CV_PUBLIC_URL);
      setCvFileName(DEFAULT_CV_FILE_NAME);
      setSource('fallback');
      setError(e instanceof Error ? e.message : 'Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const projectsById = useMemo(() => {
    const m = new Map<number, ProjectText>();
    projects.forEach((p) => m.set(p.id, p));
    return m;
  }, [projects]);

  const orderedCarouselItems = useMemo(
    () => buildOrderedCarouselItems(projects, siteSettings),
    [projects, siteSettings],
  );

  const featuredIds = useMemo(
    () => new Set(siteSettings.featuredIds),
    [siteSettings.featuredIds],
  );

  const getProjectById = useCallback(
    (id: number) => projectsById.get(id),
    [projectsById],
  );

  useEffect(() => {
    if (loading || typeof window === 'undefined') return;
    const preloadCount = 6;
    const urls: string[] = [];
    for (let i = 0; i < Math.min(preloadCount, orderedCarouselItems.length); i++) {
      const u = heroPreloadUrl(orderedCarouselItems[i]);
      if (u && !urls.includes(u)) urls.push(u);
    }
    if (urls.length > 0) {
      LoadingManager.getInstance().preloadProjectHeroUrls(urls);
    }
  }, [loading, orderedCarouselItems]);

  const value = useMemo<PortfolioDataContextValue>(
    () => ({
      projects,
      projectsById,
      orderedCarouselItems,
      siteSettings,
      aboutData,
      contactData,
      cvPublicUrl,
      cvFileName,
      featuredIds,
      loading,
      error,
      source,
      reload: load,
      getProjectById,
    }),
    [
      projects,
      projectsById,
      orderedCarouselItems,
      siteSettings,
      aboutData,
      contactData,
      cvPublicUrl,
      cvFileName,
      featuredIds,
      loading,
      error,
      source,
      load,
      getProjectById,
    ],
  );

  return (
    <PortfolioDataContext.Provider value={value}>{children}</PortfolioDataContext.Provider>
  );
};

export function usePortfolioData(): PortfolioDataContextValue {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) {
    throw new Error('usePortfolioData must be used within PortfolioDataProvider');
  }
  return ctx;
}
