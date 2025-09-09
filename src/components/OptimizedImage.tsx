import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PhotoIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { validateProductPhotoUrl } from '../utils/productValidation';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  quality?: number;
  format?: 'webp' | 'avif' | 'original';
  placeholder?: 'blur' | 'skeleton' | 'none';
  blurDataURL?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  fallbackSrc?: string;
}

interface ImageState {
  isLoading: boolean;
  hasError: boolean;
  isInView: boolean;
  currentSrc: string;
  retryCount: number;
  validationStatus: 'pending' | 'valid' | 'invalid';
  isEmpty: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  quality = 75,
  format = 'webp',
  placeholder = 'blur',
  blurDataURL,
  priority = false,
  onLoad,
  onError,
  sizes,
  objectFit = 'cover',
  fallbackSrc
}) => {
  const [state, setState] = useState<ImageState>({
    isLoading: true,
    hasError: false,
    isInView: false,
    currentSrc: '',
    retryCount: 0,
    validationStatus: 'pending',
    isEmpty: false
  });

  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  // Simulate CDN URL generation with optimizations
  const generateOptimizedSrc = useCallback((originalSrc: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  }) => {
    // In a real scenario, this would generate CDN URLs like Cloudinary, ImageKit, etc.
    // For now, we'll simulate with query parameters that could work with a CDN
    const url = new URL(originalSrc, window.location.origin);
    
    if (options.width) url.searchParams.set('w', String(options.width));
    if (options.height) url.searchParams.set('h', String(options.height));
    if (options.quality) url.searchParams.set('q', String(options.quality));
    if (options.format && options.format !== 'original') {
      url.searchParams.set('f', options.format);
    }
    
    // Add compression and optimization flags
    url.searchParams.set('auto', 'compress');
    url.searchParams.set('cs', 'srgb');
    
    return url.toString();
  }, []);

  // Generate responsive srcSet for different screen densities
  const generateSrcSet = useCallback((originalSrc: string) => {
    if (!width) return '';
    
    const densities = [1, 1.5, 2, 3];
    return densities
      .map(density => {
        const optimizedSrc = generateOptimizedSrc(originalSrc, {
          width: Math.round((width || 400) * density),
          height: height ? Math.round(height * density) : undefined,
          quality: density > 2 ? 60 : quality, // Lower quality for high-density screens
          format
        });
        return `${optimizedSrc} ${density}x`;
      })
      .join(', ');
  }, [width, height, quality, format, generateOptimizedSrc]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setState(prev => ({ ...prev, isInView: true }));
      return;
    }

    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState(prev => ({ ...prev, isInView: true }));
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority]);

  // Validate and generate optimized image sources when in view
  useEffect(() => {
    if (!state.isInView) return;

    // Check if src is empty or invalid
    if (!src || src.trim() === '') {
      console.warn('📷 [OptimizedImage] Empty or invalid src provided');
      setState(prev => ({ 
        ...prev, 
        isEmpty: true,
        validationStatus: 'invalid',
        hasError: true,
        isLoading: false
      }));
      return;
    }

    const optimizedSrc = generateOptimizedSrc(src, {
      width,
      height,
      quality,
      format
    });

    // Validate the URL before setting it
    validateProductPhotoUrl(src).then(isValid => {
      setState(prev => ({ 
        ...prev, 
        currentSrc: optimizedSrc,
        validationStatus: isValid ? 'valid' : 'invalid',
        isEmpty: false
      }));
      
      if (!isValid) {
        console.warn('📷 [OptimizedImage] Photo validation failed:', { src, optimizedSrc });
      }
    }).catch(error => {
      console.error('📷 [OptimizedImage] Photo validation error:', error);
      setState(prev => ({ 
        ...prev, 
        validationStatus: 'invalid',
        hasError: true,
        isLoading: false
      }));
    });
  }, [state.isInView, src, width, height, quality, format, generateOptimizedSrc]);

  // Handle image load success
  const handleLoad = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: false, hasError: false }));
    onLoad?.();
  }, [onLoad]);

  // Handle image load error with retry mechanism
  const handleError = useCallback(() => {
    console.error('📷 [OptimizedImage] Image load failed:', {
      src: state.currentSrc,
      alt,
      retryCount: state.retryCount,
      validationStatus: state.validationStatus
    });
    
    setState(prev => {
      const newRetryCount = prev.retryCount + 1;
      
      // Try fallback src if available and this is first retry
      if (fallbackSrc && newRetryCount === 1) {
        console.log('📷 [OptimizedImage] Trying fallback src:', fallbackSrc);
        return {
          ...prev,
          currentSrc: fallbackSrc,
          retryCount: newRetryCount,
          validationStatus: 'pending'
        };
      }
      
      // Give up after 3 retries
      if (newRetryCount >= 3) {
        console.warn('📷 [OptimizedImage] Max retries reached, giving up');
        return {
          ...prev,
          hasError: true,
          isLoading: false,
          validationStatus: 'invalid'
        };
      }
      
      // Retry with original source
      setTimeout(() => {
        console.log('📷 [OptimizedImage] Retrying with lower quality');
        setState(current => ({
          ...current,
          currentSrc: generateOptimizedSrc(src, { width, height, quality: 60 }) // Lower quality on retry
        }));
      }, 1000 * newRetryCount); // Exponential backoff
      
      return { ...prev, retryCount: newRetryCount };
    });
    
    onError?.();
  }, [fallbackSrc, src, width, height, quality, generateOptimizedSrc, onError, state.currentSrc, state.retryCount, state.validationStatus, alt]);

  // Retry function for manual retry
  const handleRetry = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      hasError: false,
      retryCount: 0,
      currentSrc: generateOptimizedSrc(src, { width, height, quality })
    }));
  }, [src, width, height, quality, generateOptimizedSrc]);

  // Generate blur placeholder
  const getPlaceholderStyle = useCallback(() => {
    if (placeholder === 'none') return {};
    
    if (blurDataURL) {
      return {
        backgroundImage: `url(${blurDataURL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(10px)'
      };
    }
    
    if (placeholder === 'blur') {
      return {
        background: 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
      };
    }
    
    return {};
  }, [placeholder, blurDataURL]);

  // Base container styles
  const containerClasses = `relative overflow-hidden ${className}`;
  const imageClasses = `transition-opacity duration-500 ${
    state.isLoading ? 'opacity-0' : 'opacity-100'
  } ${objectFit === 'cover' ? 'object-cover' : objectFit === 'contain' ? 'object-contain' : `object-${objectFit}`} w-full h-full`;

  return (
    <div ref={imgRef} className={containerClasses} style={{ width, height }}>
      {/* Placeholder/Skeleton */}
      {(state.isLoading || !state.isInView) && (
        <div
          className="absolute inset-0 bg-gray-200 flex items-center justify-center"
          style={getPlaceholderStyle()}
        >
          {placeholder === 'skeleton' ? (
            <div className="animate-pulse bg-gray-300 w-full h-full" />
          ) : (
            <PhotoIcon className="w-8 h-8 text-gray-400" />
          )}
        </div>
      )}

      {/* Error State */}
      {(state.hasError || state.isEmpty || state.validationStatus === 'invalid') && (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center p-4">
          <ExclamationTriangleIcon className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-xs text-gray-500 text-center mb-2">
            {state.isEmpty ? 'Tidak ada gambar' : 
             state.validationStatus === 'invalid' ? 'Gambar tidak valid' :
             'Gagal memuat gambar'}
          </p>
          {!state.isEmpty && state.retryCount < 3 && (
            <button
              onClick={handleRetry}
              className="text-xs bg-navy-blue-600 text-white px-3 py-1 rounded hover:bg-navy-blue-700 transition-colors"
            >
              Coba Lagi ({3 - state.retryCount} tersisa)
            </button>
          )}
        </div>
      )}

      {/* Optimized Image */}
      {state.isInView && state.currentSrc && !state.hasError && !state.isEmpty && state.validationStatus !== 'invalid' && (
        <picture>
          {/* WebP source for modern browsers */}
          {format === 'webp' && (
            <source
              srcSet={generateSrcSet(src.replace(/\.(jpg|jpeg|png)$/i, '.webp'))}
              sizes={sizes}
              type="image/webp"
            />
          )}
          
          {/* AVIF source for cutting-edge browsers */}
          {format === 'avif' && (
            <source
              srcSet={generateSrcSet(src.replace(/\.(jpg|jpeg|png|webp)$/i, '.avif'))}
              sizes={sizes}
              type="image/avif"
            />
          )}
          
          {/* Fallback image */}
          <img
            src={state.currentSrc}
            srcSet={generateSrcSet(src)}
            sizes={sizes}
            alt={alt}
            className={imageClasses}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            style={{
              ...(width && { maxWidth: width }),
              ...(height && { maxHeight: height })
            }}
          />
        </picture>
      )}

      {/* Loading indicator for priority images */}
      {priority && state.isLoading && (
        <div className="absolute top-2 right-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-navy-blue-600 bg-white/80 backdrop-blur-sm"></div>
        </div>
      )}
    </div>
  );
};

// Utility hook for preloading images
export const useImagePreloader = () => {
  const preloadImage = useCallback((src: string, options?: { format?: string; quality?: number }) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      
      // Generate optimized URL if options provided
      const optimizedSrc = options ? (() => {
        const url = new URL(src, window.location.origin);
        if (options.quality) url.searchParams.set('q', String(options.quality));
        if (options.format) url.searchParams.set('f', options.format);
        return url.toString();
      })() : src;
      
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = optimizedSrc;
    });
  }, []);

  const preloadImages = useCallback((srcs: string[], options?: { format?: string; quality?: number }) => {
    return Promise.allSettled(srcs.map(src => preloadImage(src, options)));
  }, [preloadImage]);

  return { preloadImage, preloadImages };
};

// Higher-order component for progressive image enhancement
export const withImageOptimization = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const ImageOptimizedComponent = (props: P) => {
    const { preloadImages } = useImagePreloader();
    
    useEffect(() => {
      // Preload critical images on component mount
      const criticalImages = [
        '/assets/images/hero-bg.jpg',
        '/assets/images/camera-placeholder.jpg'
      ];
      
      preloadImages(criticalImages, { format: 'webp', quality: 75 });
    }, [preloadImages]);

    return <WrappedComponent {...props} />;
  };

  ImageOptimizedComponent.displayName = `withImageOptimization(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return ImageOptimizedComponent;
};

export default OptimizedImage;
