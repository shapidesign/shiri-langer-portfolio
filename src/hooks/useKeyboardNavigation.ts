import { useEffect, useRef } from 'react';
import { NavigationCoordinator } from '../coordinators/NavigationCoordinator';
import { NavigationConfig } from '../types/Navigation';

/**
 * Hook for keyboard navigation.
 * Accepts a getOffset getter (reads from a ref) so the coordinator always has
 * the live position — event listeners are never torn down/re-added on every scroll.
 */
export const useKeyboardNavigation = (
  getOffset: () => { x: number; y: number },
  setOffset: (offset: { x: number; y: number }) => void,
  isModalOpen: boolean,
  config?: Partial<NavigationConfig>
) => {
  const coordinatorRef = useRef<NavigationCoordinator | null>(null);
  const handlersRef = useRef<{ cleanup: () => void } | null>(null);

  useEffect(() => {
    coordinatorRef.current = new NavigationCoordinator(setOffset, getOffset, config);
    handlersRef.current = coordinatorRef.current.setupEventListeners();
    return () => {
      handlersRef.current?.cleanup();
    };
    // getOffset reads from a ref — always current, intentionally omitted from deps.
    // setOffset is stable (useCallback with no changing deps).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setOffset, config]);

  useEffect(() => {
    coordinatorRef.current?.setModalOpen(isModalOpen);
  }, [isModalOpen]);
};
