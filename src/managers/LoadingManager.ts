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
   * Uses gallery arrays from PROJECT_TEXTS as single source of truth
   */
  private preloadImages(): void {
    // Use dynamic import to avoid circular dependencies
    Promise.all([
      import('../config/projectTexts'),
      import('../utils/imagePathUtils')
    ]).then(([{ PROJECT_TEXTS }, { getDisplayImage }]) => {
      // Get display images from each project's gallery
      const imageUrls: string[] = [];
      
      PROJECT_TEXTS.forEach(project => {
        if (project.id !== 17 && project.gallery && project.gallery.length > 0) {
          const displayImage = getDisplayImage(project.gallery);
          if (displayImage && !imageUrls.includes(displayImage)) {
            imageUrls.push(displayImage);
          }
        }
      });

      let loadedCount = 0;
      const totalImages = imageUrls.length;

      if (totalImages === 0) {
        // If no images to load, mark as loaded immediately
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
        img.onerror = checkImagesLoaded; // Count as loaded even if error (don't block)
        img.src = url;
      });
    }).catch(() => {
      // If imports fail, mark as loaded to not block the app
      this.markLoaded('images');
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
