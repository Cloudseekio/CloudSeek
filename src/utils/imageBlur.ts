interface BlurOptions {
  // Width of the blur placeholder (default: 40px)
  width?: number;
  // Quality of the blur placeholder (0-100, default: 70)
  quality?: number;
  // Whether to return a base64 data URL (default: true)
  toBase64?: boolean;
}

/**
 * Generates a blur placeholder for an image
 * @param imageUrl The URL of the image to generate a placeholder for
 * @param options Options for generating the placeholder
 * @returns Promise that resolves to the blur placeholder data
 */
export async function generateBlurPlaceholder(
  imageUrl: string,
  options: BlurOptions = {}
): Promise<string> {
  const {
    width = 40,
    quality = 70,
    toBase64 = true,
  } = options;

  // Create a canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Load the image
  const image = new Image();
  image.crossOrigin = 'anonymous';

  try {
    // Wait for the image to load
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = imageUrl;
    });

    // Calculate dimensions
    const aspectRatio = image.width / image.height;
    const height = Math.round(width / aspectRatio);

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Draw and blur the image
    ctx.drawImage(image, 0, 0, width, height);
    
    // Apply a slight blur effect
    ctx.filter = 'blur(2px)';
    ctx.drawImage(canvas, 0, 0, width, height);

    // Convert to base64 or return as blob URL
    if (toBase64) {
      return canvas.toDataURL('image/jpeg', quality / 100);
    } else {
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(URL.createObjectURL(blob));
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg',
          quality / 100
        );
      });
    }
  } finally {
    // Cleanup
    image.onload = null;
    image.onerror = null;
  }
}

/**
 * Cache for storing generated blur placeholders
 */
const placeholderCache = new Map<string, string>();

/**
 * Gets a blur placeholder for an image, using cache if available
 * @param imageUrl The URL of the image to get a placeholder for
 * @param options Options for generating the placeholder
 * @returns Promise that resolves to the blur placeholder data
 */
export async function getBlurPlaceholder(
  imageUrl: string,
  options?: BlurOptions
): Promise<string> {
  // Check cache first
  const cached = placeholderCache.get(imageUrl);
  if (cached) {
    return cached;
  }

  // Generate new placeholder
  const placeholder = await generateBlurPlaceholder(imageUrl, options);
  
  // Cache the result
  placeholderCache.set(imageUrl, placeholder);
  
  return placeholder;
}

/**
 * Preloads blur placeholders for a list of images
 * @param imageUrls Array of image URLs to preload placeholders for
 * @param options Options for generating the placeholders
 */
export async function preloadBlurPlaceholders(
  imageUrls: string[],
  options?: BlurOptions
): Promise<void> {
  await Promise.all(
    imageUrls.map(url => getBlurPlaceholder(url, options))
  );
} 