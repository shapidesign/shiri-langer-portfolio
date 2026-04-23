/**
 * Utility to process HTML and add missing width/height attributes to images
 * This helps prevent CLS (Cumulative Layout Shift)
 */

/**
 * Process HTML string and add width/height to images that don't have them
 * Uses default dimensions if not specified
 */
export function processHTMLImages(
  html: string,
  defaultDimensions: { width?: number; height?: number } = {}
): string {
  if (!html) return html;

  // Create a temporary DOM element to parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const images = doc.querySelectorAll('img');

  images.forEach((img) => {
    // Add width if missing
    if (!img.hasAttribute('width') && defaultDimensions.width) {
      img.setAttribute('width', defaultDimensions.width.toString());
    }

    // Add height if missing
    if (!img.hasAttribute('height') && defaultDimensions.height) {
      img.setAttribute('height', defaultDimensions.height.toString());
    }

    // Add loading="lazy" if missing (for inline images)
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }

    // Add decoding="async"
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }
  });

  // Return processed HTML
  return doc.body.innerHTML;
}

/**
 * Get dimensions for a specific image path
 * This is a helper to determine appropriate dimensions
 */
export function getImageDimensions(imagePath: string): { width: number; height: number } {
  // Default dimensions based on image type/context
  const defaults: Record<string, { width: number; height: number }> = {
    'process-image-inline': { width: 200, height: 150 },
    'gallery': { width: 800, height: 600 },
    'thumbnail': { width: 80, height: 80 },
  };

  // Check if it's a process image (inline)
  if (imagePath.includes('tomi6') || imagePath.includes('chair') || imagePath.includes('pita')) {
    return defaults['process-image-inline'];
  }

  // Default fallback
  return defaults['process-image-inline'];
}

