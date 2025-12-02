import { useEffect, useRef } from 'react';
import { LenisScrollManager } from '../managers/LenisScrollManager';

/**
 * useLenisScroll - React hook for Lenis smooth scrolling
 * Handles initialization, cleanup, and integration with existing scroll system
 */
export const useLenisScroll = (enabled: boolean = true) => {
  const lenisManagerRef = useRef<LenisScrollManager | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Initialize Lenis
    lenisManagerRef.current = new LenisScrollManager();
    lenisManagerRef.current.initialize();

    return () => {
      lenisManagerRef.current?.destroy();
      lenisManagerRef.current = null;
    };
  }, [enabled]);

  return {
    lenisManager: lenisManagerRef.current,
    scrollTo: (target: number | string | HTMLElement, options?: { offset?: number; immediate?: boolean }) => {
      lenisManagerRef.current?.scrollTo(target, options);
    },
    getScroll: () => lenisManagerRef.current?.getScroll() || 0,
  };
};
