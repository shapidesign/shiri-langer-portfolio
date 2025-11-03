import { useEffect, useRef, useState, useCallback } from 'react';
import { LenisScrollManager } from '../managers/LenisScrollManager';

interface UseDragScrollOptions {
  lenisManager?: LenisScrollManager | null;
  enabled?: boolean;
  resistance?: number;
  dragThreshold?: number; // Minimum distance to consider it a drag (not a click)
}

// Global ref to track if we just dragged (shared across all instances)
const globalDragStateRef = { wasDragging: false, dragEndTime: 0 };

/**
 * useDragScroll - React hook for mouse drag-to-scroll
 * Works seamlessly with Lenis smooth scrolling
 * Handles both drag and click - distinguishes between them based on movement
 */
export const useDragScroll = (options: UseDragScrollOptions = {}) => {
  const { lenisManager, enabled = true, resistance = 1, dragThreshold = 5 } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPotentialDrag, setIsPotentialDrag] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const scrollVelocity = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const hasMoved = useRef(false);
  const lastTime = useRef<number>(performance.now());

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!enabled) return;
    
    // Only allow drag on left mouse button
    if (e.button !== 0) return;

    // Don't prevent default immediately - we'll check if it's actually a drag
    startPos.current = { x: e.clientX, y: e.clientY };
    currentPos.current = { x: e.clientX, y: e.clientY };
    scrollVelocity.current = { x: 0, y: 0 };
    hasMoved.current = false;
    globalDragStateRef.wasDragging = false;
    setIsPotentialDrag(true);
  }, [enabled]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isPotentialDrag && !isDragging) return;

    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    const distance = Math.hypot(deltaX, deltaY);

    // Check if movement exceeds threshold to consider it a drag
    if (distance > dragThreshold && !isDragging) {
      setIsDragging(true);
      hasMoved.current = true;
      globalDragStateRef.wasDragging = true;
      
      // Prevent default to stop text selection and clicks
      e.preventDefault();
      
      // Change cursor globally
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    }

    if (!isDragging) return;

    const now = performance.now();
    const deltaTime = Math.max(1, now - lastTime.current);
    lastTime.current = now;

    const scrollDeltaX = (e.clientX - currentPos.current.x) * resistance;
    const scrollDeltaY = (e.clientY - currentPos.current.y) * resistance;

    // Calculate velocity for momentum
    scrollVelocity.current.x = scrollDeltaX / deltaTime;
    scrollVelocity.current.y = scrollDeltaY / deltaTime;

    // Apply scroll directly to Lenis
    if (lenisManager) {
      const lenis = lenisManager.getLenis();
      if (lenis) {
        // Scroll vertically (for vertical scroll)
        lenis.scrollTo(lenis.scroll - scrollDeltaY, { immediate: true });
      }
    } else {
      // Fallback to native scroll if Lenis not available
      window.scrollBy(-scrollDeltaX, -scrollDeltaY);
    }

    currentPos.current = { x: e.clientX, y: e.clientY };
  }, [isDragging, isPotentialDrag, lenisManager, resistance, dragThreshold]);

  const handleMouseUp = useCallback(() => {
    const wasDragging = isDragging;
    
    setIsDragging(false);
    setIsPotentialDrag(false);
    
    // Mark the drag end time so clicks within 100ms are blocked
    if (wasDragging) {
      globalDragStateRef.dragEndTime = performance.now();
    }
    
    hasMoved.current = false;

    // Restore cursor globally
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    // Apply momentum scroll only if we were actually dragging
    if (wasDragging) {
      const applyMomentum = () => {
        if (!lenisManager) return;

        const friction = 0.95;
        scrollVelocity.current.x *= friction;
        scrollVelocity.current.y *= friction;

        if (Math.abs(scrollVelocity.current.y) > 0.1) {
          const lenis = lenisManager.getLenis();
          if (lenis) {
            lenis.scrollTo(lenis.scroll - scrollVelocity.current.y * 16, { immediate: false });
          }
          rafId.current = requestAnimationFrame(applyMomentum);
        } else {
          scrollVelocity.current = { x: 0, y: 0 };
        }
      };

      // Cancel previous momentum
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      // Start momentum
      if (Math.abs(scrollVelocity.current.y) > 0.1) {
        rafId.current = requestAnimationFrame(applyMomentum);
      }
    }
  }, [isDragging, lenisManager]);

  // Setup global mouse event listeners
  useEffect(() => {
    if (!isPotentialDrag && !isDragging) return;

    window.addEventListener('mousemove', handleMouseMove, { passive: false });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      // Clean up on unmount
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isPotentialDrag, isDragging, handleMouseMove, handleMouseUp]);

  return {
    containerRef,
    isDragging,
    onMouseDown: handleMouseDown,
    wasDragging: () => {
      // Check if we dragged recently (within last 150ms)
      const timeSinceDrag = performance.now() - globalDragStateRef.dragEndTime;
      return globalDragStateRef.wasDragging && timeSinceDrag < 150;
    },
  };
};
