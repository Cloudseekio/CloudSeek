import { PexelsImage } from '../../lib/pexels';
import { pexelsClient } from '../../lib/pexels';
import { BlogImage } from '../../models/Blog';
import { ContentfulAsset, CombinedAsset, isContentfulAsset, isPexelsAsset } from '../types/contentful';

/**
 * Interface for the image cache
 */
interface ImageCache {
  [key: string]: {
    data: BlogImage;
    timestamp: number;
  };
}

/**
 * Image types supported by the service
 */
export type ImageType = 'cover' | 'avatar' | 'thumbnail' | 'inline';

/**
 * Options for image transformation
 */
export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpg' | 'webp' | 'avif';
  fit?: 'fill' | 'scale' | 'crop';
  focus?: 'center' | 'face' | 'top' | 'bottom';
}

/**
 * Configuration for fallback images
 */
interface FallbackConfig {
  type: ImageType;
  queries: string[];
  options?: ImageOptions;
}

/**
 * Options for image upload progress tracking
 */
interface UploadOptions {
  onProgress: (progress: number) => void;
}

/**
 * Service for handling images from different sources with caching and transformations
 */
export class ImageService {
  private cache: ImageCache = {};
  private readonly cacheDuration = 24 * 60 * 60 * 1000; // 24 hours
  private readonly defaultOptions: Record<ImageType, ImageOptions> = {
    cover: {
      width: 1200,
      height: 630,
      quality: 80,
      format: 'webp',
      fit: 'crop',
      focus: 'center'
    },
    avatar: {
      width: 400,
      height: 400,
      quality: 85,
      format: 'webp',
      fit: 'crop',
      focus: 'face'
    },
    thumbnail: {
      width: 300,
      height: 200,
      quality: 75,
      format: 'webp',
      fit: 'crop',
      focus: 'center'
    },
    inline: {
      width: 800,
      quality: 80,
      format: 'webp',
      fit: 'scale'
    }
  };

  private readonly fallbackConfigs: Record<ImageType, FallbackConfig> = {
    cover: {
      type: 'cover',
      queries: ['minimal background', 'abstract pattern', 'geometric design'],
      options: this.defaultOptions.cover
    },
    avatar: {
      type: 'avatar',
      queries: ['professional portrait', 'person silhouette', 'abstract avatar'],
      options: this.defaultOptions.avatar
    },
    thumbnail: {
      type: 'thumbnail',
      queries: ['minimal design', 'abstract art', 'placeholder image'],
      options: this.defaultOptions.thumbnail
    },
    inline: {
      type: 'inline',
      queries: ['placeholder image', 'minimal design'],
      options: this.defaultOptions.inline
    }
  };

