import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PROJECT_TEXTS, ProjectText } from '../../config/projectTexts';
import { getDisplayImage } from '../../utils/imagePathUtils';
import './CircularGallery.css';

interface CircularGalleryProps {
  onOpen: (id: number) => void;
}

const FEATURED_IDS = new Set([1, 2, 3, 4, 5]);
const AUTO_ADVANCE_MS = 4500;

function isVideoSrc(src: string): boolean {
  const s = src.toLowerCase();
  return s.endsWith('.mp4') || s.endsWith('.webm') || s.endsWith('.mov');
}

// Reorder the project list so featured items (orange border) are never adjacent
// on the thumbnail strip. Interleaves featured + non-featured deterministically.
function buildOrderedItems(source: ProjectText[]): ProjectText[] {
  const items = source.filter((p) => p.id !== 17);
  const featured: ProjectText[] = [];
  const regular: ProjectText[] = [];
  for (const p of items) {
    if (FEATURED_IDS.has(p.id)) featured.push(p);
    else regular.push(p);
  }

  // Preferred target order per plan: Tomi, Bowl, Red Chair, Tambourine,
  // 3D Filters, Mico, PITA, Lamp, Itamar, Stool, Solidworks, EVE, K-SENSE,
  // Ember, Dancing Pot, Coffee.
  const targetOrder = [1, 10, 2, 15, 3, 9, 4, 6, 5, 7, 8, 11, 12, 13, 14, 16];
  const byId = new Map<number, ProjectText>(items.map((p) => [p.id, p]));
  const ordered: ProjectText[] = [];
  for (const id of targetOrder) {
    const p = byId.get(id);
    if (p) {
      ordered.push(p);
      byId.delete(id);
    }
  }
  // Append any remaining items (new projects added later) with featured spread
  const remaining = Array.from(byId.values());
  const remFeat = remaining.filter((p) => FEATURED_IDS.has(p.id));
  const remReg = remaining.filter((p) => !FEATURED_IDS.has(p.id));
  // simple interleave for any leftovers
  while (remFeat.length || remReg.length) {
    if (remReg.length) ordered.push(remReg.shift()!);
    if (remFeat.length) ordered.push(remFeat.shift()!);
  }
  // Silence unused var warnings in case featured/regular weren't needed
  void featured;
  void regular;
  return ordered;
}

const ITEMS: ProjectText[] = buildOrderedItems(PROJECT_TEXTS);

