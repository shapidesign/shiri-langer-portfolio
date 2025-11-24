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
      'images',
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
    setTimeout(() => this.markLoaded('fonts'), 100);

    // Preload images
    this.preloadImages();

    // Mark effects as loaded (they're CSS-based)
    setTimeout(() => this.markLoaded('effects'), 200);

    // Mark animations as loaded (they're CSS-based)
    setTimeout(() => this.markLoaded('animations'), 300);

    // Mark components as loaded (React components are ready)
    setTimeout(() => this.markLoaded('components'), 400);
  }

  /**
   * Preload project images
   */
  private preloadImages(): void {
    const imageUrls = [
      '/assets/images/alphabet2.png',
      '/assets/images/coffee-torn.png',
      '/assets/images/ksense.png',
      '/assets/images/shiri-paper.png'
    ];

    let loadedCount = 0;
    const totalImages = imageUrls.length;

    const checkImagesLoaded = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        this.markLoaded('images');
      }
    };

    imageUrls.forEach(url => {
      const img = new Image();
      img.onload = checkImagesLoaded;
      img.onerror = checkImagesLoaded; // Count as loaded even if error
      img.src = url;
    });
  }

  /**
   * Get loading progress (0-100)
   */
  public getProgress(): number {
    const requiredStates = [
      'fonts',
      'images', 
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
