import { useRef, useState, useEffect, useCallback } from 'react';
import { LoadingManager } from '../managers/LoadingManager';

interface GridConfig {
  tileWidth: number;
  tileHeight: number;
  tileGap: number;
  visibleCols: number;
  visibleRows: number;
  marginCols: number;
  marginRows: number;
}

export interface TileRange {
  firstRow: number;
  firstCol: number;
  baseLeft: number;
  baseTop: number;
  colsToDraw: number;
  rowsToDraw: number;
}

/**
 * Lerp factor controls how quickly the visual position catches up to the target.
 * 0.12 ≈ 90% of distance covered in ~300ms at 60fps — feels like cosmos.so glide.
 */
const LERP = 0.12;
const LERP_SNAP = 0.5;

/**
 * useGridPanning — High-performance 2D grid panning system.
 *
 * Instead of updating React state on every frame (which re-renders all tiles),
 * this hook:
 *   1. Stores target & smooth offsets as refs (no re-renders)
 *   2. Runs a rAF loop that lerps smooth toward target
 *   3. Applies a single CSS transform on the grid container (GPU-only, zero layout cost)
 *   4. Only triggers React re-renders when the visible tile range changes
 *
 * Handles: wheel scroll, pointer drag (touch + middle-click), keyboard nav, momentum.
 */
