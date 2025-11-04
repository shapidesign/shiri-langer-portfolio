import { useEffect, useRef } from 'react';
import { GestureManager, GestureCallbacks } from '../managers/GestureManager';

interface UseSwipeNavigationOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  enabled?: boolean;
}

/**
 * useSwipeNavigation - Hook for horizontal/vertical swipe navigation
 * Optimized for gallery navigation, modal closing, etc.
 */
export const useSwipeNavigation = (
  elementRef: React.RefObject<HTMLElement>,
  options: UseSwipeNavigationOptions = {}
) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    enabled = true
  } = options;

  const gestureManagerRef = useRef<GestureManager | null>(null);

  // Initialize swipe detection
  useEffect(() => {
    if (!elementRef.current || !enabled) return;

    const callbacks: GestureCallbacks = {
      onSwipe: (direction, velocity) => {
        // Only trigger if velocity is high enough (fast swipe)
        if (velocity < 0.3) return;

        switch (direction) {
          case 'left':
            if (onSwipeLeft) onSwipeLeft();
            break;
          case 'right':
            if (onSwipeRight) onSwipeRight();
            break;
          case 'up':
            if (onSwipeUp) onSwipeUp();
            break;
          case 'down':
            if (onSwipeDown) onSwipeDown();
            break;
        }
      }
    };

    gestureManagerRef.current = new GestureManager(elementRef.current, callbacks);
    gestureManagerRef.current.initialize();

    return () => {
      gestureManagerRef.current?.destroy();
    };
  }, [elementRef, enabled, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold]);

  return {
    gestureManager: gestureManagerRef.current
  };
};

