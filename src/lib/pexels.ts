import { createClient, Photo, Photos, ErrorResponse } from 'pexels';
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

class PexelsClient {
  private client;
  private readonly defaultPerPage: number;
  private readonly enabled: boolean;
  private readonly cacheTTL: number;
  private requestsThisHour = 0;
  private hourlyRateLimitReset = Date.now() + 3600000; // Default to 1 hour from now
  private readonly MAX_REQUESTS_PER_HOUR = 200; // Pexels default rate limit is 200 req/hour
  private readonly RATE_LIMIT_BUFFER = 20; // Leave 10% of rate limit as buffer

  constructor() {
    const config = getPexelsConfig();
    const apiKey = config.apiKey;
    
    this.enabled = config.enabledForFallbackImages && !!apiKey;
    this.defaultPerPage = config.defaultPerPage || 15;
    this.cacheTTL = config.cacheTTL || 3600; // Default to 1 hour
    
    if (this.enabled) {
      try {
        this.client = createClient(apiKey);
        logger.info('PexelsClient initialized successfully');
        logger.debug(`Cache TTL set to ${this.cacheTTL} seconds`);
      } catch (error) {
        logger.error('Failed to initialize Pexels client', error);
        this.enabled = false;
      }
    } else {
      logger.warn('PexelsClient disabled - no API key provided or disabled in config');
    }
  }

  private transformPhoto(photo: Photo): PexelsImage {
    return {
      id: photo.id,
      width: photo.width,
      height: photo.height,
      url: photo.url,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      alt: photo.alt || photo.photographer || 'Image from Pexels',
      src: {
        original: photo.src.original,
        large2x: photo.src.large2x,
        large: photo.src.large,
        medium: photo.src.medium,
        small: photo.src.small,
        portrait: photo.src.portrait,
        landscape: photo.src.landscape,
        tiny: photo.src.tiny
      }
    };
  }

