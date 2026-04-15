import { useRef, useEffect, useCallback } from 'react';
import { DragManager } from '../managers/DragManager';
import { DragOffset } from '../types/Drag';
import { LoadingManager } from '../managers/LoadingManager';

/**
 * Hook for using DragManager.
 * Accepts an external setOffset so drag/inertia can update position refs directly
 * without going through React state — keeping animation off the React render path.
 */
export const useDragInertia = (
  setOffset: React.Dispatch<React.SetStateAction<DragOffset>>
) => {
  const dragManagerRef = useRef<DragManager | null>(null);

  useEffect(() => {
    dragManagerRef.current = new DragManager();
    dragManagerRef.current.initialize();

    const loadingManager = LoadingManager.getInstance();
    setTimeout(() => {
      loadingManager.markLoaded('drag');
    }, 100);

    return () => {
      dragManagerRef.current?.cleanup();
    };
  }, []);

  const handlers = dragManagerRef.current?.getHandlers(setOffset) ?? {
    onPointerDown: () => {},
    onPointerMove: () => {},
    onPointerUp: () => {},
  };

  const isDragging = useCallback(() => {
    return dragManagerRef.current?.isDragging() ?? false;
  }, []);

  return { ...handlers, isDragging };
};
