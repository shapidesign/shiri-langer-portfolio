import { NavigationConfig, NavigationHandlers } from '../types/Navigation';

/**
 * NavigationCoordinator - Handles keyboard navigation and gesture prevention.
 * Uses a getOffset getter so the key handler always reads the live position,
 * never a stale closure.
 */
export class NavigationCoordinator {
  private config: NavigationConfig;
  private setOffset: (offset: { x: number; y: number }) => void;
  private getOffset: () => { x: number; y: number };
  private isModalOpen: boolean;

  constructor(
    setOffset: (offset: { x: number; y: number }) => void,
    getOffset: () => { x: number; y: number },
    config?: Partial<NavigationConfig>
  ) {
    this.setOffset = setOffset;
    this.getOffset = getOffset;
    this.isModalOpen = false;

    this.config = {
      stepSize: 100,
      shiftStepSize: 200,
      animationDuration: 300,
      ...config,
    };
  }

  public setModalOpen(isOpen: boolean): void {
    this.isModalOpen = isOpen;
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (this.isModalOpen) return;

    const STEP = e.shiftKey ? this.config.shiftStepSize : this.config.stepSize;

    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();

      const currentOffset = this.getOffset();
      const dx = e.key === 'ArrowLeft' ? STEP : e.key === 'ArrowRight' ? -STEP : 0;
      const dy = e.key === 'ArrowUp' ? STEP : e.key === 'ArrowDown' ? -STEP : 0;

      this.animateToPosition(currentOffset, {
        x: currentOffset.x + dx,
        y: currentOffset.y + dy,
      });
    }
  };

  private animateToPosition(
    startOffset: { x: number; y: number },
    targetOffset: { x: number; y: number }
  ): void {
    const duration = this.config.animationDuration;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      this.setOffset({
        x: startOffset.x + (targetOffset.x - startOffset.x) * easeOut,
        y: startOffset.y + (targetOffset.y - startOffset.y) * easeOut,
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  private preventSwipeGestures = (e: Event): void => {
    if (this.isModalOpen) return;
    if (e.type === 'wheel') {
      const wheelEvent = e as WheelEvent;
      if (Math.abs(wheelEvent.deltaX) > Math.abs(wheelEvent.deltaY)) {
        e.preventDefault();
      }
    }
  };

  private preventPopstate = (e: PopStateEvent): void => {
    e.preventDefault();
  };

  private preventAllGestures = (e: Event): void => {
    if (this.isModalOpen) return;
    e.preventDefault();
    e.stopPropagation();
  };

  /** No currentOffset parameter needed — reads live via getOffset getter. */
  public setupEventListeners(): NavigationHandlers {
    const keyHandler = (e: KeyboardEvent) => this.handleKeyDown(e);

    window.addEventListener('keydown', keyHandler as any);
    window.addEventListener('wheel', this.preventSwipeGestures, { passive: false });
    window.addEventListener('popstate', this.preventPopstate);
    document.addEventListener('gesturestart', this.preventAllGestures, { passive: false });
    document.addEventListener('gesturechange', this.preventAllGestures, { passive: false });
    document.addEventListener('gestureend', this.preventAllGestures, { passive: false });

    return {
      onKeyDown: keyHandler,
      cleanup: () => {
        window.removeEventListener('keydown', keyHandler as any);
        window.removeEventListener('wheel', this.preventSwipeGestures);
        window.removeEventListener('popstate', this.preventPopstate);
        document.removeEventListener('gesturestart', this.preventAllGestures);
        document.removeEventListener('gesturechange', this.preventAllGestures);
        document.removeEventListener('gestureend', this.preventAllGestures);
      },
    };
  }
}
