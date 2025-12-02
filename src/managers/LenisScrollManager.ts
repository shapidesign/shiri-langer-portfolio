import Lenis from 'lenis';

/**
 * LenisScrollManager - Manages smooth scrolling with Lenis
 * Integrates with existing drag system and respects prefers-reduced-motion
 */
export class LenisScrollManager {
  private lenis: Lenis | null = null;
  private rafId: number = 0;
  private prefersReducedMotion: boolean = false;
  private isEnabled: boolean = true;

  constructor() {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = mediaQuery.matches;
    
    // Listen for changes
    mediaQuery.addEventListener('change', (e) => {
      this.prefersReducedMotion = e.matches;
      if (this.lenis) {
        this.lenis.options.duration = this.prefersReducedMotion ? 0 : 1.2;
      }
    });
  }

  /**
   * Initialize Lenis with smooth scrolling
   * Note: Lenis works on the window scroll by default
   */
  public initialize(): void {
    if (this.lenis) {
      this.destroy();
    }

    const options = {
      duration: this.prefersReducedMotion ? 0 : 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical' as const,
      gestureOrientation: 'vertical' as const,
      smoothWheel: !this.prefersReducedMotion,
      wheelMultiplier: 0.8, // Reduced for smoother control
      smoothTouch: !this.prefersReducedMotion,
      touchMultiplier: 1.2, // Reduced to prevent glitchy fast scrolling
      infinite: false,
    };

    // Initialize Lenis on window (default behavior)
    this.lenis = new Lenis(options);

    // Start the animation loop
    this.start();
  }

  /**
   * Start the requestAnimationFrame loop
   */
  private start(): void {
    if (!this.lenis) return;

    const raf = (time: number) => {
      if (this.isEnabled && this.lenis) {
        this.lenis.raf(time);
      }
      this.rafId = requestAnimationFrame(raf);
    };

    this.rafId = requestAnimationFrame(raf);
  }

  /**
   * Stop the animation loop
   */
  private stop(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  /**
   * Scroll to a position
   */
  public scrollTo(target: number | string | HTMLElement, options?: { offset?: number; immediate?: boolean }): void {
    if (!this.lenis) return;
    
    if (options?.immediate || this.prefersReducedMotion) {
      this.lenis.scrollTo(target, { immediate: true });
    } else {
      this.lenis.scrollTo(target, options);
    }
  }

  /**
   * Get current scroll position
   */
  public getScroll(): number {
    return this.lenis?.scroll || 0;
  }

  /**
   * Enable or disable scrolling
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (this.lenis) {
      if (enabled) {
        this.lenis.start();
      } else {
        this.lenis.stop();
      }
    }
  }

  /**
   * Update Lenis options
   */
  public updateOptions(options: Partial<Lenis['options']>): void {
    if (!this.lenis) return;
    Object.assign(this.lenis.options, options);
  }

  /**
   * Get Lenis instance (for advanced usage)
   */
  public getLenis(): Lenis | null {
    return this.lenis;
  }

  /**
   * Cleanup and destroy
   */
  public destroy(): void {
    this.stop();
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
  }
}
