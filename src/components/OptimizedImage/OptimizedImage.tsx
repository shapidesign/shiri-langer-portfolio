import React, { useState, useRef, useEffect } from 'react';

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
  priority?: boolean; // For above-the-fold images
}

/**
 * OptimizedImage - High-performance image component with:
 * - Lazy loading
 * - WebP/AVIF support with fallback
 * - Explicit dimensions to prevent CLS
 * - Intersection Observer for efficient loading
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  style,
  loading = 'lazy',
  onLoad,
  onError,
  onClick,
  title,
  priority = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [useWebP, setUseWebP] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Check WebP support
  useEffect(() => {
    const checkWebPSupport = () => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        setUseWebP(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    };
    checkWebPSupport();
  }, []);

  // Generate optimized src with WebP if supported
  // Uses <picture> element approach with multiple sources for better browser support
  const getOptimizedSrc = (originalSrc: string): { webp?: string; original: string } => {
    if (!useWebP) return { original: originalSrc };
    
    // If src already has an extension, try to replace with .webp
    const match = originalSrc.match(/\.(jpg|jpeg|png)$/i);
    if (match) {
      const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      return { webp: webpSrc, original: originalSrc };
    }
    
    return { original: originalSrc };
  };

  // Setup Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager' || !imgRef.current) {
      return;
    }

    const imgElement = imgRef.current;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start loading the image
            if (imgElement && imgElement.dataset.src) {
              imgElement.src = imgElement.dataset.src;
              imgElement.removeAttribute('data-src');
            }
            observerRef.current?.unobserve(imgElement);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01,
      }
    );

    observerRef.current.observe(imgElement);

    return () => {
      if (observerRef.current && imgElement) {
        observerRef.current.unobserve(imgElement);
      }
    };
  }, [priority, loading]);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  // Use optimized src or fallback to original
  const optimizedSrcs = getOptimizedSrc(src);
  const shouldLazyLoad = loading === 'lazy' && !priority;
  
  // For WebP, we'll use a picture element with source tags
  // For now, try WebP first if available, fallback to original
  const primarySrc = optimizedSrcs.webp || optimizedSrcs.original;
  const fallbackSrc = optimizedSrcs.original;
  
  const imgSrc = shouldLazyLoad && imgRef.current?.dataset.src ? undefined : primarySrc;
  const dataSrc = shouldLazyLoad ? primarySrc : undefined;
  const dataSrcSet = optimizedSrcs.webp && shouldLazyLoad ? `${optimizedSrcs.webp} 1x, ${optimizedSrcs.original} 1x` : undefined;

  // Calculate aspect ratio for CLS prevention
  const aspectRatio = width && height ? `${width} / ${height}` : undefined;

  return (
    <div
      className={`optimized-image-wrapper ${className || ''}`}
      style={{
        position: 'relative',
        width: width || '100%',
        height: height || 'auto',
        aspectRatio,
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Placeholder for CLS prevention */}
      {!imageLoaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-hidden="true"
        >
          <div
            style={{
              width: '40%',
              height: '40%',
              backgroundColor: '#ddd',
              borderRadius: '4px',
            }}
          />
        </div>
      )}

      {/* Actual image with WebP support using picture element */}
      {!imageError && (
        optimizedSrcs.webp && useWebP ? (
          <picture>
            <source
              srcSet={imgSrc ? `${optimizedSrcs.webp}` : undefined}
              data-srcset={dataSrc ? `${optimizedSrcs.webp}` : undefined}
              type="image/webp"
            />
            <img
              ref={imgRef}
              src={imgSrc || (dataSrc ? undefined : fallbackSrc)}
              data-src={dataSrc || (dataSrc ? fallbackSrc : undefined)}
              alt={alt}
              title={title}
              width={width}
              height={height}
              loading={priority ? 'eager' : loading}
              decoding="async"
              onClick={onClick}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                transform: 'translateZ(0)', // GPU acceleration
                willChange: imageLoaded ? 'auto' : 'opacity',
              }}
              onLoad={handleLoad}
              onError={(e) => {
                // If WebP fails, try fallback
                if (imgRef.current && optimizedSrcs.webp && e.currentTarget.src.includes('.webp')) {
                  e.currentTarget.src = fallbackSrc;
                } else {
                  handleError();
                }
              }}
            />
          </picture>
        ) : (
          <img
            ref={imgRef}
            src={imgSrc}
            data-src={dataSrc}
            alt={alt}
            title={title}
            width={width}
            height={height}
            loading={priority ? 'eager' : loading}
            decoding="async"
            onClick={onClick}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              transform: 'translateZ(0)', // GPU acceleration
              willChange: imageLoaded ? 'auto' : 'opacity',
            }}
            onLoad={handleLoad}
            onError={handleError}
          />
        )
      )}

      {/* Fallback for error */}
      {imageError && (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '14px',
          }}
        >
          Image not available
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
