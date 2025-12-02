import { useRef, useState, useEffect } from 'react';
import { DragManager } from '../managers/DragManager';
import { DragOffset } from '../types/Drag';
import { LoadingManager } from '../managers/LoadingManager';

/**
 * Hook for using DragManager
 */
export const useDragInertia = () => {
  const [offset, setOffset] = useState<DragOffset>({ x: 0, y: 0 });
  const dragManagerRef = useRef<DragManager | null>(null);

  useEffect(() => {
    dragManagerRef.current = new DragManager();
    dragManagerRef.current.initialize();
    
    // Mark drag manager as loaded
    const loadingManager = LoadingManager.getInstance();
    setTimeout(() => {
      loadingManager.markLoaded('drag');
    }, 100);

    return () => {
      dragManagerRef.current?.cleanup();
    };
  }, []);

  const handlers = dragManagerRef.current?.getHandlers(setOffset) || {
    onPointerDown: () => {},
    onPointerMove: () => {},
    onPointerUp: () => {}
  };

  return { offset, setOffset, ...handlers };
};
