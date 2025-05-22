import BrowserCache from './browserCache';
import { getPexelsConfig } from '../config/services';
import logger from '../utils/logger';

// Types
export interface PexelsImage {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographerUrl: string;
  alt: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

export interface PexelsSearchParams {
  query: string;
  orientation?: 'landscape' | 'portrait' | 'square';
  size?: 'large' | 'medium' | 'small';
  color?: string;
  locale?: string;
  page?: number;
  per_page?: number;
}

export interface PexelsResponse {
  images: PexelsImage[];
  total_results: number;
  page: number;
  per_page: number;
  prev_page: number | null;
  next_page: number | null;
}

// Error class
export class PexelsError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errorCode?: string
  ) {
    super(message);
    this.name = 'PexelsError';
    
    // Set the prototype explicitly
    Object.setPrototypeOf(this, PexelsError.prototype);
  }
}

// Create a cache for Pexels API responses
const cache = new BrowserCache();

// Mock fallback images for when Pexels is not available
const mockImages: PexelsImage[] = [
  {
    id: 1,
    width: 1200,
    height: 800,
    url: 'https://via.placeholder.com/1200x800/2563eb/ffffff?text=CloudSeek',
    photographer: 'CloudSeek',
    photographerUrl: 'https://cloudseek.io',
    alt: 'CloudSeek placeholder image',
    src: {
      original: 'https://via.placeholder.com/1200x800/2563eb/ffffff?text=CloudSeek',
      large2x: 'https://via.placeholder.com/1200x800/2563eb/ffffff?text=CloudSeek',
      large: 'https://via.placeholder.com/1200x800/2563eb/ffffff?text=CloudSeek',
      medium: 'https://via.placeholder.com/800x600/2563eb/ffffff?text=CloudSeek',
      small: 'https://via.placeholder.com/400x300/2563eb/ffffff?text=CloudSeek',
      portrait: 'https://via.placeholder.com/600x800/2563eb/ffffff?text=CloudSeek',
      landscape: 'https://via.placeholder.com/1200x800/2563eb/ffffff?text=CloudSeek',
      tiny: 'https://via.placeholder.com/200x150/2563eb/ffffff?text=CloudSeek'
    }
  }
];

class PexelsClient {
  private readonly defaultPerPage: number;
  private readonly enabled: boolean;
  private readonly cacheTTL: number;

  constructor() {
    const config = getPexelsConfig();
    
    this.enabled = false; // Disabled since we removed the pexels package
    this.defaultPerPage = config.defaultPerPage || 15;
    this.cacheTTL = config.cacheTTL || 3600; // Default to 1 hour
    
    logger.warn('PexelsClient initialized in mock mode - external package not available');
  }

  private getCacheKey(params: PexelsSearchParams): string {
    return `pexels:${JSON.stringify(params)}`;
  }

  async searchImages(params: PexelsSearchParams): Promise<PexelsResponse> {
    logger.warn('Pexels client is in mock mode, returning placeholder images');
    
    const cacheKey = this.getCacheKey(params);
    const cachedResult = cache.get<PexelsResponse>(cacheKey);
    
    if (cachedResult) {
      logger.debug(`Using cached mock Pexels search result for '${params.query}'`);
      return cachedResult;
    }
    
    const result: PexelsResponse = {
      images: mockImages,
      total_results: mockImages.length,
      page: params.page || 1,
      per_page: params.per_page || this.defaultPerPage,
      prev_page: null,
      next_page: null
    };
    
    // Cache the result
    cache.set(cacheKey, result, this.cacheTTL);
    
    return result;
  }

    async getRandomImage(query: string): Promise<PexelsImage | null> {    logger.warn(`Pexels client is in mock mode, returning placeholder image for query: ${query}`);    return mockImages[0];  }

  async getCuratedPhotos(page: number = 1, per_page: number = 15): Promise<PexelsResponse> {
    logger.warn('Pexels client is in mock mode, returning placeholder images');
    
    return {
      images: mockImages,
      total_results: mockImages.length,
      page,
      per_page,
      prev_page: null,
      next_page: null
    };
  }

  async getImagesForCategory(category: string, count: number = 5): Promise<PexelsImage[]> {
    logger.warn('Pexels client is in mock mode, returning placeholder images');
    return mockImages.slice(0, count);
  }

    clearCache(): void {    cache.flushAll();    logger.info('Pexels cache cleared');  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

// Create and export a singleton instance
const pexelsClient = new PexelsClient();
export default pexelsClient; 