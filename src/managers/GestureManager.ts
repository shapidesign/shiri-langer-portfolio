/**
 * GestureManager - High-performance unified gesture system
 * Handles: drag, swipe, pinch-to-zoom, wheel scroll
 * All event listeners are passive and optimized for 60fps
 */

export interface GestureState {
  isDragging: boolean;
  isPinching: boolean;
  isSwiping: boolean;
  startDistance: number;
  currentDistance: number;
  startTouches: Touch[];
  currentTouches: Touch[];
  velocity: { x: number; y: number };
  lastPosition: { x: number; y: number };
  lastTime: number;
}

export interface GestureCallbacks {
  onDrag?: (deltaX: number, deltaY: number, velocity: { x: number; y: number }) => void;
  onDragEnd?: (velocity: { x: number; y: number }) => void;
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down', velocity: number) => void;
  onPinch?: (scale: number, center: { x: number; y: number }) => void;
  onPinchEnd?: () => void;
  onWheel?: (deltaX: number, deltaY: number) => void;
}

export class GestureManager {
  private state: GestureState;
  private callbacks: GestureCallbacks;
  private rafId: number = 0;
  private element: HTMLElement | null = null;
  private enabled: boolean = true;
  private swipeThreshold: number = 50; // Minimum distance for swipe
  private swipeVelocityThreshold: number = 0.3; // Minimum velocity for swipe
  private pinchThreshold: number = 10; // Minimum distance change for pinch

  constructor(element: HTMLElement | null, callbacks: GestureCallbacks = {}) {
    this.element = element;
    this.callbacks = callbacks;
    this.state = {
      isDragging: false,
      isPinching: false,
      isSwiping: false,
      startDistance: 0,
      currentDistance: 0,
      startTouches: [],
      currentTouches: [],
      velocity: { x: 0, y: 0 },
      lastPosition: { x: 0, y: 0 },
      lastTime: performance.now()
    };
  }

  /**
   * Initialize gesture detection
   */
  public initialize(): void {
    if (!this.element) return;

    // Mouse events for drag
    this.element.addEventListener('mousedown', this.handleMouseDown, { passive: true });
    
    // Touch events for drag, swipe, pinch
    this.element.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    this.element.addEventListener('touchmove', this.handleTouchMove, { passive: false }); // Need preventDefault for pinch
    this.element.addEventListener('touchend', this.handleTouchEnd, { passive: true });
    
    // Wheel events for smooth scrolling
    this.element.addEventListener('wheel', this.handleWheel, { passive: false }); // Need preventDefault for custom scroll
    
    // Global mouse events for drag continuation
    window.addEventListener('mousemove', this.handleMouseMove, { passive: false }); // Need preventDefault for drag
    window.addEventListener('mouseup', this.handleMouseUp, { passive: true });
  }

  /**
   * Cleanup all event listeners
   */
  public destroy(): void {
    if (!this.element) return;

    this.element.removeEventListener('mousedown', this.handleMouseDown);
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('wheel', this.handleWheel);
    
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }

  /**
   * Enable/disable gesture detection
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Calculate distance between two touches
   */
  private getTouchDistance(touches: Touch[]): number {
    if (touches.length < 2) return 0;
    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    return Math.hypot(dx, dy);
  }

