import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDragInertia } from '../../hooks/useDragInertia';
import { ProjectService } from '../../managers/ProjectService';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { ProjectTile } from '../ProjectTile';
import ContactModal from '../ContactModal';
import ProjectModal from '../ProjectModal';
import AboutModal from '../AboutModal';
import { ProjectConfig } from '../../types/Project';
import { DragOffset } from '../../types/Drag';
import './PortfolioGrid.css';

// Projects that should render as larger tiles (cols × rows).
const LARGE_TILES: Record<number, { cols: number; rows: number }> = {
  1: { cols: 2, rows: 2 }, // Tomi
  2: { cols: 2, rows: 2 }, // Red Chair
  3: { cols: 2, rows: 2 }, // 3D Filters
  4: { cols: 2, rows: 2 }, // PITA
  5: { cols: 2, rows: 2 }, // Itamar
};

// Stable array of project IDs that should render as large tiles.
// Defined at module level so it's never recreated across renders.
const LARGE_TILE_IDS: number[] = Object.keys(LARGE_TILES).map(Number);

const PortfolioGrid: React.FC = () => {
  // ── Modal & UI state ─────────────────────────────────────────────────────
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [showAffordance, setShowAffordance] = useState(true);

  // ── Responsive grid config ────────────────────────────────────────────────
  const [screenSize, setScreenSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({ width, height });
      setIsMobile(Boolean(
        width <= 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0 && width <= 1024)
      ));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hide affordance after 5 s or on first pointer interaction
  useEffect(() => {
    const hide = () => setShowAffordance(false);
    const timer = setTimeout(hide, 5000);
    window.addEventListener('pointerdown', hide, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', hide);
    };
  }, []);

  const gridConfig: ProjectConfig = useMemo(() => {
    const { width } = screenSize;
    if (width <= 480) {
      return { tileWidth: 130, tileHeight: 165, tileGap: 8, visibleCols: 2, visibleRows: 3, marginCols: 3, marginRows: 3 };
    } else if (width <= 768) {
      return { tileWidth: 165, tileHeight: 215, tileGap: 10, visibleCols: 3, visibleRows: 3, marginCols: 3, marginRows: 3 };
    } else if (width <= 1024) {
      return { tileWidth: 220, tileHeight: 285, tileGap: 16, visibleCols: 4, visibleRows: 3, marginCols: 3, marginRows: 3 };
    } else {
      return { tileWidth: 235, tileHeight: 315, tileGap: 16, visibleCols: 5, visibleRows: 3, marginCols: 3, marginRows: 3 };
    }
  }, [screenSize]);

  const projectService = useMemo(() => new ProjectService(gridConfig), [gridConfig]);

  useEffect(() => {
    projectService.updateConfig(gridConfig);
  }, [projectService, gridConfig]);

  // ── Position management — fully ref-based, bypasses React render path ────
  //
  // positionRef  : the live canvas offset (updated by wheel / drag / keyboard)
  // gridLayerRef : DOM ref — transform is applied directly, no JSX style prop
  // gcRef        : mirror of gridConfig, always current, readable in callbacks
  //
  // Re-renders are triggered only when the integer tile-grid origin changes
  // (i.e. which rows/cols need to be generated). Everything else is pure DOM.

  const positionRef = useRef<DragOffset>({ x: 0, y: 0 });
  const gridLayerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Always-current mirror of gridConfig (safe to read inside RAF / event handlers)
  const gcRef = useRef(gridConfig);
  gcRef.current = gridConfig;

  // Tile origin change detection — triggers re-render for cell generation
  const tileOriginRef = useRef({ firstRow: 0, firstCol: 0 });
  const [, forceUpdate] = useState(0);

  /** Compute tile origin from position and trigger re-render if it changed. */
  const updateTileOrigin = useCallback((x: number, y: number) => {
    const gc = gcRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const baseLeft = (vw - gc.visibleCols * (gc.tileWidth + gc.tileGap)) / 2;
    const baseTop  = (vh - gc.visibleRows * (gc.tileHeight + gc.tileGap)) / 2;
    const newFC = Math.floor((-x - baseLeft) / (gc.tileWidth + gc.tileGap)) - gc.marginCols;
    const newFR = Math.floor((-y - baseTop)  / (gc.tileHeight + gc.tileGap)) - gc.marginRows;
    if (newFR !== tileOriginRef.current.firstRow || newFC !== tileOriginRef.current.firstCol) {
      tileOriginRef.current = { firstRow: newFR, firstCol: newFC };
      React.startTransition(() => { forceUpdate(v => v + 1); });
    }
  }, []); // stable — only touches refs

  // Shared RAF handle for drag-path tile-origin batching (reuses tileRafRef pattern)
  const dragTileRafRef = useRef(0);

  /** Universal position setter — compatible with React.Dispatch signature so
   *  DragManager can call it unchanged. Applies transform to DOM directly.
   *  Tile-origin updates are deferred to RAF so pointer-move events are never
   *  blocked by a synchronous React re-render. */
  const setOffset: React.Dispatch<React.SetStateAction<DragOffset>> = useCallback((updater) => {
    const current = positionRef.current;
    const newPos = typeof updater === 'function' ? updater(current) : updater;
    positionRef.current = newPos;
    if (gridLayerRef.current) {
      gridLayerRef.current.style.transform = `translate(${newPos.x}px, ${newPos.y}px)`;
    }
    // Batch the React re-render to RAF — keeps drag/inertia on the fast path
    if (!dragTileRafRef.current) {
      dragTileRafRef.current = requestAnimationFrame(() => {
        dragTileRafRef.current = 0;
        updateTileOrigin(positionRef.current.x, positionRef.current.y);
      });
    }
  }, [updateTileOrigin]); // stable

  /** Getter so keyboard navigation always reads the live position. */
  const getOffset = useCallback(() => positionRef.current, []);

  // Seed the correct initial tile origin (positionRef starts at 0,0)
  useLayoutEffect(() => {
    updateTileOrigin(0, 0);
  }, [updateTileOrigin]);

  // Cancel any pending RAF handles on unmount
  useEffect(() => {
    return () => {
      if (tileRafRef.current) cancelAnimationFrame(tileRafRef.current);
      if (dragTileRafRef.current) cancelAnimationFrame(dragTileRafRef.current);
    };
  }, []);

  // ── Native wheel listener — bypasses React synthetic event system ─────────
  //
  // React's synthetic onWheel can be affected by React 18/19 automatic batching
  // and concurrent-mode scheduling, causing the "gets stuck" symptom on trackpad.
  // A native listener with { passive: false } is the most reliable path.

  // RAF handle used only to batch React re-renders (tile origin), not the DOM transform.
  const tileRafRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(
        '.about-modal-content, .about-modal-scrollable, .project-modal-container, .project-modal-content, .modal-container, .modal-content'
      )) return;
      if (isMobile) return;
      e.preventDefault();

      // Normalise deltaMode — mice can send LINE (1) or PAGE (2) units
      let dx = e.deltaX;
      let dy = e.deltaY;
      if (e.deltaMode === 1) { dx *= 20; dy *= 20; }
      else if (e.deltaMode === 2) { dx *= window.innerWidth; dy *= window.innerHeight; }

      // Apply the transform IMMEDIATELY in the event handler.
      // Since we write the DOM directly (not React state) the browser batches the
      // actual paint to the next vsync anyway — no RAF wrapper needed here.
      // This eliminates the one-frame lag that RAF batching was causing.
      const cur = positionRef.current;
      const newPos = { x: cur.x - dx, y: cur.y - dy };
      positionRef.current = newPos;
      if (gridLayerRef.current) {
        gridLayerRef.current.style.transform = `translate(${newPos.x}px, ${newPos.y}px)`;
      }

      // Tile-origin check triggers a React re-render — keep that in a RAF so
      // multiple wheel events per frame only produce one re-render.
      if (!tileRafRef.current) {
        tileRafRef.current = requestAnimationFrame(() => {
          tileRafRef.current = 0;
          updateTileOrigin(positionRef.current.x, positionRef.current.y);
        });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (tileRafRef.current) cancelAnimationFrame(tileRafRef.current);
    };
  }, [isMobile, updateTileOrigin]);

  // ── Drag & keyboard ───────────────────────────────────────────────────────
  const { onPointerDown, onPointerMove, onPointerUp, isDragging } = useDragInertia(setOffset);

  useKeyboardNavigation(
    getOffset,
    setOffset,
    isContactModalOpen || isProjectModalOpen || isAboutModalOpen
  );

  const handleProjectClick = useCallback((projectId: number) => {
    setSelectedProjectId(projectId);
    setIsProjectModalOpen(true);
  }, []);

  // ── Grid geometry (computed at render time from live positionRef) ──────────
  //
  // firstRow/firstCol are derived inline from positionRef.current so they are
  // always correct the instant this render runs — no initialisation race.

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const baseLeft = (vw - gridConfig.visibleCols * (gridConfig.tileWidth + gridConfig.tileGap)) / 2;
  const baseTop  = (vh - gridConfig.visibleRows * (gridConfig.tileHeight + gridConfig.tileGap)) / 2;

  const { x: posX, y: posY } = positionRef.current;
  const camX = -posX;
  const camY = -posY;

  const firstCol = Math.floor((camX - baseLeft) / (gridConfig.tileWidth + gridConfig.tileGap)) - gridConfig.marginCols;
  const firstRow = Math.floor((camY - baseTop)  / (gridConfig.tileHeight + gridConfig.tileGap)) - gridConfig.marginRows;
  const colsToDraw = gridConfig.visibleCols + gridConfig.marginCols * 2;
  const rowsToDraw = gridConfig.visibleRows + gridConfig.marginRows * 2;

  const cells = useMemo(() => {
    return projectService.generateGridCells(firstRow, firstCol, rowsToDraw, colsToDraw, LARGE_TILE_IDS);
  }, [projectService, firstRow, firstCol, rowsToDraw, colsToDraw]);

  const { largeTileAnchors, coveredCells } = useMemo(() => {
    const anchors = new Set<string>();
    const covered = new Set<string>();
    for (const { row, col, projId } of cells) {
      const tileDef = LARGE_TILES[projId];
      if (!tileDef) continue;
      // Large tiles are only placed at %3 slot positions (enforced in generateGridCells).
      // This check must match the slot logic there so they always align.
      if (row % 3 !== 0 || col % 3 !== 0) continue;
      const key = `${row}:${col}`;
      anchors.add(key);
      for (let dr = 0; dr < tileDef.rows; dr++) {
        for (let dc = 0; dc < tileDef.cols; dc++) {
          if (dr === 0 && dc === 0) continue;
          covered.add(`${row + dr}:${col + dc}`);
        }
      }
    }
    return { largeTileAnchors: anchors, coveredCells: covered };
  }, [cells]);

  return (
    <div
      ref={containerRef}
      className="portfolio-container"
      style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: 'var(--color-background)',
        color: 'var(--color-text)',
        overscrollBehavior: 'none',
        userSelect: 'none',
      } as React.CSSProperties}
    >
      {/* Gallery affordance */}
      {showAffordance && (
        <div className="gallery-affordance is-visible" aria-hidden="true">
          <div className="gallery-affordance-pill">
            {isMobile ? (
              /* Mobile: hand swipe icon */
              <div className="gallery-affordance-hand" aria-hidden="true">
                <svg viewBox="0 0 36 36" role="presentation" focusable="false" aria-hidden="true">
                  <path d="M30.74,15.19a13.66,13.66,0,0,0-6.87-3.83A26,26,0,0,0,18,10.58V5.28A3.4,3.4,0,0,0,14.5,2,3.4,3.4,0,0,0,11,5.28v10L9.4,13.7a3.77,3.77,0,0,0-5.28,0A3.67,3.67,0,0,0,3,16.33a3.6,3.6,0,0,0,1,2.56l4.66,5.52a11.53,11.53,0,0,0,1.43,4,10.12,10.12,0,0,0,2,2.54v1.92a1.07,1.07,0,0,0,1,1.08H27a1.07,1.07,0,0,0,1-1.08v-2.7a12.81,12.81,0,0,0,3-8.36v-6A1,1,0,0,0,30.74,15.19ZM29,21.86a10.72,10.72,0,0,1-2.6,7.26,1.11,1.11,0,0,0-.4.72V32H14.14V30.52a1,1,0,0,0-.44-.83,7.26,7.26,0,0,1-1.82-2.23,9.14,9.14,0,0,1-1.2-3.52,1,1,0,0,0-.23-.59L5.53,17.53a1.7,1.7,0,0,1,0-2.42,1.76,1.76,0,0,1,2.47,0l3,3v3.14l2-1V5.28A1.42,1.42,0,0,1,14.5,4,1.42,1.42,0,0,1,16,5.28v11.8l2,.43V12.59a24.27,24.27,0,0,1,2.51.18V18l1.6.35V13c.41.08.83.17,1.26.28a14.88,14.88,0,0,1,1.53.49v5.15l1.6.35V14.5A11.06,11.06,0,0,1,29,16.23Z" />
                </svg>
              </div>
            ) : (
              /* Desktop: 3-icon row — mouse / trackpad / arrow keys */
              <div className="gallery-affordance-icons" aria-hidden="true">
                {/* Mouse scroll wheel */}
                <div className="gallery-affordance-icon-item">
                  <svg width="28" height="42" viewBox="0 0 22 34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" role="presentation" focusable="false" aria-hidden="true">
                    <rect x="1.5" y="1.5" width="19" height="31" rx="9.5" />
                    <rect x="8.5" y="6" width="5" height="9" rx="2.5" stroke="none" fill="currentColor" opacity="0.25" />
                    <circle className="affordance-mouse-dot" cx="11" cy="9" r="2" fill="currentColor" stroke="none" />
                  </svg>
                </div>

                <div className="gallery-affordance-divider" />

                {/* Trackpad two-finger swipe */}
                <div className="gallery-affordance-icon-item">
                  <svg width="40" height="30" viewBox="0 0 30 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" role="presentation" focusable="false" aria-hidden="true">
                    <rect x="1.5" y="1.5" width="27" height="19" rx="4.5" />
                    <g className="affordance-trackpad-fingers">
                      <circle cx="11" cy="11" r="2.5" fill="currentColor" stroke="none" opacity="0.9" />
                      <circle cx="19" cy="11" r="2.5" fill="currentColor" stroke="none" opacity="0.9" />
                    </g>
                  </svg>
                </div>

                <div className="gallery-affordance-divider" />

                {/* Arrow keys */}
                <div className="gallery-affordance-icon-item">
                  <svg width="54" height="36" viewBox="0 0 42 28" fill="none" role="presentation" focusable="false" aria-hidden="true">
                    {/* ← left */}
                    <g className="affordance-key-left">
                      <rect x="0.75" y="7.75" width="12.5" height="12.5" rx="2.25" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      <path d="M9 14H4.5M4.5 14L6.5 12M4.5 14L6.5 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    {/* ↓ down */}
                    <g className="affordance-key-down">
                      <rect x="14.75" y="14.75" width="12.5" height="12.5" rx="2.25" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      <path d="M21 17.5V22M21 22L19 20M21 22L23 20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    {/* ↑ up */}
                    <g className="affordance-key-up">
                      <rect x="14.75" y="0.75" width="12.5" height="12.5" rx="2.25" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      <path d="M21 10V5.5M21 5.5L19 7.5M21 5.5L23 7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    {/* → right */}
                    <g className="affordance-key-right">
                      <rect x="28.75" y="7.75" width="12.5" height="12.5" rx="2.25" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      <path d="M33 14H37.5M37.5 14L35.5 12M37.5 14L35.5 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  </svg>
                </div>
              </div>
            )}
            <div className="gallery-affordance-text">
              {isMobile ? 'Swipe to explore' : 'Scroll, drag or use arrow keys'}
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Grid Interaction Layer
          Transform is applied directly to the DOM via gridLayerRef — no inline
          style prop — so React never needs to re-render to move the canvas. */}
      <div
        ref={gridLayerRef}
        className="grid-interaction-layer"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onMouseEnter={(e) => {
          if ((e.buttons & 4) === 4) {
            (e.currentTarget as HTMLElement).style.cursor = 'grabbing';
          }
        }}
        onMouseMove={(e) => {
          if ((e.buttons & 4) === 4) {
            (e.currentTarget as HTMLElement).style.cursor = 'grabbing';
          } else {
            (e.currentTarget as HTMLElement).style.cursor = 'default';
          }
        }}
        onPointerLeave={(e) => {
          (e.currentTarget as HTMLElement).style.cursor = 'default';
        }}
      >
        {cells.map(({ row, col, projId }) => {
          const cellKey = `${row}:${col}`;
          if (coveredCells.has(cellKey)) return null;
          const project = projectService.getProjectById(projId);
          if (!project) return null;
          if (projId === 17) return null;

          const tileDef = largeTileAnchors.has(cellKey) ? LARGE_TILES[projId] : undefined;
          const tileW = tileDef
            ? tileDef.cols * gridConfig.tileWidth + (tileDef.cols - 1) * gridConfig.tileGap
            : gridConfig.tileWidth;
          const tileH = tileDef
            ? tileDef.rows * gridConfig.tileHeight + (tileDef.rows - 1) * gridConfig.tileGap
            : gridConfig.tileHeight;

          return (
            <ProjectTile
              key={cellKey}
              left={baseLeft + col * (gridConfig.tileWidth + gridConfig.tileGap)}
              top={baseTop + row * (gridConfig.tileHeight + gridConfig.tileGap)}
              width={tileW}
              height={tileH}
              project={project}
              onOpen={handleProjectClick}
              isDragging={isDragging}
            />
          );
        })}
      </div>

      {/* About Me Button */}
      <button
        className="about-btn"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsAboutModalOpen(true); }}
        onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); setIsAboutModalOpen(true); }}
        aria-label="Open about me modal"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        About
      </button>

      {/* Contact Button */}
      <button
        className="contact-btn"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsContactModalOpen(true); }}
        onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); setIsContactModalOpen(true); }}
        aria-label="Open contact modal"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        Contact
      </button>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />

      <ProjectModal
        isOpen={isProjectModalOpen}
        projectId={selectedProjectId}
        onClose={() => { setIsProjectModalOpen(false); setSelectedProjectId(null); }}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onOpenContact={() => setIsContactModalOpen(true)}
        onOpenProject={(projectId) => { setSelectedProjectId(projectId); setIsProjectModalOpen(true); }}
      />
    </div>
  );
};

export default PortfolioGrid;
