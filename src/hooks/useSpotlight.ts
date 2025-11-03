import { useEffect, useRef } from 'react';
import { SpotlightManager } from '../managers/SpotlightManager';
import { LoadingManager } from '../managers/LoadingManager';

/**
 * Hook for using SpotlightManager
 */
export const useSpotlight = (
  overlayRef: React.RefObject<HTMLDivElement | null>,
  fadeRef: React.RefObject<HTMLDivElement | null>
) => {
  const spotlightManagerRef = useRef<SpotlightManager | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    spotlightManagerRef.current = new SpotlightManager();
    const loadingManager = LoadingManager.getInstance();
    
    // Initialize when overlayRef is available
    const initializeSpotlight = () => {
      if (overlayRef.current && spotlightManagerRef.current) {
        spotlightManagerRef.current.initialize(overlayRef.current);
        
        // Mark spotlight as loaded after a short delay to ensure it's fully ready
        setTimeout(() => {
          loadingManager.markLoaded('spotlight');
        }, 200);
      }
    };
    
    // Try to initialize immediately
    initializeSpotlight();
    
    // Also try after a short delay in case the ref isn't ready yet
    const timeoutId = setTimeout(initializeSpotlight, 100);

    return () => {
      clearTimeout(timeoutId);
      // Cleanup handled by GSAP
    };
  }, [overlayRef]);

  const handlers = spotlightManagerRef.current?.getHandlers(containerRef, fadeRef) || {
    onPointerMove: () => {},
    onPointerLeave: () => {}
  };

  return { containerRef, ...handlers };
};
