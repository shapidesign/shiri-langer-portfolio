import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ProjectText } from '../../config/projectTexts';
import { getDisplayImage } from '../../utils/imagePathUtils';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { indexOfProjectId } from '../../utils/portfolioOrdering';
import './CircularGallery.css';

interface CircularGalleryProps {
  onOpen: (id: number) => void;
}

function isVideoSrc(src: string): boolean {
  const s = src.toLowerCase();
  return s.endsWith('.mp4') || s.endsWith('.webm') || s.endsWith('.mov');
}

const CircularGallery: React.FC<CircularGalleryProps> = ({ onOpen }) => {
  const { orderedCarouselItems: ITEMS, featuredIds: FEATURED_IDS, siteSettings, loading } =
    usePortfolioData();

  const heroStartIndex = useMemo(
    () => indexOfProjectId(ITEMS, siteSettings.defaultHeroProjectId),
    [ITEMS, siteSettings.defaultHeroProjectId],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const didInitialCenterRef = useRef(false);

  const activeItem = ITEMS[activeIndex] ?? ITEMS[0];
  const displayItem = ITEMS[displayIndex] ?? ITEMS[0];

  useEffect(() => {
    if (loading) return;
    if (ITEMS.length === 0) return;
    const idx = Math.min(heroStartIndex, ITEMS.length - 1);
    setActiveIndex(idx);
    setDisplayIndex(idx);
  }, [loading, heroStartIndex, ITEMS.length]);

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
    if (ITEMS.length === 0) return;
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
  }, [activeIndex, getHeroMedia, ITEMS]);

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

  // Center the default hero thumbnail on mount / when portfolio data resolves.
  useLayoutEffect(() => {
    didInitialCenterRef.current = false;
  }, [loading, heroStartIndex, ITEMS.length]);

  useLayoutEffect(() => {
    if (didInitialCenterRef.current) return;
    if (loading || ITEMS.length === 0) return;
    const strip = stripRef.current;
    if (!strip) return;

    const centerTomi = (): boolean => {
      const thumbs = strip.querySelectorAll<HTMLButtonElement>('.hg-thumb');
      const targetIdx = Math.min(heroStartIndex, thumbs.length - 1);
      const target = thumbs[targetIdx];
      if (!target || strip.clientWidth === 0 || target.offsetWidth === 0) return false;
      let offsetLeft = 0;
      let node: HTMLElement | null = target;
      while (node && node !== strip) {
        offsetLeft += node.offsetLeft;
        node = node.offsetParent as HTMLElement | null;
      }
      strip.scrollLeft = offsetLeft - strip.clientWidth / 2 + target.offsetWidth / 2;
      return true;
    };

    if (centerTomi()) {
      didInitialCenterRef.current = true;
      return;
    }
    let tries = 0;
    const id = window.setInterval(() => {
      tries += 1;
      if (centerTomi() || tries > 60) {
        window.clearInterval(id);
        didInitialCenterRef.current = true;
      }
    }, 16);
    return () => window.clearInterval(id);
  }, [loading, heroStartIndex, ITEMS.length]);

  // Wheel → horizontal scroll (mouse wheels deliver deltaY; trackpads send
  // deltaX natively and need no translation).
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Pointer-drag to scroll (click-and-drag on desktop, native touch scroll
  // handles touchscreens).
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    let pointerId = 0;
    const DRAG_THRESHOLD = 4;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return; // let native touch scroll handle it
      if (e.button !== 0) return;
      isDown = true;
      startX = e.clientX;
      startScrollLeft = el.scrollLeft;
      pointerId = e.pointerId;
      el.classList.remove('is-dragging');
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (!el.classList.contains('is-dragging') && Math.abs(dx) > DRAG_THRESHOLD) {
        el.classList.add('is-dragging');
        el.setPointerCapture(pointerId);
      }
      if (el.classList.contains('is-dragging')) {
        el.scrollLeft = startScrollLeft - dx;
        e.preventDefault();
      }
    };
    const endDrag = () => {
      isDown = false;
      if (el.classList.contains('is-dragging')) {
        // Swallow the trailing click so a drag doesn't trigger thumb click.
        const swallow = (ev: MouseEvent) => {
          ev.stopPropagation();
          ev.preventDefault();
          el.removeEventListener('click', swallow, true);
        };
        el.addEventListener('click', swallow, true);
        el.classList.remove('is-dragging');
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointercancel', endDrag);
    el.addEventListener('pointerleave', endDrag);
    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', endDrag);
      el.removeEventListener('pointercancel', endDrag);
      el.removeEventListener('pointerleave', endDrag);
    };
  }, []);

  const handleThumbClick = useCallback(
    (index: number) => {
      if (index === activeIndex) {
        onOpen(activeItem.id);
      } else {
        setActiveIndex(index);
      }
    },
    [activeIndex, activeItem, onOpen],
  );

  const handleHeroClick = useCallback(() => {
    onOpen(activeItem.id);
  }, [activeItem, onOpen]);

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
                data-id={item.id}
                className={`hg-thumb cg-card${isActive ? ' is-active' : ''}${isFeatured ? ' cg-card--featured' : ''}`}
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