  private getCacheKey(params: PexelsSearchParams): string {
    return `pexels:${JSON.stringify(params)}`;
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    
    // Reset counter if an hour has passed
    if (now > this.hourlyRateLimitReset) {
      this.requestsThisHour = 0;
      this.hourlyRateLimitReset = now + 3600000; // 1 hour from now
    }
    
    this.requestsThisHour++;
    
    // If we're approaching the rate limit, add a delay
    if (this.requestsThisHour >= this.MAX_REQUESTS_PER_HOUR - this.RATE_LIMIT_BUFFER) {
      logger.warn(`Approaching Pexels rate limit: ${this.requestsThisHour}/${this.MAX_REQUESTS_PER_HOUR} requests`);
      // Add a delay to spread out requests
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    // If we've hit the rate limit, wait until the hour is up
    if (this.requestsThisHour >= this.MAX_REQUESTS_PER_HOUR) {
      const timeToWait = this.hourlyRateLimitReset - now + 100; // Add 100ms buffer
      logger.warn(`Pexels rate limit hit, waiting ${timeToWait}ms before next request`);
      await new Promise(resolve => setTimeout(resolve, timeToWait));
      this.requestsThisHour = 0;
      this.hourlyRateLimitReset = Date.now() + 3600000;
    }
  }

  async searchImages(params: PexelsSearchParams): Promise<PexelsResponse> {
    if (!this.enabled) {
      logger.warn('Pexels client is disabled, returning empty results');
      return {
        images: [],
        total_results: 0,
        page: 1,
        per_page: params.per_page || this.defaultPerPage,
        prev_page: null,
        next_page: null
      };
    }
    
    const cacheKey = this.getCacheKey(params);
    const cachedResult = cache.get<PexelsResponse>(cacheKey);
    
    if (cachedResult) {
      logger.debug(`Using cached Pexels search result for '${params.query}'`);
      return cachedResult;
    }
    
    try {
      // Enforce rate limits before making the request
      await this.enforceRateLimit();
      
      logger.info(`Searching Pexels for '${params.query}'`);
      
      // Prepare parameters
      const searchParams = {
        query: params.query,
        orientation: params.orientation,
        size: params.size,
        color: params.color,
        locale: params.locale,
        page: params.page || 1,
        per_page: params.per_page || this.defaultPerPage
      };
      
      const response = await this.client.photos.search(searchParams);
      
      const result: PexelsResponse = {
        images: response.photos.map(photo => this.transformPhoto(photo)),
        total_results: response.total_results,
        page: response.page,
        per_page: response.per_page,
        prev_page: response.prev_page,
        next_page: response.next_page
      };
      
      // Cache the result
      cache.set(cacheKey, result, this.cacheTTL);
      logger.debug(`Cached Pexels search results for '${params.query}'`);
      
      return result;
    } catch (error) {
      const pexelsError = error as ErrorResponse;
      const statusCode = pexelsError.status || 500;
      const errorMessage = pexelsError.error || 'Unknown Pexels API error';
      
      logger.error(`Pexels API error (${statusCode}): ${errorMessage}`, error);
      
      // If we get a rate limit error, update our tracking
      if (statusCode === 429) {
        this.requestsThisHour = this.MAX_REQUESTS_PER_HOUR;
        // Try to parse reset time from headers if available
        const resetTime = pexelsError.headers?.['x-ratelimit-reset'];
        if (resetTime) {
          this.hourlyRateLimitReset = parseInt(resetTime) * 1000; // Convert to milliseconds
        }
      }
      
      throw new PexelsError(
        `Pexels API error: ${errorMessage}`,
        statusCode,
        pexelsError.code
      );
    }
  }

  async getRandomImage(query: string): Promise<PexelsImage | null> {
    if (!this.enabled) {
      logger.warn('Pexels client is disabled, returning null for random image');
      return null;
    }
    
    const cacheKey = `pexels:random:${query}`;
    const cachedResult = cache.get<PexelsImage>(cacheKey);
    
    if (cachedResult) {
      logger.debug(`Using cached random Pexels image for '${query}'`);
      return cachedResult;
    }
    
    try {
      // Get a small set of images
      const response = await this.searchImages({
        query,
        per_page: 15,
        page: Math.floor(Math.random() * 5) + 1 // Random page between 1-5
      });
      
      if (response.images.length === 0) {
        logger.warn(`No images found for query '${query}'`);
        return null;
      }
      
      // Select a random image from the results
      const randomIndex = Math.floor(Math.random() * response.images.length);
      const randomImage = response.images[randomIndex];
      
      // Cache the random image
      cache.set(cacheKey, randomImage, this.cacheTTL / 2); // Shorter TTL for random images
      
      return randomImage;
    } catch (error) {
      logger.error(`Failed to get random image for '${query}'`, error);
      return null;
    }
  }

  async getCuratedPhotos(page: number = 1, per_page: number = 15): Promise<PexelsResponse> {
    if (!this.enabled) {
      logger.warn('Pexels client is disabled, returning empty results for curated photos');
      return {
        images: [],
        total_results: 0,
        page,
        per_page,
        prev_page: null,
        next_page: null
      };
    }
    
    const cacheKey = `pexels:curated:${page}:${per_page}`;
    const cachedResult = cache.get<PexelsResponse>(cacheKey);
    
    if (cachedResult) {
      logger.debug(`Using cached curated Pexels photos`);
      return cachedResult;
    }
    
    try {
      // Enforce rate limits before making the request
      await this.enforceRateLimit();
      
      logger.info(`Fetching curated photos from Pexels`);
      
      const response = await this.client.photos.curated({
        page,
        per_page
      });
      
      const result: PexelsResponse = {
        images: response.photos.map(photo => this.transformPhoto(photo)),
        total_results: response.total_results || response.photos.length,
        page: response.page,
        per_page: response.per_page,
        prev_page: response.prev_page,
        next_page: response.next_page
      };
      
      // Cache the result
      cache.set(cacheKey, result, this.cacheTTL);
      
      return result;
    } catch (error) {
      const pexelsError = error as ErrorResponse;
      logger.error(`Pexels API error: ${pexelsError.error || 'Unknown error'}`, error);
      
      // Return empty result on error rather than throwing
      return {
        images: [],
        total_results: 0,
        page,
        per_page,
        prev_page: null,
        next_page: null
      };
    }
  }

  async getImagesForCategory(category: string, count: number = 5): Promise<PexelsImage[]> {
    if (!this.enabled) {
      logger.warn(`Pexels client is disabled, returning empty results for category '${category}'`);
      return [];
    }
    
    const cacheKey = `pexels:category:${category}:${count}`;
    const cachedResult = cache.get<PexelsImage[]>(cacheKey);
    
    if (cachedResult) {
      logger.debug(`Using cached Pexels images for category '${category}'`);
      return cachedResult;
    }
    
    try {
      // Get the search results
      const response = await this.searchImages({
        query: category,
        per_page: count * 2 // Request more to get better variety
      });
      
      let results = response.images;
      
      // If we got enough images, randomly select 'count' images
      if (results.length > count) {
        // Shuffle the array
        results = results.sort(() => 0.5 - Math.random());
        // Take the first 'count' elements
        results = results.slice(0, count);
      }
      
      // Cache the results
      cache.set(cacheKey, results, this.cacheTTL);
      
      return results;
    } catch (error) {
      logger.error(`Failed to get images for category '${category}'`, error);
      return [];
    }
  }

  clearCache(): void {
    logger.info('Clearing Pexels cache');
    cache.flushAll();
  }
  
  isEnabled(): boolean {
    return this.enabled;
  }
}

// Export a singleton instance
export const pexelsClient = new PexelsClient(); 