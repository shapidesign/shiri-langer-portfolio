import type { ProjectText } from '../config/projectTexts';
import type { PortfolioSiteSettings } from '../config/portfolioDefaults';
import { DEFAULT_SITE_SETTINGS } from '../config/portfolioDefaults';

/**
 * Build ordered carousel list: apply hidden filter, then explicit order, append leftovers.
 */
export function buildOrderedCarouselItems(
  source: ProjectText[],
  settings?: Partial<PortfolioSiteSettings>,
): ProjectText[] {
  const hidden = new Set(settings?.hiddenProjectIds ?? DEFAULT_SITE_SETTINGS.hiddenProjectIds);
  const order = settings?.carouselOrder?.length
    ? [...settings.carouselOrder]
    : [...DEFAULT_SITE_SETTINGS.carouselOrder];

  const items = source.filter((p) => !hidden.has(p.id));
  const byId = new Map<number, ProjectText>(items.map((p) => [p.id, p]));
  const ordered: ProjectText[] = [];

  for (const id of order) {
    const p = byId.get(id);
    if (p) {
      ordered.push(p);
      byId.delete(id);
    }
  }
  byId.forEach((leftover) => ordered.push(leftover));
  return ordered;
}

export function indexOfProjectId(items: ProjectText[], projectId: number): number {
  const i = items.findIndex((p) => p.id === projectId);
  return i < 0 ? 0 : i;
}
