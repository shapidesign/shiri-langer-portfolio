import { useEffect, useRef, useCallback } from 'react';
import { GestureManager, GestureCallbacks } from '../managers/GestureManager';
import { LenisScrollManager } from '../managers/LenisScrollManager';

interface UseUnifiedGesturesOptions {
  enabled?: boolean;
  lenisManager?: LenisScrollManager | null;
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down', velocity: number) => void;
  onPinch?: (scale: number, center: { x: number; y: number }) => void;
  onPinchEnd?: () => void;
  dragResistance?: number;
  swipeThreshold?: number;
}

/**
 * useUnifiedGestures - High-performance unified gesture hook
 * Integrates drag-to-scroll, swipe, pinch-to-zoom with Lenis smooth scrolling
 */
export const useUnifiedGestures = (
  elementRef: React.RefObject<HTMLElement>,
  options: UseUnifiedGesturesOptions = {}
) => {
  const {
    enabled = true,
    lenisManager,
    onSwipe,
    onPinch,
    onPinchEnd,
    dragResistance = 1,
    swipeThreshold = 50
  } = options;

  const gestureManagerRef = useRef<GestureManager | null>(null);
  const momentumRafId = useRef<number>(0);
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Initialize gesture manager
  useEffect(() => {
    if (!elementRef.current || !enabled) return;

    const callbacks: GestureCallbacks = {
      onDrag: (deltaX, deltaY, velocity) => {
        // Apply drag to scroll
        if (lenisManager) {
          const lenis = lenisManager.getLenis();
          if (lenis) {
            // Vertical scroll (negative deltaY because dragging down should scroll down)
            lenis.scrollTo(lenis.scroll - (deltaY * dragResistance), { immediate: true });
          }
        } else {
          // Fallback to native scroll
          window.scrollBy(-deltaX * dragResistance, -deltaY * dragResistance);
        }
        
        // Store velocity for momentum
        velocityRef.current = velocity;
      },
      
      onDragEnd: (velocity) => {
        // Apply momentum scrolling
        velocityRef.current = { x: velocity.x, y: velocity.y };
        
        const applyMomentum = () => {
          const friction = 0.92;
          velocityRef.current.x *= friction;
          velocityRef.current.y *= friction;
          
          if (Math.abs(velocityRef.current.y) > 0.1) {
            if (lenisManager) {
              const lenis = lenisManager.getLenis();
              if (lenis) {
                // Apply momentum scroll with easing
                lenis.scrollTo(
                  lenis.scroll - (velocityRef.current.y * 16),
                  { immediate: false }
                );
              }
            } else {
              window.scrollBy(0, -velocityRef.current.y * 16);
            }
            
            momentumRafId.current = requestAnimationFrame(applyMomentum);
          } else {
            velocityRef.current = { x: 0, y: 0 };
          }
        };
        
        if (Math.abs(velocityRef.current.y) > 0.1) {
          momentumRafId.current = requestAnimationFrame(applyMomentum);
        }
      },
      
      onSwipe: (direction, velocity) => {
        if (onSwipe) {
          onSwipe(direction, velocity);
        }
      },
      
      onPinch: (scale, center) => {
        if (onPinch) {
          onPinch(scale, center);
        }
      },
      
      onPinchEnd: () => {
        if (onPinchEnd) {
          onPinchEnd();
        }
      },
      
      onWheel: (deltaX, deltaY) => {
        // Wheel is handled by Lenis automatically, but we can customize here if needed
        // Lenis handles smooth wheel scrolling already
      }
    };

    gestureManagerRef.current = new GestureManager(elementRef.current, callbacks);
    gestureManagerRef.current.initialize();

    return () => {
      gestureManagerRef.current?.destroy();
      if (momentumRafId.current) {
        cancelAnimationFrame(momentumRafId.current);
      }
    };
  }, [elementRef, enabled, lenisManager, dragResistance, onSwipe, onPinch, onPinchEnd]);

  // Update enabled state
  useEffect(() => {
    if (gestureManagerRef.current) {
      gestureManagerRef.current.setEnabled(enabled);
    }
  }, [enabled]);

  return {
    gestureManager: gestureManagerRef.current,
    getGestureState: () => gestureManagerRef.current?.getState()
  };
};