  private readonly apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
    // Load cache from localStorage on initialization
    this.loadCache();
    // Clean up expired cache entries periodically
    setInterval(() => this.cleanCache(), this.cacheDuration);
  }

  private loadCache(): void {
    try {
      const savedCache = localStorage.getItem('imageCache');
      if (savedCache) {
        this.cache = JSON.parse(savedCache);
      }
    } catch (error) {
      console.warn('Failed to load image cache:', error);
    }
  }

  private saveCache(): void {
    try {
      localStorage.setItem('imageCache', JSON.stringify(this.cache));
    } catch (error) {
      console.warn('Failed to save image cache:', error);
    }
  }

  private cleanCache(): void {
    const now = Date.now();
    Object.keys(this.cache).forEach(key => {
      if (now - this.cache[key].timestamp > this.cacheDuration) {
        delete this.cache[key];
      }
    });
    this.saveCache();
  }

  private getCacheKey(asset: CombinedAsset, type: ImageType, options?: ImageOptions): string {
    const assetId = isContentfulAsset(asset) ? asset.sys.id : asset.id.toString();
    return `${assetId}-${type}-${JSON.stringify(options || {})}`;
  }

  private async transformContentfulAsset(
    asset: ContentfulAsset,
    type: ImageType,
    options?: ImageOptions
  ): Promise<BlogImage> {
    const { file } = asset.fields;
    if (!file) {
      throw new Error('Invalid Contentful asset: missing file field');
    }

    const imageOptions = { ...this.defaultOptions[type], ...options };
    const queryParams = new URLSearchParams();

    if (imageOptions.width) queryParams.append('w', imageOptions.width.toString());
    if (imageOptions.height) queryParams.append('h', imageOptions.height.toString());
    if (imageOptions.fit) queryParams.append('fit', imageOptions.fit);
    if (imageOptions.focus) queryParams.append('f', imageOptions.focus);
    if (imageOptions.quality) queryParams.append('q', imageOptions.quality.toString());
    if (imageOptions.format) queryParams.append('fm', imageOptions.format);

    // Safely handle the URL field by ensuring it's a string
    // file.url can be either a string or an object with string properties
    let fileUrl = '';
    if (typeof file.url === 'string') {
      fileUrl = file.url;
    } else if (file.url && typeof file.url === 'object') {
      // First cast to unknown, then to the specific type we expect
      // This is safer than direct casting when types don't overlap well
      const urlObj = file.url as unknown as Record<string, string | undefined>;
      // Try to extract a URL from common properties
      fileUrl = urlObj['default'] || urlObj['en-US'] || '';
    }
    
    const queryString = queryParams.toString();
    const url = fileUrl + (queryString ? `?${queryString}` : '');

    // Safe type handling for width and height with proper type guards
    let width: number | undefined = imageOptions.width;
    let height: number | undefined = imageOptions.height;
    
    // Only try to access image dimensions if they're not already set in options
    if (!width && file.details && typeof file.details === 'object' && 'image' in file.details) {
      const imageDetails = file.details.image;
      if (imageDetails && typeof imageDetails.width === 'number') {
        width = imageDetails.width;
      }
    }
    
    if (!height && file.details && typeof file.details === 'object' && 'image' in file.details) {
      const imageDetails = file.details.image;
      if (imageDetails && typeof imageDetails.height === 'number') {
        height = imageDetails.height;
      }
    }

    return {
      url: url.startsWith('//') ? `https:${url}` : url,
      alt: asset.fields.description || asset.fields.title || '',
      width,
      height,
      source: 'contentful'
    };
  }

  private async transformPexelsImage(
    image: PexelsImage,
    type: ImageType,
    options?: ImageOptions
  ): Promise<BlogImage> {
    const imageOptions = { ...this.defaultOptions[type], ...options };
    let url = image.src.original;

    // Select the most appropriate size based on the requested dimensions
    if (imageOptions.width && imageOptions.height) {
      if (imageOptions.width <= 400) url = image.src.small;
      else if (imageOptions.width <= 800) url = image.src.medium;
      else if (imageOptions.width <= 1280) url = image.src.large;
      else url = image.src.large2x;
    }

    return {
      url,
      alt: image.alt || '',
      width: image.width,
      height: image.height,
      source: 'pexels',
      photographer: image.photographer,
      photographerUrl: image.photographerUrl
    };
  }

  /**
   * Get all images from the API
   * @returns Promise resolving to an array of BlogImage objects
   */
  async getImages(): Promise<BlogImage[]> {
    const response = await fetch(`${this.apiUrl}/images`);
    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }
    return response.json();
  }

  /**
   * Get a specific image by ID from the API
   * @param id The ID of the image to fetch
   * @returns Promise resolving to a BlogImage object
   */
  async getImageById(id: string): Promise<BlogImage> {
    const response = await fetch(`${this.apiUrl}/images/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    return response.json();
  }

  /**
   * Upload an image to the API with optional progress tracking
   * @param file The file to upload
   * @param options Upload options including progress tracking
   * @returns Promise resolving to the uploaded BlogImage
   */
  async uploadImage(file: File, options?: UploadOptions): Promise<BlogImage> {
    const formData = new FormData();
    formData.append('image', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${this.apiUrl}/images`, true);

    return new Promise((resolve, reject) => {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && options?.onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          options.onProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            console.error('Failed to parse response:', error);
            reject(new Error('Invalid response format'));
          }
        } else {
          reject(new Error('Upload failed'));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error'));
      };

      xhr.send(formData);
    });
  }

  /**
   * Delete an image from the API by ID
   * @param id The ID of the image to delete
   */
  async deleteImage(id: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/images/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
  }

  /**
   * Get and transform an image asset with caching and fallback support
   * @param asset The combined asset to transform (Contentful or Pexels)
   * @param type The type of image (affects default transformation options)
   * @param options Optional transformation options
   * @returns Promise resolving to a BlogImage with transformed URL and metadata
   */
  async getImage(
    asset: CombinedAsset | undefined,
    type: ImageType,
    options?: ImageOptions
  ): Promise<BlogImage> {
    // If no asset provided, get a fallback image
    if (!asset) {
      return this.getFallbackImage(type, options);
    }

    const cacheKey = this.getCacheKey(asset, type, options);
    const cached = this.cache[cacheKey];

    // Return cached image if available and not expired
    if (cached && Date.now() - cached.timestamp <= this.cacheDuration) {
      return cached.data;
    }

    try {
      let image: BlogImage;

      if (isContentfulAsset(asset)) {
        image = await this.transformContentfulAsset(asset, type, options);
      } else if (isPexelsAsset(asset)) {
        image = await this.transformPexelsImage(asset, type, options);
      } else {
        throw new Error('Invalid asset type');
      }

      // Cache the transformed image
      this.cache[cacheKey] = {
        data: image,
        timestamp: Date.now()
      };
      this.saveCache();

      return image;
    } catch (error) {
      console.error('Error transforming image:', error);
      return this.getFallbackImage(type, options);
    }
  }

  /**
   * Get a fallback image when no asset is provided or transformation fails
   * @param type The type of image to get a fallback for
   * @param options Optional transformation options
   * @returns Promise resolving to a fallback BlogImage
   */
  async getFallbackImage(type: ImageType, options?: ImageOptions): Promise<BlogImage> {
    const config = this.fallbackConfigs[type];
    const query = config.queries[Math.floor(Math.random() * config.queries.length)];

    try {
      const pexelsImage = await pexelsClient.getRandomImage(query);
      if (!pexelsImage) {
        throw new Error('No fallback image found');
      }
      return this.transformPexelsImage(pexelsImage, type, options);
    } catch (error) {
      console.error('Error getting fallback image:', error);
      // Return a default placeholder image as last resort
      return {
        url: `/images/placeholders/${type}.svg`,
        alt: `Default ${type} placeholder`,
        width: options?.width || this.defaultOptions[type].width,
        height: options?.height || this.defaultOptions[type].height,
        source: 'contentful' // Using contentful as source to match allowed types
      };
    }
  }

  /**
   * Clear the image cache
   */
  clearCache(): void {
    this.cache = {};
    localStorage.removeItem('imageCache');
  }
}

// Create and export a singleton instance
// Using Vite's import.meta.env instead of process.env
export const imageService = new ImageService(import.meta.env.VITE_API_URL || '/api'); 