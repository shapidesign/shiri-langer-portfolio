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
    // Mark fonts as loaded (they're already loaded via CSS)
    setTimeout(() => this.markLoaded('fonts'), 50);

    // Mark effects as loaded (they're CSS-based)
    setTimeout(() => this.markLoaded('effects'), 100);

    // Mark animations as loaded (they're CSS-based)
    setTimeout(() => this.markLoaded('animations'), 150);

    // Mark components as loaded (React components are ready)
    setTimeout(() => this.markLoaded('components'), 200);

    // Mark drag as loaded (drag functionality is ready with components)
    setTimeout(() => this.markLoaded('drag'), 250);

    // Preload first few project images for instant loading experience
    this.preloadInitialImages();
  }

  /**
   * Preload first few project images for immediate availability
   */
  private preloadInitialImages(): void {
    // Use dynamic import to avoid circular dependencies
    Promise.all([
      import('../config/projectTexts'),
      import('../utils/imagePathUtils')
    ]).then(([{ PROJECT_TEXTS }, { getDisplayImage }]) => {
      // Preload only the first 4-6 projects that are most likely to be seen first
      const preloadCount = 6;
      const preloadUrls: string[] = [];

      for (let i = 0; i < Math.min(preloadCount, PROJECT_TEXTS.length); i++) {
        const project = PROJECT_TEXTS[i];
        if (project && project.gallery && project.gallery.length > 0) {
          const displayImage = getDisplayImage(project.gallery);
          if (displayImage && !preloadUrls.includes(displayImage)) {
            preloadUrls.push(displayImage);
          }
        }
      }

      // Preload these images in parallel
      preloadUrls.forEach(url => {
        const img = new Image();
        img.src = url;
        // Let them load in background, no need to track completion
      });
    }).catch(() => {
      // Silently fail if imports fail - not critical for UX
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
