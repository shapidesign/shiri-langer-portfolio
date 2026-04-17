import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PROJECT_TEXTS } from '../../config/projectTexts';
import { getDisplayImage } from '../../utils/imagePathUtils';
import './CircularGallery.css';

interface CircularGalleryProps {
  onOpen: (id: number) => void;
}

interface Dims {
  radius: number;
  cardW: number;
  cardH: number;
}

function getDims(width: number): Dims {
  if (width <= 480)  return { radius: 290, cardW: 155, cardH: 218 };
  if (width <= 768)  return { radius: 380, cardW: 200, cardH: 282 };
  if (width <= 1024) return { radius: 470, cardW: 230, cardH: 324 };
  return               { radius: 560, cardW: 255, cardH: 360 };
}

const ITEMS = PROJECT_TEXTS.filter(p => p.id !== 17);
const FEATURED_IDS = new Set([1, 2, 3, 4, 5]); // Tomi, Chair 1, 3D Filters, PITA, Project Itamar
const COUNT  = ITEMS.length;
const STEP   = 360 / COUNT; // degrees between cards

const CircularGallery: React.FC<CircularGalleryProps> = ({ onOpen }) => {
  const [dims, setDims] = useState<Dims>(() => getDims(window.innerWidth));
  // Keep a ref so RAF callbacks always read the latest dims without closure capture
  const dimsRef = useRef(dims);
  dimsRef.current = dims;

  useEffect(() => {
    const onResize = () => {
      const d = getDims(window.innerWidth);
      setDims(d);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const sceneRef    = useRef<HTMLDivElement>(null);
  const stageRef    = useRef<HTMLDivElement>(null);
  const angleRef    = useRef(0);      // current carousel angle in degrees
  const velRef      = useRef(0);      // rotation velocity (deg/frame)
  const rafRef      = useRef(0);
  const downRef     = useRef(false);
  const draggingRef = useRef(false);
  const lastXRef    = useRef(0);
  const startXRef   = useRef(0);
  // Auto-spin on load so the user sees it's a 3D ring — stops on first interaction
  const autoSpinRef = useRef(true);

  // ── Core: position each card via translate3d so all cards face the camera ──
  // Cards are never rotated — the carousel angle moves their x/z position
  // around a circle, making the full ring visible from front AND back.
  const updateVisuals = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const { radius } = dimsRef.current;
    const angle = angleRef.current;
    const toRad = Math.PI / 180;

    // Counter-rotate each card to cancel the stage's rotateX tilt so cards face the user.
    // Must match the CSS value on .cg-stage (11deg desktop, 8deg on ≤480px).
    const tilt = window.innerWidth <= 480 ? 8 : 11;

    const cards = stage.children;
    for (let i = 0; i < cards.length; i++) {
      const θ = (i * STEP + angle) * toRad;
      const x =  Math.sin(θ) * radius;   // left ↔ right
      const z =  Math.cos(θ) * radius;   // front (+ ) ↔ back (-)
      const card = cards[i] as HTMLElement;

      // Front card (z ≈ +radius) → opacity 1, scale 1; back card (z ≈ −radius) → opacity 0.32, scale 0.80
      const t = (z + radius) / (2 * radius); // 0..1
      const scale = (0.80 + 0.20 * t).toFixed(3);
      card.style.transform = `translate3d(${x}px, 0px, ${z}px) rotateX(${tilt}deg) scale(${scale})`;
      card.style.opacity = String(0.32 + 0.68 * t);
    }
  }, []);

  // ── Inertia / auto-spin animation ────────────────────────────────────────
  const animate = useCallback(() => {
    if (autoSpinRef.current) {
      // Constant slow spin on load — no damping, runs until user interacts
      angleRef.current += 0.06;
      updateVisuals();
      rafRef.current = requestAnimationFrame(animate);
      return;
    }
    velRef.current *= 0.96;
    angleRef.current += velRef.current;
    updateVisuals();
    if (Math.abs(velRef.current) > 0.008) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      velRef.current = 0;
      rafRef.current = 0;
    }
  }, [updateVisuals]);

  // Stop auto-spin on first user interaction
  const stopAutoSpin = useCallback(() => {
    autoSpinRef.current = false;
  }, []);

  // ── Wheel ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.about-modal-content, .project-modal-container, .modal-container')) return;
      e.preventDefault();
      stopAutoSpin();
      const delta = (e.deltaX + e.deltaY) * 0.04;
      angleRef.current += delta;
      // Blend impulse into existing velocity (no hard reset) + cap to prevent runaway
      velRef.current = Math.max(-10, Math.min(10, velRef.current * 0.7 + delta * 0.5));
      updateVisuals();
      // Only start RAF if loop isn't already running — eliminates the cancel/restart gap
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [animate, updateVisuals, stopAutoSpin]);

  // ── Initial paint + auto-spin kickoff ────────────────────────────────────
  useEffect(() => {
    updateVisuals();
    rafRef.current = requestAnimationFrame(animate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // Repaint when dims change (resize)
  useEffect(() => { updateVisuals(); }, [updateVisuals, dims]);

  // ── Pointer drag ──────────────────────────────────────────────────────────
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    stopAutoSpin();
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    velRef.current = 0;
    downRef.current = true;
    draggingRef.current = false;
    lastXRef.current = e.clientX;
    startXRef.current = e.clientX;
    // No setPointerCapture — scene covers full viewport so bubbling is sufficient,
    // and capture would redirect pointerup to the scene and prevent card click events.
  }, [stopAutoSpin]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!downRef.current) return;
    const dx = e.clientX - lastXRef.current;
    if (Math.abs(e.clientX - startXRef.current) > 5) draggingRef.current = true;
    angleRef.current += dx * 0.25;
    velRef.current    = dx * 0.14;
    lastXRef.current  = e.clientX;
    updateVisuals();
  }, [updateVisuals]);

  const handlePointerUp = useCallback(() => {
    downRef.current = false;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
    setTimeout(() => { draggingRef.current = false; }, 60);
  }, [animate]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div
      ref={sceneRef}
      className="cg-scene"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div ref={stageRef} className="cg-stage">
        {ITEMS.map((project) => (
          <div
            key={project.id}
            data-id={project.id}
            className={`cg-card${FEATURED_IDS.has(project.id) ? ' cg-card--featured' : ''}`}
            style={{
              width:      dims.cardW,
              height:     dims.cardH,
              marginLeft: -dims.cardW / 2,
              marginTop:  -dims.cardH / 2,
            }}
            onClick={() => { if (!draggingRef.current) onOpen(project.id); }}
          >
            <img
              src={getDisplayImage(project.gallery || [])}
              alt={project.title}
              className="cg-card-img"
              draggable={false}
            />
            <div className="cg-card-overlay">
              <p className="cg-card-title">{project.title}</p>
              <p className="cg-card-year">{project.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CircularGallery;
