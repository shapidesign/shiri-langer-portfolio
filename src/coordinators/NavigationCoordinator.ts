import { NavigationConfig, NavigationState, NavigationHandlers } from '../types/Navigation';

/**
 * NavigationCoordinator - Handles keyboard navigation and gesture prevention
 * Single responsibility: Manage navigation controls and prevent unwanted gestures
 */
export class NavigationCoordinator {
  private config: NavigationConfig;
  private setOffset: (offset: { x: number; y: number }) => void;
  private isModalOpen: boolean;

  constructor(
    setOffset: (offset: { x: number; y: number }) => void,
    config?: Partial<NavigationConfig>
  ) {
    this.setOffset = setOffset;
    this.isModalOpen = false;
    
    this.config = {
      stepSize: 100,
      shiftStepSize: 200,
      animationDuration: 300,
      ...config
    };
  }

  /**
   * Set modal open state
   */
  public setModalOpen(isOpen: boolean): void {
    this.isModalOpen = isOpen;
  }

  /**
   * Handle keyboard navigation
   */
  private handleKeyDown = (e: KeyboardEvent, currentOffset: { x: number; y: number }): void => {
    // Don't handle keyboard navigation when modal is open
    if (this.isModalOpen) return;
    
    const STEP = e.shiftKey ? this.config.shiftStepSize : this.config.stepSize;
    
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      
      // Natural directions: Arrow keys move the viewport in that direction
      // Since offset is inverted (camX = -offset.x), we need to think about it carefully:
      // - ArrowRight: move viewport right → show content on left → increase offset.x ✓
      // - ArrowLeft: move viewport left → show content on right → decrease offset.x ✓
      // - ArrowDown: move viewport down → show content above → increase offset.y ✓
      // - ArrowUp: move viewport up → show content below → decrease offset.y ✓
      const dx = e.key === 'ArrowLeft' ? -STEP : e.key === 'ArrowRight' ? STEP : 0;
      const dy = e.key === 'ArrowUp' ? -STEP : e.key === 'ArrowDown' ? STEP : 0;
      
      // Smooth keyboard navigation with easing
      this.animateToPosition(currentOffset, { x: currentOffset.x + dx, y: currentOffset.y + dy });
    }
  };

  /**
   * Animate to new position with easing
   */
  private animateToPosition(
    startOffset: { x: number; y: number },
    targetOffset: { x: number; y: number }
  ): void {
    const duration = this.config.animationDuration;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      this.setOffset({
        x: startOffset.x + (targetOffset.x - startOffset.x) * easeOut,
        y: startOffset.y + (targetOffset.y - startOffset.y) * easeOut
      });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  /**
   * Prevent swipe gestures
   */
  private preventSwipeGestures = (e: Event): void => {
    if (e.type === 'wheel') {
      const wheelEvent = e as WheelEvent;
      // Allow vertical scrolling but prevent horizontal swipes that might trigger navigation
      if (Math.abs(wheelEvent.deltaX) > Math.abs(wheelEvent.deltaY)) {
        e.preventDefault();
      }
    }
  };

  /**
   * Prevent popstate events from swipe gestures
   */
  private preventPopstate = (e: PopStateEvent): void => {
    e.preventDefault();
  };

  /**
   * Prevent all gestures
   */
  private preventAllGestures = (e: Event): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * Setup event listeners
   */
  public setupEventListeners(currentOffset: { x: number; y: number }): NavigationHandlers {
    const keyHandler = (e: KeyboardEvent) => this.handleKeyDown(e, currentOffset);
    
    // Add event listeners
    window.addEventListener('keydown', keyHandler as any);
    window.addEventListener('wheel', this.preventSwipeGestures, { passive: false });
    window.addEventListener('popstate', this.preventPopstate);
    
    // Disable browser swipe gestures on the document and body
    document.addEventListener('gesturestart', this.preventAllGestures, { passive: false });
    document.addEventListener('gesturechange', this.preventAllGestures, { passive: false });
    document.addEventListener('gestureend', this.preventAllGestures, { passive: false });
    
    // Additional gesture prevention
    document.addEventListener('touchstart', this.preventAllGestures, { passive: false });
    document.addEventListener('touchmove', this.preventAllGestures, { passive: false });
    document.addEventListener('touchend', this.preventAllGestures, { passive: false });
    
    // Prevent context menu on right click
    document.addEventListener('contextmenu', this.preventAllGestures);

    // Return cleanup function
    return {
      onKeyDown: keyHandler,
      cleanup: () => {
        window.removeEventListener('keydown', keyHandler as any);
        window.removeEventListener('wheel', this.preventSwipeGestures);
        window.removeEventListener('popstate', this.preventPopstate);
        document.removeEventListener('gesturestart', this.preventAllGestures);
        document.removeEventListener('gesturechange', this.preventAllGestures);
        document.removeEventListener('gestureend', this.preventAllGestures);
        document.removeEventListener('touchstart', this.preventAllGestures);
        document.removeEventListener('touchmove', this.preventAllGestures);
        document.removeEventListener('touchend', this.preventAllGestures);
        document.removeEventListener('contextmenu', this.preventAllGestures);
      }
    };
  }
}
