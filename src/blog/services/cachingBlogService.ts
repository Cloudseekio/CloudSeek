import { BlogPost, BlogCategory, BlogTag, BlogFilters } from '../types/blog';
import { 
  BlogServiceInterface, 
  PaginatedResponse, 
  PaginationOptions
} from './interfaces/BlogServiceInterface';
import { blogService } from './blogService';
import { Cache } from '../../utils/cacheUtils';
import logger from '../../utils/logger';

/**
 * Cache configuration for different API endpoints
 */
export interface BlogCacheConfig {
  posts: {
    ttl: number; // milliseconds
    maxSize: number;
  };
  categories: {
    ttl: number;
    maxSize: number;
  };
  tags: {
    ttl: number;
    maxSize: number;
  };
  singlePost: {
    ttl: number;
    maxSize: number;
  };
  relatedPosts: {
    ttl: number;
    maxSize: number;
  };
  trendingPosts: {
    ttl: number;
    maxSize: number;
  };
}

// Default cache configuration
const DEFAULT_CACHE_CONFIG: BlogCacheConfig = {
  posts: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 50,
  },
  categories: {
    ttl: 60 * 60 * 1000, // 1 hour
    maxSize: 20,
  },
  tags: {
    ttl: 60 * 60 * 1000, // 1 hour
    maxSize: 50,
  },
  singlePost: {
    ttl: 10 * 60 * 1000, // 10 minutes
    maxSize: 100,
  },
  relatedPosts: {
    ttl: 15 * 60 * 1000, // 15 minutes
    maxSize: 50,
  },
  trendingPosts: {
    ttl: 30 * 60 * 1000, // 30 minutes
    maxSize: 20,
  },
};

/**
 * A wrapper for BlogService that adds caching capabilities
 */
export class CachingBlogService implements BlogServiceInterface {
  private service: BlogServiceInterface;
  private config: BlogCacheConfig;
  private caches: {
    posts: Cache<PaginatedResponse<BlogPost>>;
    singlePost: Cache<BlogPost | null>;
    categories: Cache<PaginatedResponse<BlogCategory>>;
    tags: Cache<PaginatedResponse<BlogTag>>;
    relatedPosts: Cache<BlogPost[]>;
    trendingPosts: Cache<BlogPost[]>;
  };

  // Cache hit statistics for monitoring
  private cacheStats = {
    hits: 0,
    misses: 0,
    lastReset: Date.now(),
  };

  /**
   * Create a new CachingBlogService
   * @param service Underlying blog service to wrap with caching
   * @param config Cache configuration
   */
  constructor(service: BlogServiceInterface = blogService, config: Partial<BlogCacheConfig> = {}) {
    this.service = service;
    
    // Merge default config with provided config
    this.config = {
      posts: { ...DEFAULT_CACHE_CONFIG.posts, ...config.posts },
      categories: { ...DEFAULT_CACHE_CONFIG.categories, ...config.categories },
      tags: { ...DEFAULT_CACHE_CONFIG.tags, ...config.tags },
      singlePost: { ...DEFAULT_CACHE_CONFIG.singlePost, ...config.singlePost },
      relatedPosts: { ...DEFAULT_CACHE_CONFIG.relatedPosts, ...config.relatedPosts },
      trendingPosts: { ...DEFAULT_CACHE_CONFIG.trendingPosts, ...config.trendingPosts },
    };
    
    // Initialize caches
    this.caches = {
      posts: new Cache<PaginatedResponse<BlogPost>>({
        ttl: this.config.posts.ttl,
        maxSize: this.config.posts.maxSize,
      }),
      singlePost: new Cache<BlogPost | null>({
        ttl: this.config.singlePost.ttl,
        maxSize: this.config.singlePost.maxSize,
      }),
      categories: new Cache<PaginatedResponse<BlogCategory>>({
        ttl: this.config.categories.ttl,
        maxSize: this.config.categories.maxSize,
      }),
      tags: new Cache<PaginatedResponse<BlogTag>>({
        ttl: this.config.tags.ttl,
        maxSize: this.config.tags.maxSize,
      }),
      relatedPosts: new Cache<BlogPost[]>({
        ttl: this.config.relatedPosts.ttl,
        maxSize: this.config.relatedPosts.maxSize,
      }),
      trendingPosts: new Cache<BlogPost[]>({
        ttl: this.config.trendingPosts.ttl,
        maxSize: this.config.trendingPosts.maxSize,
      }),
    };
    
    // Log initialization without nested objects
    logger.info(`CachingBlogService: Initialized with config - posts: ${this.config.posts.ttl / 1000}s, categories: ${this.config.categories.ttl / 1000}s, tags: ${this.config.tags.ttl / 1000}s`);
  }

