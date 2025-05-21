import logger from './logger';

interface ImageDimensions {
  width: number;
  height: number;
}

interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill';
}

const DEFAULT_QUALITY = 75;
const SUPPORTED_FORMATS = ['webp', 'jpeg', 'png', 'avif'] as const;
const BREAKPOINTS = [640, 768, 1024, 1280, 1536];

/**
 * Generates srcset for responsive images
 */
export function generateSrcSet(
  src: string,
  options: Omit<ImageOptimizationOptions, 'width' | 'height'> = {}
): string {
  try {
    return BREAKPOINTS.map(width => {
      const optimizedUrl = getOptimizedImageUrl(src, { ...options, width });
      return `${optimizedUrl} ${width}w`;
    }).join(', ');
  } catch (error) {
    logger.error('Error generating srcset:', error);
    return src;
  }
}

/**
 * Generates sizes attribute for responsive images
 */
export function generateSizes(sizes: string[] = []): string {
  if (sizes.length === 0) {
    return '(min-width: 1536px) 1536px, (min-width: 1280px) 1280px, (min-width: 1024px) 1024px, (min-width: 768px) 768px, 100vw';
  }
  return sizes.join(', ');
}

/**
 * Gets optimized image URL with specified parameters
 */
export function getOptimizedImageUrl(
  src: string,
  {
    quality = DEFAULT_QUALITY,
    format,
    width,
    height,
    fit = 'cover'
  }: ImageOptimizationOptions = {}
): string {
  try {
    const url = new URL(src);
    const params = new URLSearchParams(url.search);

    if (quality && quality !== DEFAULT_QUALITY) {
      params.set('q', quality.toString());
    }

    if (format && SUPPORTED_FORMATS.includes(format)) {
      params.set('fm', format);
    }

    if (width) {
      params.set('w', width.toString());
    }

    if (height) {
      params.set('h', height.toString());
    }

    if (fit) {
      params.set('fit', fit);
    }

    url.search = params.toString();
    return url.toString();
  } catch (error) {
    logger.error('Error optimizing image URL:', error);
    return src;
  }
}

/**
 * Preloads critical images
 */
export function preloadCriticalImages(urls: string[]): void {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Gets image dimensions from URL or blob
 */
export async function getImageDimensions(src: string | Blob): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    if (src instanceof Blob) {
      img.src = URL.createObjectURL(src);
    } else {
      img.src = src;
    }
  });
}

/**
 * Checks if image format is supported by the browser
 */
export function isFormatSupported(format: string): boolean {
  const formats = {
    webp: 'image/webp',
    avif: 'image/avif',
    jpeg: 'image/jpeg',
    png: 'image/png'
  };

  if (!(format in formats)) {
    return false;
  }

  const canvas = document.createElement('canvas');
  return canvas.toDataURL(formats[format as keyof typeof formats]).indexOf(formats[format as keyof typeof formats]) === 5;
}

/**
 * Gets the best supported format for the current browser
 */
export function getBestSupportedFormat(): 'webp' | 'jpeg' {
  return isFormatSupported('webp') ? 'webp' : 'jpeg';
} 