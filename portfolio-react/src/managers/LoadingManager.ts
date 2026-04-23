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

    // Fallback: Mark drag as loaded after a delay
    // This will be overridden by the actual hook if it's loaded
    setTimeout(() => {
      if (!this.loadingStates.get('drag')) {
        this.markLoaded('drag');
      }
    }, 500);
  }

  /**
   * Preload only critical images (background and first visible project thumbnails)
   */
  private preloadImages(): void {
    // Import both PROJECT_TEXTS and background config
    Promise.all([
      import('../config/projectTexts'),
      import('../config/backgroundConfig')
    ]).then(([{ PROJECT_TEXTS }, { getCurrentBackground }]) => {
      // Collect only critical image URLs
      const imageUrls = new Set<string>();
      
      // Add background image
      const backgroundConfig = getCurrentBackground();
      if (backgroundConfig.image) {
        imageUrls.add(backgroundConfig.image);
      }
      
      // Only preload first visible projects' thumbnails (first 6 for 2 rows of 3-4)
      PROJECT_TEXTS.slice(0, 6).forEach(project => {
        // Only add the first gallery image (thumbnail)
        if (project.gallery && project.gallery.length > 0) {
          imageUrls.add(project.gallery[0]);
        }
      });

      let loadedCount = 0;
      const totalImages = imageUrls.size;

      if (totalImages === 0) {
        this.markLoaded('images');
        return;
      }

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
      'spotlight',
      'drag'
    ];
    
    const loadedCount = requiredStates.filter(state => 
      this.loadingStates.get(state) === true
    ).length;
    
    return Math.round((loadedCount / requiredStates.length) * 100);
  }
}