const CircularGallery: React.FC<CircularGalleryProps> = ({ onOpen }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0); // what hero is currently rendering
  const [isFading, setIsFading] = useState(false);
  const userInteractedRef = useRef(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const activeThumbRef = useRef<HTMLButtonElement | null>(null);
  const autoTimerRef = useRef<number | null>(null);
  // When true, the next activeIndex-driven auto-scroll is skipped (used for hover, which
  // shouldn't pull the strip out from under the cursor).
  const suppressAutoScrollRef = useRef(false);

  const activeItem = ITEMS[activeIndex] ?? ITEMS[0];
  const displayItem = ITEMS[displayIndex] ?? ITEMS[0];

  // Shared fallback: first non-video asset, else getDisplayImage
  const getFallbackMedia = useCallback((item: ProjectText): string => {
    const gallery = item.gallery || [];
    const firstImage = gallery.find((g) => !isVideoSrc(g));
    if (firstImage) return firstImage;
    return getDisplayImage(gallery);
  }, []);

  // Big hero preview (above the strip)
  const getHeroMedia = useCallback(
    (item: ProjectText): string => item.heroMedia ?? getFallbackMedia(item),
    [getFallbackMedia],
  );

  // Small strip thumbnail. Prefer an explicit thumbMedia; otherwise fall through to
  // heroMedia, then to the shared fallback.
  const getThumbMedia = useCallback(
    (item: ProjectText): string => item.thumbMedia ?? item.heroMedia ?? getFallbackMedia(item),
    [getFallbackMedia],
  );

  // Preload neighbor hero images for snappy swaps
  useEffect(() => {
    const preload = (i: number) => {
      const item = ITEMS[i];
      if (!item) return;
      const src = getHeroMedia(item);
      if (!src || isVideoSrc(src)) return;
      const img = new Image();
      img.src = src;
    };
    preload((activeIndex + 1) % ITEMS.length);
    preload((activeIndex - 1 + ITEMS.length) % ITEMS.length);
  }, [activeIndex, getHeroMedia]);

  // Crossfade hero when activeIndex changes
  useEffect(() => {
    if (activeIndex === displayIndex) return;
    setIsFading(true);
    const t = window.setTimeout(() => {
      setDisplayIndex(activeIndex);
      // Allow one frame for new src to mount, then fade back in
      requestAnimationFrame(() => setIsFading(false));
    }, 180);
    return () => window.clearTimeout(t);
  }, [activeIndex, displayIndex]);

  // Auto-scroll active thumbnail into view (skipped for hover-driven changes)
  useEffect(() => {
    if (suppressAutoScrollRef.current) {
      suppressAutoScrollRef.current = false;
      return;
    }
    const btn = activeThumbRef.current;
    const strip = stripRef.current;
    if (!btn || !strip) return;
    const btnRect = btn.getBoundingClientRect();
    const stripRect = strip.getBoundingClientRect();
    const targetScroll =
      strip.scrollLeft + (btnRect.left + btnRect.width / 2) - (stripRect.left + stripRect.width / 2);
    strip.scrollTo({ left: targetScroll, behavior: 'smooth' });
  }, [activeIndex]);

  // Auto-advance until first interaction
  useEffect(() => {
    const tick = () => {
      if (userInteractedRef.current) return;
      setActiveIndex((i) => (i + 1) % ITEMS.length);
      autoTimerRef.current = window.setTimeout(tick, AUTO_ADVANCE_MS);
    };
    autoTimerRef.current = window.setTimeout(tick, AUTO_ADVANCE_MS);
    return () => {
      if (autoTimerRef.current) window.clearTimeout(autoTimerRef.current);
    };
  }, []);

  const stopAuto = useCallback(() => {
    if (userInteractedRef.current) return;
    userInteractedRef.current = true;
    if (autoTimerRef.current) {
      window.clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, []);

  // Horizontal wheel translation on the strip
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      // If vertical wheel dominant, convert to horizontal scroll
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
      stopAuto();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [stopAuto]);

  const handleThumbEnter = useCallback(
    (index: number) => {
      stopAuto();
      suppressAutoScrollRef.current = true;
      setActiveIndex(index);
    },
    [stopAuto],
  );

  const handleThumbClick = useCallback(
    (index: number) => {
      stopAuto();
      if (index === activeIndex) {
        onOpen(activeItem.id);
      } else {
        setActiveIndex(index);
      }
    },
    [activeIndex, activeItem, onOpen, stopAuto],
  );

  const handleHeroClick = useCallback(() => {
    stopAuto();
    onOpen(activeItem.id);
  }, [activeItem, onOpen, stopAuto]);

  // Keyboard arrows navigate
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('.project-modal-container, .about-modal-content, .modal-container')) return;
      if (e.key === 'ArrowRight') {
        stopAuto();
        setActiveIndex((i) => (i + 1) % ITEMS.length);
      } else if (e.key === 'ArrowLeft') {
        stopAuto();
        setActiveIndex((i) => (i - 1 + ITEMS.length) % ITEMS.length);
      } else if (e.key === 'Enter' || e.key === ' ') {
        const active = document.activeElement as HTMLElement | null;
        if (active && active.classList.contains('hg-thumb')) {
          // handled by native button activation
          return;
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stopAuto]);

  const heroMedia = useMemo(() => getHeroMedia(displayItem), [displayItem, getHeroMedia]);
  const heroIsVideo = isVideoSrc(heroMedia);

  return (
    <div className="hg-root">
      {/* Stage holds the large preview */}
      <div className="hg-stage">
        <button
          type="button"
          className={`hg-hero${isFading ? ' is-fading' : ''}`}
          onClick={handleHeroClick}
          aria-label={`Open ${activeItem.title}`}
        >
          <div className="hg-hero-frame" data-id={displayItem.id}>
            {heroIsVideo ? (
              <video
                key={heroMedia}
                src={heroMedia}
                className="hg-hero-media"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                key={heroMedia}
                src={heroMedia}
                alt={displayItem.title}
                className="hg-hero-media"
                draggable={false}
              />
            )}
          </div>
          <div className="hg-hero-caption">
            <span className="hg-hero-title">{activeItem.title}</span>
            <span className="hg-hero-sep" aria-hidden="true">•</span>
            <span className="hg-hero-year">{activeItem.year}</span>
          </div>
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="hg-strip-wrap">
        <div ref={stripRef} className="hg-strip" role="tablist" aria-label="Project thumbnails">
          {ITEMS.map((item, index) => {
            const isActive = index === activeIndex;
            const isFeatured = FEATURED_IDS.has(item.id);
            const thumbSrc = getThumbMedia(item);
            return (
              <button
                type="button"
                key={item.id}
                ref={isActive ? activeThumbRef : null}
                data-id={item.id}
                className={`hg-thumb cg-card${isActive ? ' is-active' : ''}${isFeatured ? ' cg-card--featured' : ''}`}
                onMouseEnter={() => handleThumbEnter(index)}
                onFocus={() => handleThumbEnter(index)}
                onClick={() => handleThumbClick(index)}
                role="tab"
                aria-selected={isActive}
                aria-label={`Preview ${item.title}`}
                title={item.title}
              >
                {isVideoSrc(thumbSrc) ? (
                  <video
                    src={thumbSrc}
                    className="hg-thumb-img"
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={thumbSrc}
                    alt={item.title}
                    className="hg-thumb-img"
                    draggable={false}
                    loading="lazy"
                  />
                )}
                <div className="hg-thumb-overlay">
                  <span className="hg-thumb-title">{item.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CircularGallery;
