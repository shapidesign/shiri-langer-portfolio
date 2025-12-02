import { gsap } from 'gsap';
import { SpotlightPosition, SpotlightConfig, SpotlightHandlers } from '../types/Spotlight';

/**
 * SpotlightManager - Handles spotlight effect for portfolio grid
 * Single responsibility: Manage spotlight positioning and animations
 */
export class SpotlightManager {
  private setX: ((value: number) => void) | null;
  private setY: ((value: number) => void) | null;
  private pos: SpotlightPosition;
  private config: SpotlightConfig;

  constructor() {
    this.setX = null;
    this.setY = null;
    this.pos = { x: 0, y: 0 };
    
    this.config = {
      duration: 0.15,
      ease: 'power2.out',
      overlayOpacity: 1,
      fadeOpacity: 1
    };
  }

  /**
   * Initialize spotlight with overlay element
   */
  public initialize(overlayElement: HTMLDivElement | null): void {
    if (!overlayElement) return;
    
    this.setX = gsap.quickSetter(overlayElement, '--x', 'px') as (value: number) => void;
    this.setY = gsap.quickSetter(overlayElement, '--y', 'px') as (value: number) => void;
    
    const { width, height } = overlayElement.getBoundingClientRect();
    this.pos = { x: width / 2, y: height / 2 };
    
    this.setX?.(this.pos.x);
    this.setY?.(this.pos.y);
  }

  /**
   * Move spotlight to new position with smooth animation
   */
  private moveTo(x: number, y: number): void {
    gsap.to(this.pos, {
      x,
      y,
      duration: this.config.duration,
      ease: this.config.ease,
      onUpdate: () => {
        if (this.setX && this.setY) {
          this.setX(this.pos.x);
          this.setY(this.pos.y);
        }
      },
      overwrite: true
    });
  }

  /**
   * Handle spotlight movement
   */
  private handleSpotlightMove = (e: React.PointerEvent, containerRef: React.RefObject<HTMLDivElement | null>, fadeRef: React.RefObject<HTMLDivElement | null>): void => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    
    // Get precise cursor position relative to the container
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    
    // Update spotlight position immediately for responsive tracking
    this.moveTo(x, y);
    if (fadeRef.current) {
      gsap.to(fadeRef.current, { opacity: 0, duration: 0.2, overwrite: true });
    }
  };

  /**
   * Handle spotlight leave
   */
  private handleSpotlightLeave = (fadeRef: React.RefObject<HTMLDivElement | null>): void => {
    if (fadeRef.current) {
      gsap.to(fadeRef.current, {
        opacity: this.config.fadeOpacity,
        duration: 0.6,
        overwrite: true
      });
    }
  };

  /**
   * Get spotlight handlers for React component
   */
  public getHandlers(
    containerRef: React.RefObject<HTMLDivElement | null>,
    fadeRef: React.RefObject<HTMLDivElement | null>
  ): SpotlightHandlers {
    return {
      onPointerMove: (e: React.PointerEvent) => this.handleSpotlightMove(e, containerRef, fadeRef),
      onPointerLeave: () => this.handleSpotlightLeave(fadeRef)
    };
  }
}