  /**
   * Create a cache key for posts request
   */
  private getPostsCacheKey(options?: { filters?: BlogFilters; pagination?: PaginationOptions }): string {
    // If no options, use a default key
    if (!options) {
      return 'posts:default';
    }
    
    // Create a serializable representation of the options
    const filterKey = options.filters ? 
      Object.entries(options.filters)
        .filter(([, value]) => value !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}:${value}`)
        .join(',') 
      : '';
      
    const paginationKey = options.pagination ?
      Object.entries(options.pagination)
        .filter(([, value]) => value !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}:${value}`)
        .join(',')
      : '';
      
    // Combine keys
    return `posts:${filterKey}:${paginationKey}`;
  }

  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    return this.service.initialize();
  }

  /**
   * Get posts with caching
   */
  async getPosts(options?: { filters?: BlogFilters; pagination?: PaginationOptions }): Promise<PaginatedResponse<BlogPost>> {
    const cacheKey = this.getPostsCacheKey(options);
    
    // Try to get from cache
    const cachedResult = this.caches.posts.get(cacheKey);
    if (cachedResult) {
      this.cacheStats.hits++;
      logger.debug('CachingBlogService: Cache hit for posts', { cacheKey });
      return cachedResult;
    }
    
    // If not in cache, get from service
    this.cacheStats.misses++;
    logger.debug('CachingBlogService: Cache miss for posts', { cacheKey });
    
    const result = await this.service.getPosts(options);
    
    // Cache the result
    this.caches.posts.set(cacheKey, result);
    
    return result;
  }

  /**
   * Get post by slug with caching
   */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const cacheKey = `post:${slug}`;
    
    // Try to get from cache
    const cachedResult = this.caches.singlePost.get(cacheKey);
    if (cachedResult !== undefined) {
      this.cacheStats.hits++;
      logger.debug('CachingBlogService: Cache hit for single post', { slug });
      return cachedResult;
    }
    
    // If not in cache, get from service
    this.cacheStats.misses++;
    logger.debug('CachingBlogService: Cache miss for single post', { slug });
    
    const result = await this.service.getPostBySlug(slug);
    
    // Cache the result (including null results)
    this.caches.singlePost.set(cacheKey, result);
    
    return result;
  }

  /**
   * Get categories with caching
   */
  async getCategories(pagination?: PaginationOptions): Promise<PaginatedResponse<BlogCategory>> {
    const paginationKey = pagination ? 
      Object.entries(pagination)
        .filter(([, value]) => value !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}:${value}`)
        .join(',')
      : 'default';
    
    const cacheKey = `categories:${paginationKey}`;
    
    // Try to get from cache
    const cachedResult = this.caches.categories.get(cacheKey);
    if (cachedResult) {
      this.cacheStats.hits++;
      logger.debug('CachingBlogService: Cache hit for categories');
      return cachedResult;
    }
    
    // If not in cache, get from service
    this.cacheStats.misses++;
    logger.debug('CachingBlogService: Cache miss for categories');
    
    const result = await this.service.getCategories(pagination);
    
    // Cache the result
    this.caches.categories.set(cacheKey, result);
    
    return result;
  }

  /**
   * Get tags with caching
   */
  async getTags(pagination?: PaginationOptions): Promise<PaginatedResponse<BlogTag>> {
    const paginationKey = pagination ? 
      Object.entries(pagination)
        .filter(([, value]) => value !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}:${value}`)
        .join(',')
      : 'default';
    
    const cacheKey = `tags:${paginationKey}`;
    
    // Try to get from cache
    const cachedResult = this.caches.tags.get(cacheKey);
    if (cachedResult) {
      this.cacheStats.hits++;
      logger.debug('CachingBlogService: Cache hit for tags');
      return cachedResult;
    }
    
    // If not in cache, get from service
    this.cacheStats.misses++;
    logger.debug('CachingBlogService: Cache miss for tags');
    
    const result = await this.service.getTags(pagination);
    
    // Cache the result
    this.caches.tags.set(cacheKey, result);
    
    return result;
  }

  /**
   * Get related posts with caching
   */
  async getRelatedPosts(post: BlogPost, limit?: number): Promise<BlogPost[]> {
    const cacheKey = `related:${post.id}:${limit || 'default'}`;
    
    // Try to get from cache
    const cachedResult = this.caches.relatedPosts.get(cacheKey);
    if (cachedResult) {
      this.cacheStats.hits++;
      logger.debug('CachingBlogService: Cache hit for related posts', { postId: post.id });
      return cachedResult;
    }
    
    // If not in cache, get from service
    this.cacheStats.misses++;
    logger.debug('CachingBlogService: Cache miss for related posts', { postId: post.id });
    
    // Handle if getRelatedPosts is not implemented
    if (!this.service.getRelatedPosts) {
      return [];
    }
    
    const result = await this.service.getRelatedPosts(post, limit);
    
    // Cache the result
    this.caches.relatedPosts.set(cacheKey, result);
    
    return result;
  }

  /**
   * Get trending posts with caching
   */
  async getTrendingPosts(limit?: number): Promise<BlogPost[]> {
    const cacheKey = `trending:${limit || 'default'}`;
    
    // Try to get from cache
    const cachedResult = this.caches.trendingPosts.get(cacheKey);
    if (cachedResult) {
      this.cacheStats.hits++;
      logger.debug('CachingBlogService: Cache hit for trending posts');
      return cachedResult;
    }
    
    // If not in cache, get from service
    this.cacheStats.misses++;
    logger.debug('CachingBlogService: Cache miss for trending posts');
    
    // Handle if getTrendingPosts is not implemented
    if (!this.service.getTrendingPosts) {
      return [];
    }
    
    const result = await this.service.getTrendingPosts(limit);
    
    // Cache the result
    this.caches.trendingPosts.set(cacheKey, result);
    
    return result;
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    logger.info('CachingBlogService: Clearing all caches');
    
    this.caches.posts.clear();
    this.caches.singlePost.clear();
    this.caches.categories.clear();
    this.caches.tags.clear();
    this.caches.relatedPosts.clear();
    this.caches.trendingPosts.clear();
    
    // Also clear underlying service cache if available
    this.service.clearCache?.();
    
    // Reset cache stats
    this.cacheStats.hits = 0;
    this.cacheStats.misses = 0;
    this.cacheStats.lastReset = Date.now();
  }

  /**
   * Clear specific caches by type
   */
  clearCacheByType(type: keyof typeof this.caches): void {
    logger.info(`CachingBlogService: Clearing ${type} cache`);
    this.caches[type].clear();
  }

  /**
   * Clear any caches related to a specific post
   */
  clearPostCache(postId: string): void {
    logger.debug(`Clearing cache for post: ${postId}`);
    
    // Clear the entire postBySlug cache since we can't easily find
    // which slug corresponds to the given post ID without fetching the post
    this.caches.singlePost.clear();
    
    // Clear related posts for this post ID
    this.caches.relatedPosts.delete(`related:${postId}:default`);
    
    // Clear posts list cache as it might contain this post
    this.caches.posts.clear();
  }

  /**
   * Get cache statistics for monitoring
   */
  getCacheStats(): { 
    hits: number; 
    misses: number; 
    cacheDetails: Record<string, { size: number }>
  } {
    return {
      hits: this.cacheStats.hits,
      misses: this.cacheStats.misses,
      cacheDetails: {
        posts: { size: this.caches.posts.size() },
        singlePost: { size: this.caches.singlePost.size() },
        categories: { size: this.caches.categories.size() },
        tags: { size: this.caches.tags.size() },
        relatedPosts: { size: this.caches.relatedPosts.size() },
        trendingPosts: { size: this.caches.trendingPosts.size() }
      }
    };
  }

  /**
   * Preload common data that will likely be needed
   */
  async preloadCommonData(): Promise<void> {
    logger.info('CachingBlogService: Preloading common data');
    
    try {
      // Preload latest posts (no filters)
      await this.getPosts();
      
      // Preload categories and tags
      await this.getCategories();
      await this.getTags();
      
      // Preload trending posts
      await this.getTrendingPosts();
      
      logger.info('CachingBlogService: Preloading completed successfully');
    } catch (error) {
      logger.error('CachingBlogService: Error preloading common data', { 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  }

  async getConnectionStatus(): Promise<{ isConnected: boolean; lastChecked: number; error?: string }> {
    return this.service.getConnectionStatus();
  }
}

/**
 * Create a caching blog service with the given options
 * @param service The underlying blog service to wrap
 * @param options Cache configuration options
 * @returns A caching blog service instance
 */
export function createCachingBlogService(
  service: BlogServiceInterface = blogService,
  options: BlogCacheOptions = {}
): CachingBlogService {
  return new CachingBlogService(service, options);
}

// Export a singleton instance with default options
export const cachingBlogService = createCachingBlogService();

// Also export the class for custom configuration
export default CachingBlogService; 