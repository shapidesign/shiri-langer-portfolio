/**
 * Image Path Utilities
 * Provides robust image path handling with validation and fallbacks
 */

/**
 * Normalize image path - ensures it starts with /assets/images/
 * Never double-prefixes paths that already have /assets/images/
 */
export function normalizeImagePath(path: string): string {
  if (!path) {
    return '/assets/images/default.jpg';
  }

  // Remove any leading/trailing whitespace
  const trimmed = path.trim();
  
  // If path already starts with /assets/images/, return as is (no modification)
  if (trimmed.startsWith('/assets/images/')) {
    return trimmed;
  }

  // If path is absolute but not /assets/images/, keep as is
  // (might be external URL or other absolute path)
  if (trimmed.startsWith('/')) {
    // For absolute paths not starting with /assets/images/, 
    // assume they're meant to be in /assets/images/
    return `/assets/images${trimmed}`;
  }

  // If relative path, add /assets/images/ prefix
  return `/assets/images/${trimmed}`;
}

/**
 * Get display image from gallery array with fallback
 * Prefers .webp images for better performance, falls back to first image
 */
export function getDisplayImage(gallery: string[]): string {
  if (!gallery || gallery.length === 0) {
    return '/assets/images/default.jpg';
  }

  // Prefer .webp images for display (better performance)
  const webpImage = gallery.find(img => img.toLowerCase().endsWith('.webp'));
  
  // Use first .webp if available, otherwise use first image
  const primaryImage = webpImage || gallery[0];
  
  // Return normalized path - ensure it has correct prefix
  return normalizeImagePath(primaryImage);
}

/**
 * Get fallback image from gallery (second image if first fails)
 */
export function getFallbackImage(gallery: string[]): string | null {
  if (!gallery || gallery.length < 2) {
    return null;
  }

  return normalizeImagePath(gallery[1]);
}

/**
 * Validate that image path follows expected format
 */
export function isValidImagePath(path: string): boolean {
  if (!path) return false;
  
  // Must start with /assets/images/
  if (!path.startsWith('/assets/images/')) {
    return false;
  }

  // Must have a valid extension
  const validExtensions = ['.webp', '.jpg', '.jpeg', '.png', '.gif'];
  const hasValidExtension = validExtensions.some(ext => 
    path.toLowerCase().endsWith(ext)
  );

  return hasValidExtension;
}

