import { useRef, useCallback } from 'react';

interface PinchZoomState {
  scale: number;
  translateX: number;
  translateY: number;
  minScale: number;
  maxScale: number;
}

interface UsePinchZoomOptions {
  minScale?: number;
  maxScale?: number;
  onZoomChange?: (scale: number) => void;
  onZoomEnd?: () => void;
}

/**
 * usePinchZoom - Hook for pinch-to-zoom functionality on images
 * Optimized for performance with GPU-accelerated transforms
 */
export const usePinchZoom = (options: UsePinchZoomOptions = {}) => {
  const {
    minScale = 1,
    maxScale = 3,
    onZoomChange,
    onZoomEnd
  } = options;

  const stateRef = useRef<PinchZoomState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
    minScale,
    maxScale
  });

  const elementRef = useRef<HTMLElement | null>(null);
  const startDistanceRef = useRef<number>(0);
  const startScaleRef = useRef<number>(1);
  const startCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  /**
   * Handle pinch gesture
   */
  const handlePinch = useCallback((scale: number, center: { x: number; y: number }) => {
    if (!elementRef.current) return;

    const newScale = Math.max(minScale, Math.min(maxScale, startScaleRef.current * scale));
    
    // Calculate translation to keep pinch center point fixed
    const rect = elementRef.current.getBoundingClientRect();
    const centerX = center.x - rect.left;
    const centerY = center.y - rect.top;
    
    const scaleChange = newScale / stateRef.current.scale;
    stateRef.current.translateX = centerX - (centerX - stateRef.current.translateX) * scaleChange;
    stateRef.current.translateY = centerY - (centerY - stateRef.current.translateY) * scaleChange;
    
    stateRef.current.scale = newScale;

    // Apply transform using GPU-accelerated properties
    elementRef.current.style.transform = `translate(${stateRef.current.translateX}px, ${stateRef.current.translateY}px) scale(${newScale})`;
    elementRef.current.style.transformOrigin = '0 0';

    if (onZoomChange) {
      onZoomChange(newScale);
    }
  }, [minScale, maxScale, onZoomChange]);

  /**
   * Initialize pinch zoom on element
   */
  const initialize = useCallback((element: HTMLElement) => {
    elementRef.current = element;
    
    // Reset state
    stateRef.current.scale = 1;
    stateRef.current.translateX = 0;
    stateRef.current.translateY = 0;
    
    // Enable GPU acceleration
    element.style.willChange = 'transform';
    element.style.transform = 'translate(0, 0) scale(1)';
    element.style.transformOrigin = '0 0';
  }, []);

  /**
   * Start pinch gesture
   */
  const startPinch = useCallback((distance: number, center: { x: number; y: number }) => {
    startDistanceRef.current = distance;
    startScaleRef.current = stateRef.current.scale;
    startCenterRef.current = center;
  }, []);

  /**
   * Reset zoom
   */
  const resetZoom = useCallback(() => {
    if (!elementRef.current) return;
    
    stateRef.current.scale = 1;
    stateRef.current.translateX = 0;
    stateRef.current.translateY = 0;
    
    elementRef.current.style.transform = 'translate(0, 0) scale(1)';
    
    if (onZoomEnd) {
      onZoomEnd();
    }
  }, [onZoomEnd]);

  /**
   * Get current scale
   */
  const getScale = useCallback(() => {
    return stateRef.current.scale;
  }, []);

  return {
    initialize,
    handlePinch,
    startPinch,
    resetZoom,
    getScale
  };
};

