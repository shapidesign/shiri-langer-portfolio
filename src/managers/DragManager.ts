import { DragState, Velocity, DragOffset, DragConfig, DragHandlers } from '../types/Drag';

/**
 * DragManager - Handles drag and inertia physics for portfolio grid
 * Single responsibility: Manage drag interactions and momentum
 */
export class DragManager {
  private state: DragState;
  private vel: Velocity;
  private raf: number;
  private isMobile: boolean;
  private config: DragConfig;

  constructor() {
    this.state = {
      dragging: false,
      x: 0,
      y: 0,
      t: 0,
      lastX: 0,
      lastY: 0,
      lastT: 0
    };
    
    this.vel = { x: 0, y: 0 };
    this.raf = 0;
    this.isMobile = false;
    
    this.config = {
      friction: 0.97, // Slightly less friction for smoother momentum
      minSpeed: 0.15, // Lower minimum speed for longer coasting
      maxVelocity: 15, // Higher max velocity for more responsive feel
      resistance: 1.0
    };
  }

  /**
   * Initialize mobile detection
   */
  public initialize(): void {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   ('ontouchstart' in window) || 
                   (navigator.maxTouchPoints > 0);
    
    // Adjust config for mobile
    if (this.isMobile) {
      this.config = {
        friction: 0.94, // Improved mobile friction
        minSpeed: 0.08, // Lower minimum speed for mobile
        maxVelocity: 10, // Higher max velocity for mobile
        resistance: 0.85 // Slightly more resistance for mobile
      };
    }
  }

  /**
   * Stop animation frame
   */
  private stopRaf(): void {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  }

  /**
   * Handle pointer down event
   */
  private handlePointerDown = (e: React.PointerEvent, setOffset: React.Dispatch<React.SetStateAction<DragOffset>>): void => {
    // Always start drag tracking - tiles will prevent modal opening if it was a click
    // This allows immediate drag responsiveness
    const target = e.target as HTMLElement;
    const tile = target.closest('.project-tile');
    
    // Capture pointer on the container (not the tile)
    const container = e.currentTarget as HTMLElement;
    container.setPointerCapture?.(e.pointerId);
    this.stopRaf();
    
    this.state.dragging = true;
    this.state.x = e.clientX;
    this.state.y = e.clientY;
    this.state.t = performance.now();
    this.state.lastX = e.clientX;
    this.state.lastY = e.clientY;
    this.state.lastT = performance.now();
    this.vel = { x: 0, y: 0 };
    
    // Update cursor immediately
    if (container) {
      container.style.cursor = 'grabbing';
    }
  };

  /**
   * Handle pointer move event
   */
  private handlePointerMove = (e: React.PointerEvent, setOffset: React.Dispatch<React.SetStateAction<DragOffset>>): void => {
    if (!this.state.dragging) {
      // Check if we should start dragging (pointer was captured but dragging wasn't set)
      // This handles the case where pointer down was on a tile but moved enough to become a drag
      const target = e.target as HTMLElement;
      if (target.closest('.project-tile')) {
        // Check if pointer was captured - if so, we might need to start dragging
        // This is handled by the tile releasing capture and letting parent handle it
        return;
      }
      return;
    }
    
    const now = performance.now();
    const dt = Math.max(1, now - this.state.t);
    const dx = e.clientX - this.state.x;
    const dy = e.clientY - this.state.y;
    
    // Calculate velocity with better smoothing
    const velDt = Math.max(1, now - this.state.lastT);
    const velDx = e.clientX - this.state.lastX;
    const velDy = e.clientY - this.state.lastY;
    
    // Enhanced velocity calculation with smoothing
    const velocityMultiplier = this.isMobile ? 14 : 18; // Increased for more responsive feel
    this.vel.x = (velDx / velDt) * velocityMultiplier;
    this.vel.y = (velDy / velDt) * velocityMultiplier;
    
    // Apply resistance for smoother feel
    setOffset((o) => ({ 
      x: o.x + (dx * this.config.resistance), 
      y: o.y + (dy * this.config.resistance) 
    }));
    
    this.state.x = e.clientX;
    this.state.y = e.clientY;
    this.state.t = now;
    this.state.lastX = e.clientX;
    this.state.lastY = e.clientY;
    this.state.lastT = now;
  };

  /**
   * Handle pointer up event
   */
  private handlePointerUp = (e: React.PointerEvent, setOffset: React.Dispatch<React.SetStateAction<DragOffset>>): void => {
    const container = e.currentTarget as HTMLElement;
    container.releasePointerCapture?.(e.pointerId);
    this.state.dragging = false;
    
    // Reset cursor
    if (container) {
      container.style.cursor = 'grab';
    }
    
    // Cap maximum velocity for smoother experience
    this.vel.x = Math.max(-this.config.maxVelocity, Math.min(this.config.maxVelocity, this.vel.x));
    this.vel.y = Math.max(-this.config.maxVelocity, Math.min(this.config.maxVelocity, this.vel.y));
    
    const step = () => {
      this.vel.x *= this.config.friction;
      this.vel.y *= this.config.friction;
      setOffset((o) => ({ x: o.x + this.vel.x, y: o.y + this.vel.y }));
      
      if (Math.hypot(this.vel.x, this.vel.y) > this.config.minSpeed) {
        this.raf = requestAnimationFrame(step);
      } else {
        this.stopRaf();
      }
    };
    
    this.stopRaf();
    this.raf = requestAnimationFrame(step);
  };

  /**
   * Get drag handlers for React component
   */
  public getHandlers(setOffset: React.Dispatch<React.SetStateAction<DragOffset>>): DragHandlers {
    return {
      onPointerDown: (e: React.PointerEvent) => this.handlePointerDown(e, setOffset),
      onPointerMove: (e: React.PointerEvent) => this.handlePointerMove(e, setOffset),
      onPointerUp: (e: React.PointerEvent) => this.handlePointerUp(e, setOffset)
    };
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    this.stopRaf();
  }
}

