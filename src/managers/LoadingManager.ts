/**
 * LoadingManager - Handles all loading states and asset preloading
 */
export class LoadingManager {
  private static instance: LoadingManager;
  private loadingStates: Map<string, boolean> = new Map();
  private callbacks: Set<() => void> = new Set();
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): LoadingManager {
    if (!LoadingManager.instance) {
      LoadingManager.instance = new LoadingManager();
    }
    return LoadingManager.instance;
  }

  /**
   * Initialize loading manager
   */
  public initialize(): void {
    if (this.isInitialized) return;
    
    this.isInitialized = true;
    this.preloadAssets();
    
    // Safety timeout: force complete after 3 seconds max
    setTimeout(() => {
      if (!this.isAllLoaded()) {
        console.warn('Loading timeout - forcing completion');
        // Mark all required states as loaded
        ['fonts', 'effects', 'animations', 'components', 'drag'].forEach(state => {
          if (!this.loadingStates.get(state)) {
            this.loadingStates.set(state, true);
          }
        });
        this.checkAllLoaded();
      }
    }, 3000);
  }

  /**
   * Mark a loading state as complete
   */
  public markLoaded(key: string): void {
    this.loadingStates.set(key, true);
    this.checkAllLoaded();
  }

  /**
   * Check if all loading states are complete
   */
  public isAllLoaded(): boolean {
    const requiredStates = [
      'fonts',
      'effects',
      'animations',
      'components',
      'drag'
    ];

    return requiredStates.every(state => this.loadingStates.get(state) === true);
  }

  /**
   * Add callback for when loading is complete
   */
  public onLoadingComplete(callback: () => void): void {
    this.callbacks.add(callback);
    
    // If already loaded, call immediately
    if (this.isAllLoaded()) {
      callback();
    }
  }

  /**
   * Remove callback
   */
  public removeCallback(callback: () => void): void {
    this.callbacks.delete(callback);
  }

  /**
   * Check if all states are loaded and notify callbacks
   */
  private checkAllLoaded(): void {
    if (this.isAllLoaded()) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        this.callbacks.forEach(callback => callback());
      }, 100);
    }
  }

  /**
   * Preload critical assets
   */
  private preloadAssets(): void {
    // On mobile, use shorter timeouts for faster initial load
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const multiplier = isMobile ? 0.5 : 1;

    // Mark fonts as loaded (they're already loaded via CSS)
    setTimeout(() => this.markLoaded('fonts'), 50 * multiplier);

    // Mark effects as loaded (they're CSS-based)
    setTimeout(() => this.markLoaded('effects'), 100 * multiplier);

    // Mark animations as loaded (they're CSS-based)
    setTimeout(() => this.markLoaded('animations'), 150 * multiplier);

    // Mark components as loaded (React components are ready)
    setTimeout(() => this.markLoaded('components'), 200 * multiplier);

    // Mark drag as loaded (drag functionality is ready with components)
    setTimeout(() => this.markLoaded('drag'), 250 * multiplier);

    // Preload first few project images for instant loading experience (only on desktop)
    if (!isMobile) {
      this.preloadInitialImages();
    }
  }

  /**
   * Preload first few project images for immediate availability
   */
  private preloadInitialImages(): void {
    // Hero preloading runs from PortfolioDataProvider once carousel order is known.
  }

  /**
   * Preload hero / gallery still images for the first carousel slice.
   */
  public preloadProjectHeroUrls(urls: string[]): void {
    urls.forEach((url) => {
      if (!url) return;
      const lower = url.toLowerCase();
      if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov')) return;
      const img = new Image();
      img.src = url;
    });
  }


  /**
   * Get loading progress (0-100)
   */
  public getProgress(): number {
    const requiredStates = [
      'fonts',
      'effects',
      'animations',
      'components',
      'drag'
    ];
    
    const loadedCount = requiredStates.filter(state => 
      this.loadingStates.get(state) === true
    ).length;
    
    return Math.round((loadedCount / requiredStates.length) * 100);
  }
}
