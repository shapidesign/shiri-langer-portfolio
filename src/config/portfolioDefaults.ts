/** Default carousel strip order (project ids), before Supabase overrides. */
export const DEFAULT_CAROUSEL_ORDER = [
  16, 15, 12, 9, 2, 3, 7, 1, 8, 10, 4, 5, 11, 6, 13, 14,
] as const;

/** Featured “star” styling on strip thumbnails. */
export const DEFAULT_FEATURED_IDS = [1, 2, 3, 4, 5] as const;

/** Excluded from carousel (e.g. legacy / unused project). */
export const DEFAULT_HIDDEN_PROJECT_IDS = [17] as const;

/** Which project is centered as the initial hero (Tomi = id 1). */
export const DEFAULT_HERO_PROJECT_ID = 1;

export interface PortfolioSiteSettings {
  carouselOrder: number[];
  featuredIds: number[];
  hiddenProjectIds: number[];
  defaultHeroProjectId: number;
}

export const DEFAULT_SITE_SETTINGS: PortfolioSiteSettings = {
  carouselOrder: [...DEFAULT_CAROUSEL_ORDER],
  featuredIds: [...DEFAULT_FEATURED_IDS],
  hiddenProjectIds: [...DEFAULT_HIDDEN_PROJECT_IDS],
  defaultHeroProjectId: DEFAULT_HERO_PROJECT_ID,
};