export const useGridPanning = (
  gridRef: React.RefObject<HTMLElement | null>,
  config: GridConfig,
  isMobile: boolean,
  modalOpen: boolean = false,
) => {
  // --- Refs that update at 60fps without triggering React ---
  const targetOffset = useRef({ x: 0, y: 0 });
  const smoothOffset = useRef({ x: 0, y: 0 });
  const rafId = useRef(0);

  // Drag
  const isDraggingRef = useRef(false);
  const isPotentialDrag = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastPointer = useRef({ x: 0, y: 0 });
  const lastPointerTime = useRef(0);
  const dragVelocity = useRef({ x: 0, y: 0 });
  const momentumRaf = useRef(0);

  // Keep latest values accessible in rAF/handlers without re-creating closures
  const configRef = useRef(config);
  configRef.current = config;
  const isMobileRef = useRef(isMobile);
  isMobileRef.current = isMobile;
  const modalOpenRef = useRef(modalOpen);
  modalOpenRef.current = modalOpen;

  const dragThreshold = isMobile ? 8 : 5;

  // --- Tile range (only piece that triggers React re-renders) ---
  const prevRange = useRef({ firstRow: 0, firstCol: 0 });

  const computeRange = useCallback((ox: number, oy: number): TileRange => {
    const c = configRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const sx = c.tileWidth + c.tileGap;
    const sy = c.tileHeight + c.tileGap;
    const baseLeft = (vw - c.visibleCols * sx) / 2;
    const baseTop = (vh - c.visibleRows * sy) / 2;
    return {
      firstRow: Math.floor((-oy - baseTop) / sy) - c.marginRows,
      firstCol: Math.floor((-ox - baseLeft) / sx) - c.marginCols,
      baseLeft,
      baseTop,
      colsToDraw: c.visibleCols + c.marginCols * 2,
      rowsToDraw: c.visibleRows + c.marginRows * 2,
    };
  }, []);

  const [tileRange, setTileRange] = useState<TileRange>(() => computeRange(0, 0));

  // --- Main animation loop ---
  useEffect(() => {
    const loop = () => {
      const dx = targetOffset.current.x - smoothOffset.current.x;
      const dy = targetOffset.current.y - smoothOffset.current.y;

      if (Math.abs(dx) > LERP_SNAP || Math.abs(dy) > LERP_SNAP) {
        smoothOffset.current.x += dx * LERP;
        smoothOffset.current.y += dy * LERP;
      } else {
        smoothOffset.current.x = targetOffset.current.x;
        smoothOffset.current.y = targetOffset.current.y;
      }

      // GPU-composited transform — no layout recalculation
      if (gridRef.current) {
        gridRef.current.style.transform =
          `translate3d(${smoothOffset.current.x}px, ${smoothOffset.current.y}px, 0)`;
      }

      // Only trigger React re-render when visible tile set changes
      const range = computeRange(smoothOffset.current.x, smoothOffset.current.y);
      if (
        range.firstRow !== prevRange.current.firstRow ||
        range.firstCol !== prevRange.current.firstCol
      ) {
        prevRange.current = { firstRow: range.firstRow, firstCol: range.firstCol };
        setTileRange(range);
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    const lm = LoadingManager.getInstance();
    setTimeout(() => lm.markLoaded('drag'), 100);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (momentumRaf.current) cancelAnimationFrame(momentumRaf.current);
    };
  }, [gridRef, computeRange]);

  // Recalculate tile range when grid config or screen size changes
  useEffect(() => {
    const range = computeRange(smoothOffset.current.x, smoothOffset.current.y);
    prevRange.current = { firstRow: range.firstRow, firstCol: range.firstCol };
    setTileRange(range);
  }, [config, computeRange]);

  // --- Keyboard navigation ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalOpenRef.current) return;
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;

      e.preventDefault();
      const step = e.shiftKey ? 200 : 100;

      if (e.key === 'ArrowLeft') targetOffset.current.x += step;
      if (e.key === 'ArrowRight') targetOffset.current.x -= step;
      if (e.key === 'ArrowUp') targetOffset.current.y += step;
      if (e.key === 'ArrowDown') targetOffset.current.y -= step;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Gesture prevention (macOS swipe-back, pinch zoom) ---
  useEffect(() => {
    const prevent = (e: Event) => {
      if (!modalOpenRef.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('gesturestart', prevent, { passive: false });
    document.addEventListener('gesturechange', prevent, { passive: false });
    document.addEventListener('gestureend', prevent, { passive: false });

    return () => {
      document.removeEventListener('gesturestart', prevent);
      document.removeEventListener('gesturechange', prevent);
      document.removeEventListener('gestureend', prevent);
    };
  }, []);

  // --- Wheel handler ---
  const onWheel = useCallback((e: React.WheelEvent) => {
    const t = e.target as HTMLElement;
    if (t.closest('.about-modal-content, .about-modal-scrollable, .project-modal-container, .project-modal-content, .modal-container, .modal-content')) {
      return;
    }
    if (isMobileRef.current) return;

    e.preventDefault();

    let dx = e.deltaX;
    let dy = e.deltaY;
    if (e.deltaMode === 1) { dx *= 40; dy *= 40; }
    if (e.deltaMode === 2) { dx *= window.innerHeight; dy *= window.innerHeight; }

    // Direct 1:1 mapping — the lerp provides all the smoothing we need
    targetOffset.current.x -= dx;
    targetOffset.current.y -= dy;
  }, []);

  // --- Pointer (drag) handlers ---
  const stopMomentum = useCallback(() => {
    if (momentumRaf.current) {
      cancelAnimationFrame(momentumRaf.current);
      momentumRaf.current = 0;
    }
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const isMiddleClick = e.button === 1;
    const isTouchOrLeft = e.pointerType === 'touch' || (isMobileRef.current && e.button === 0);
    if (!isMiddleClick && !isTouchOrLeft) return;

    stopMomentum();

    // Snap target to current visual position (instantly stops any glide)
    targetOffset.current.x = smoothOffset.current.x;
    targetOffset.current.y = smoothOffset.current.y;

    dragStart.current = { x: e.clientX, y: e.clientY };
    lastPointer.current = { x: e.clientX, y: e.clientY };
    lastPointerTime.current = performance.now();
    dragVelocity.current = { x: 0, y: 0 };

    if (isMiddleClick) {
      e.preventDefault();
      isDraggingRef.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      (e.currentTarget as HTMLElement).style.cursor = 'grabbing';
    } else {
      isPotentialDrag.current = true;
      isDraggingRef.current = false;
    }
  }, [stopMomentum]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current && !isPotentialDrag.current) return;

    // Delayed capture: distinguish tap from drag
    if (isPotentialDrag.current && !isDraggingRef.current) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      if (Math.hypot(dx, dy) > dragThreshold) {
        isDraggingRef.current = true;
        isPotentialDrag.current = false;
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        e.preventDefault();
        (e.currentTarget as HTMLElement).style.cursor = 'grabbing';
        lastPointer.current = { x: e.clientX, y: e.clientY };
        lastPointerTime.current = performance.now();
      }
      return;
    }

    const now = performance.now();
    const dt = Math.max(1, now - lastPointerTime.current);
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;

    // EMA velocity tracking for smooth momentum on release
    const alpha = 0.4;
    dragVelocity.current.x = alpha * (dx / dt) + (1 - alpha) * dragVelocity.current.x;
    dragVelocity.current.y = alpha * (dy / dt) + (1 - alpha) * dragVelocity.current.y;

    // During active drag: update BOTH target and smooth for zero-latency response
    targetOffset.current.x += dx;
    targetOffset.current.y += dy;
    smoothOffset.current.x += dx;
    smoothOffset.current.y += dy;

    lastPointer.current = { x: e.clientX, y: e.clientY };
    lastPointerTime.current = now;
  }, [dragThreshold]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    isPotentialDrag.current = false;
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    (e.currentTarget as HTMLElement).style.cursor = '';

    // Momentum: velocity decays exponentially, applied to targetOffset so the lerp smooths it
    const maxVel = isMobileRef.current ? 1.5 : 2.0;
    let vx = Math.max(-maxVel, Math.min(maxVel, dragVelocity.current.x));
    let vy = Math.max(-maxVel, Math.min(maxVel, dragVelocity.current.y));
    const friction = isMobileRef.current ? 0.96 : 0.97;

    const applyMomentum = () => {
      vx *= friction;
      vy *= friction;

      if (Math.abs(vx) > 0.001 || Math.abs(vy) > 0.001) {
        targetOffset.current.x += vx * 16;
        targetOffset.current.y += vy * 16;
        momentumRaf.current = requestAnimationFrame(applyMomentum);
      } else {
        momentumRaf.current = 0;
      }
    };

    if (Math.abs(vx) > 0.01 || Math.abs(vy) > 0.01) {
      momentumRaf.current = requestAnimationFrame(applyMomentum);
    }
  }, []);

  const isDragging = useCallback(() => isDraggingRef.current, []);

  return {
    tileRange,
    onWheel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    isDragging,
  };
};