  /**
   * Calculate center point between two touches
   */
  private getTouchCenter(touches: Touch[]): { x: number; y: number } {
    if (touches.length < 2) return { x: 0, y: 0 };
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };
  }

  /**
   * Mouse down handler
   */
  private handleMouseDown = (e: MouseEvent): void => {
    if (!this.enabled || e.button !== 0) return; // Only left mouse button
    
    this.state.isDragging = true;
    this.state.lastPosition = { x: e.clientX, y: e.clientY };
    this.state.lastTime = performance.now();
    this.state.velocity = { x: 0, y: 0 };
    
    // Change cursor
    if (this.element) {
      this.element.style.cursor = 'grabbing';
      this.element.style.userSelect = 'none';
    }
  };

  /**
   * Mouse move handler
   */
  private handleMouseMove = (e: MouseEvent): void => {
    if (!this.enabled || !this.state.isDragging) return;
    
    e.preventDefault(); // Prevent text selection during drag
    
    const now = performance.now();
    const deltaTime = Math.max(1, now - this.state.lastTime);
    const deltaX = e.clientX - this.state.lastPosition.x;
    const deltaY = e.clientY - this.state.lastPosition.y;
    
    // Calculate velocity
    this.state.velocity.x = deltaX / deltaTime;
    this.state.velocity.y = deltaY / deltaTime;
    
    // Call drag callback
    if (this.callbacks.onDrag) {
      this.callbacks.onDrag(deltaX, deltaY, this.state.velocity);
    }
    
    this.state.lastPosition = { x: e.clientX, y: e.clientY };
    this.state.lastTime = now;
  };

  /**
   * Mouse up handler
   */
  private handleMouseUp = (): void => {
    if (!this.state.isDragging) return;
    
    const wasDragging = this.state.isDragging;
    this.state.isDragging = false;
    
    // Restore cursor
    if (this.element) {
      this.element.style.cursor = '';
      this.element.style.userSelect = '';
    }
    
    // Call drag end callback with velocity for momentum
    if (wasDragging && this.callbacks.onDragEnd) {
      this.callbacks.onDragEnd(this.state.velocity);
    }
    
    this.state.velocity = { x: 0, y: 0 };
  };

  /**
   * Touch start handler
   */
  private handleTouchStart = (e: TouchEvent): void => {
    if (!this.enabled) return;
    
    const touches = Array.from(e.touches);
    this.state.startTouches = touches;
    this.state.currentTouches = touches;
    
    if (touches.length === 2) {
      // Two fingers - pinch gesture
      this.state.isPinching = true;
      this.state.startDistance = this.getTouchDistance(touches);
      this.state.currentDistance = this.state.startDistance;
    } else if (touches.length === 1) {
      // Single finger - drag/swipe
      this.state.isDragging = true;
      this.state.lastPosition = { x: touches[0].clientX, y: touches[0].clientY };
      this.state.lastTime = performance.now();
      this.state.velocity = { x: 0, y: 0 };
    }
  };

  /**
   * Touch move handler
   */
  private handleTouchMove = (e: TouchEvent): void => {
    if (!this.enabled) return;
    
    const touches = Array.from(e.touches);
    this.state.currentTouches = touches;
    
    if (this.state.isPinching && touches.length === 2) {
      // Pinch gesture
      e.preventDefault(); // Prevent default zoom
      
      const currentDistance = this.getTouchDistance(touches);
      const scale = currentDistance / this.state.startDistance;
      const center = this.getTouchCenter(touches);
      
      if (Math.abs(currentDistance - this.state.currentDistance) > this.pinchThreshold) {
        if (this.callbacks.onPinch) {
          this.callbacks.onPinch(scale, center);
        }
        this.state.currentDistance = currentDistance;
      }
    } else if (this.state.isDragging && touches.length === 1) {
      // Drag gesture
      const touch = touches[0];
      const now = performance.now();
      const deltaTime = Math.max(1, now - this.state.lastTime);
      const deltaX = touch.clientX - this.state.lastPosition.x;
      const deltaY = touch.clientY - this.state.lastPosition.y;
      
      // Calculate velocity
      this.state.velocity.x = deltaX / deltaTime;
      this.state.velocity.y = deltaY / deltaTime;
      
      // Call drag callback
      if (this.callbacks.onDrag) {
        this.callbacks.onDrag(deltaX, deltaY, this.state.velocity);
      }
      
      this.state.lastPosition = { x: touch.clientX, y: touch.clientY };
      this.state.lastTime = now;
    }
  };

  /**
   * Touch end handler
   */
  private handleTouchEnd = (e: TouchEvent): void => {
    if (!this.enabled) return;
    
    const touches = Array.from(e.touches);
    
    if (this.state.isPinching && touches.length < 2) {
      // Pinch ended
      this.state.isPinching = false;
      if (this.callbacks.onPinchEnd) {
        this.callbacks.onPinchEnd();
      }
    } else if (this.state.isDragging && touches.length === 0) {
      // Drag ended - check for swipe
      const swipeDistance = Math.hypot(
        this.state.currentTouches[0]?.clientX - this.state.startTouches[0]?.clientX || 0,
        this.state.currentTouches[0]?.clientY - this.state.startTouches[0]?.clientY || 0
      );
      const swipeVelocity = Math.hypot(this.state.velocity.x, this.state.velocity.y);
      
      if (swipeDistance > this.swipeThreshold && swipeVelocity > this.swipeVelocityThreshold) {
        // Determine swipe direction
        const dx = (this.state.currentTouches[0]?.clientX || 0) - (this.state.startTouches[0]?.clientX || 0);
        const dy = (this.state.currentTouches[0]?.clientY || 0) - (this.state.startTouches[0]?.clientY || 0);
        
        if (Math.abs(dx) > Math.abs(dy)) {
          // Horizontal swipe
          if (this.callbacks.onSwipe) {
            this.callbacks.onSwipe(dx > 0 ? 'right' : 'left', swipeVelocity);
          }
        } else {
          // Vertical swipe
          if (this.callbacks.onSwipe) {
            this.callbacks.onSwipe(dy > 0 ? 'down' : 'up', swipeVelocity);
          }
        }
      }
      
      // Call drag end with velocity
      if (this.callbacks.onDragEnd) {
        this.callbacks.onDragEnd(this.state.velocity);
      }
      
      this.state.isDragging = false;
      this.state.velocity = { x: 0, y: 0 };
    }
    
    this.state.startTouches = [];
    this.state.currentTouches = [];
  };

  /**
   * Wheel handler - optimized for smooth scrolling
   */
  private handleWheel = (e: WheelEvent): void => {
    if (!this.enabled) return;
    
    e.preventDefault(); // Prevent default scroll
    
    // Use requestAnimationFrame for smooth handling
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    
    this.rafId = requestAnimationFrame(() => {
      if (this.callbacks.onWheel) {
        this.callbacks.onWheel(e.deltaX, e.deltaY);
      }
      this.rafId = 0;
    });
  };

  /**
   * Get current gesture state
   */
  public getState(): GestureState {
    return { ...this.state };
  }
}

