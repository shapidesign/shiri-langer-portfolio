import { useEffect, useRef } from 'react';
import { NavigationCoordinator } from '../coordinators/NavigationCoordinator';
import { NavigationConfig } from '../types/Navigation';

/**
 * Hook for keyboard navigation
 */
export const useKeyboardNavigation = (
  offset: { x: number; y: number },
  setOffset: (offset: { x: number; y: number }) => void,
  isModalOpen: boolean,
  config?: Partial<NavigationConfig>
) => {
  const coordinatorRef = useRef<NavigationCoordinator | null>(null);
  const handlersRef = useRef<{ cleanup: () => void } | null>(null);

  useEffect(() => {
    // Create coordinator
    coordinatorRef.current = new NavigationCoordinator(setOffset, config);
    
    // Setup event listeners
    handlersRef.current = coordinatorRef.current.setupEventListeners(offset);

    return () => {
      handlersRef.current?.cleanup();
    };
  }, [setOffset, config]);

  useEffect(() => {
    // Update modal state
    coordinatorRef.current?.setModalOpen(isModalOpen);
  }, [isModalOpen]);

  useEffect(() => {
    // Update offset for keyboard navigation
    if (handlersRef.current) {
      handlersRef.current.cleanup();
      handlersRef.current = coordinatorRef.current?.setupEventListeners(offset) || null;
    }
  }, [offset]);
};
