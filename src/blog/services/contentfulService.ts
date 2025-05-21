import { createClient, Entry, Asset, EntrySkeletonType, EntryCollection, ContentfulClientApi } from 'contentful';
import { Document } from '@contentful/rich-text-types';
import {
  BlogPost, 
  BlogImage, 
  BlogCategory, 
  BlogTag, 
  Author, 
  BlogFilters,
  ContentFormat
} from '../types/blog';
import {
  isTagEntry,
  isBlogPostEntry
} from '../types/contentful';
import { pexelsClient, PexelsImage, PexelsSearchParams } from '../../lib/pexels';
import { 
  extractHeadingsFromRichText,
  calculateReadingTime,
  generateExcerpt
} from '../utils/contentUtils';
import { environmentConfig } from '../../config/environment';
import logger from '../../utils/logger';

interface ConnectionStatus {
  isConnected: boolean;
  lastChecked: number;
  error?: string;
}

interface CacheItem<T> {
  data: T;
  expiry: number;
}

interface ContentfulConfig {
  spaceId: string;
  accessToken: string;
  environment?: string;
  cacheTTL?: number;
  enablePreviewMode?: boolean;
  defaultLocale?: string;
  previewToken?: string;
}

// Type for pagination options
interface PaginationOptions {
  skip?: number;
  limit?: number;
}

// Response type including pagination metadata
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
  hasNextPage: boolean;
}

// Define the type for Contentful QueryParams to avoid any
type ContentfulQueryParams = {
  content_type: string;
  order?: string | string[];
  limit?: number;
  skip?: number;
  [key: string]: unknown; // For additional query parameters
};

interface CacheStats {
  totalItems: number;
  totalSize: number;
  oldestItem: number;
  newestItem: number;
  hitCount: number;
  missCount: number;
  invalidationCount: number;
}

interface CacheMetrics {
  hits: number;
  misses: number;
  invalidations: number;
}

interface CacheDebugInfo {
  key: string;
  size: number;
  timestamp: number;
  ttl: number;
  isExpired: boolean;
  type: string;
}

interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000,    // 10 seconds
  backoffFactor: 2
};

export class ContentfulError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ContentfulError';
  }
}

class ContentfulService {
  private client: ContentfulClientApi<undefined>;
  private cache: Map<string, CacheItem<unknown>> = new Map();
  private cacheTTL: number; // in milliseconds
  private readonly defaultImageQueries: Record<string, string[]>;
  private readonly previewMode: boolean;
  private readonly defaultLocale: string;
  private initialized = false;
  private connectionStatus: ConnectionStatus = {
    isConnected: false,
    lastChecked: 0
  };

  // Rate limiting tracking
  private requestsInLastMinute = 0;
  private requestRateLimitTime = Date.now();
  private readonly MAX_REQUESTS_PER_MINUTE = 60; // Standard Contentful rate limit

  private cacheMetrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    invalidations: 0
  };

  private retryConfig: RetryConfig;
  private retryCount: number = 0;
  private lastError: Error | null = null;

  constructor(config: Partial<ContentfulConfig> = {}) {
    logger.debug('ContentfulService: Starting constructor initialization');
    
    try {
      // Get environment configuration
      const { contentful: envConfig } = environmentConfig;
      
      // Extract configuration values with priority:
      // 1. Constructor config
      // 2. Environment variables
      // 3. Default values
      const spaceId = config.spaceId || envConfig.spaceId;
      const accessToken = config.accessToken || envConfig.accessToken;
      const environment = config.environment || envConfig.environment || 'master';
      
      // Validate required configuration
      if (!spaceId || !accessToken) {
        throw new Error('ContentfulService requires spaceId and accessToken');
      }

      // Log configuration (without sensitive data)
      logger.debug('ContentfulService configuration:', {
        spaceId,
        environment,
        hasAccessToken: !!accessToken,
        previewMode: config.enablePreviewMode ?? envConfig.usePreview,
        defaultLocale: config.defaultLocale || envConfig.defaultLocale
      });

      // Set instance properties
      this.previewMode = config.enablePreviewMode ?? envConfig.usePreview;
      this.defaultLocale = config.defaultLocale || envConfig.defaultLocale;
      this.cacheTTL = (config.cacheTTL || envConfig.cacheTTL) * 1000; // Convert to milliseconds
      
      // Initialize default image queries
      this.defaultImageQueries = {
        blog: ['article', 'writing', 'blog'],
        profile: ['portrait', 'professional', 'headshot'],
        hero: ['landscape', 'banner', 'hero'],
        thumbnail: ['preview', 'thumbnail', 'small']
      };

      // Initialize Contentful client with proper configuration
      const clientConfig = {
        space: spaceId,
        accessToken: this.previewMode && config.previewToken ? config.previewToken : accessToken,
        environment,
        host: this.previewMode ? 'preview.contentful.com' : undefined
      };

      logger.debug('Initializing Contentful client with config:', {
        space: clientConfig.space,
        environment: clientConfig.environment,
        previewMode: this.previewMode,
        host: clientConfig.host
      });

      this.client = createClient(clientConfig);

      // Initialize connection status
      this.connectionStatus = {
        isConnected: false,
        lastChecked: Date.now()
      };

      // Log successful initialization
      logger.debug('ContentfulService: Constructor initialization complete', {
        spaceId,
        environment,
        previewMode: this.previewMode,
        defaultLocale: this.defaultLocale,
        cacheTTL: this.cacheTTL
      });

      this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config.retryConfig };

    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error('ContentfulService: Constructor initialization failed', {
        error: message,
        config: {
          ...config,
          accessToken: '[REDACTED]',
          previewToken: '[REDACTED]'
        }
      });
      throw new Error(`Failed to initialize ContentfulService: ${message}`);
    }
  }

  /**
   * Ensures the service is initialized by checking connection to Contentful
   * @returns Promise resolving to true if initialization is successful
   */
  public async ensureInitialized(): Promise<boolean> {
    try {
      // First log that we're testing connection
      logger.debug('ContentfulService: Testing connection...', {
        previewMode: this.previewMode,
        initialized: this.initialized,
        spaceId: this.client.getSpace(),
        host: this.previewMode ? 'preview.contentful.com' : 'cdn.contentful.com'
      });
      
      // Check if we've already initialized
      if (this.initialized) {
        logger.debug('ContentfulService: Already initialized, skipping check');
        return true;
      }
      
      // Try to get any entry first to validate basic connectivity
      try {
        const testQuery = await this.client.getEntries({ limit: 1 });
        logger.info('ContentfulService: Successfully connected using generic query', {
          total: testQuery.total,
          includes: testQuery.includes,
          hasItems: testQuery.items.length > 0
        });

        // Update connection status
        this.connectionStatus = {
          isConnected: true,
          lastChecked: Date.now()
        };

        this.initialized = true;
        return true;

      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.error('ContentfulService: Failed to connect', { error: message });
        
        this.connectionStatus = {
          isConnected: false,
          lastChecked: Date.now(),
          error: message
        };
        
        return false;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error('ContentfulService: Initialization check failed', { error: message });
      
      this.connectionStatus = {
        isConnected: false,
        lastChecked: Date.now(),
        error: message
      };
      
      return false;
    }
  }

  /**
   * Gets the Contentful client instance, ensuring it's initialized first
   */
  async getClient(): Promise<ContentfulClientApi<undefined>> {
    await this.ensureInitialized();
    return this.client;
  }

  /**
   * Gets the current connection status
   */
  getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus };
  }

  /**
   * Checks if the service is ready to handle requests
   */
  isReady(): boolean {
    return this.initialized && this.connectionStatus.isConnected;
  }

  /**
   * Forces a reconnection attempt
   */
  async reconnect(): Promise<void> {
    this.initialized = false;
    this.connectionStatus.isConnected = false;
    await this.ensureInitialized();
  }

  // Update the getClient method to ensure initialization
  async getPosts(options?: {
    filters?: BlogFilters;
    pagination?: PaginationOptions;
  }): Promise<PaginatedResponse<BlogPost>> {
    await this.ensureInitialized();
    const filters = options?.filters || {};
    const pagination = options?.pagination || { skip: 0, limit: 10 };
    const cacheKey = this.getCacheKey('getPosts', { filters, pagination });
    
    logger.info('Fetching blog posts', { filters, pagination });
    
    return this.safeRequest(async () => {
      try {
        // Transform filters to Contentful query parameters
        const queryParams: ContentfulQueryParams = {
          content_type: 'blogpost',
          order: ['-fields.publishDate'],
          limit: pagination.limit,
          skip: pagination.skip
        };

        // Add category filter if specified
        if (filters.category) {
          queryParams['fields.category.sys.id'] = filters.category;
        }

        // Add tag filter if specified
        if (filters.tag) {
          queryParams['fields.tags.sys.id'] = filters.tag;
        }

        // Add author filter if specified
        if (filters.author) {
          queryParams['fields.authors.sys.id'] = filters.author;
        }

        // Add search filter if specified
        if (filters.search) {
          queryParams['query'] = filters.search;
        }

        // Add status filter if specified
        if (filters.status) {
          queryParams['fields.status'] = filters.status;
        }

        // Add date range filters if specified
        if (filters.dateFrom) {
          queryParams['fields.publishDate[gte]'] = filters.dateFrom;
        }
        if (filters.dateTo) {
          queryParams['fields.publishDate[lte]'] = filters.dateTo;
        }

        // Add sorting if specified
        if (filters.sortBy) {
          const orderField = filters.sortBy === 'title-az' || filters.sortBy === 'title-za' 
            ? 'fields.title' 
            : 'fields.publishDate';
          
          const orderDirection = filters.sortBy.includes('-za') || filters.sortBy === 'oldest' 
            ? '' 
            : '-';
          
          queryParams.order = [`${orderDirection}${orderField}`];
        }

        logger.debug('Contentful query parameters:', queryParams);

        const entries = await this.getEntries(queryParams);
        
        // Transform entries to blog posts
        const posts = await Promise.all(
          entries.items
            .filter(entry => isBlogPostEntry(entry))
            .map(entry => this.transformEntry(entry))
        );

        return {
          items: posts,
          total: entries.total,
          skip: entries.skip,
          limit: entries.limit,
          hasNextPage: entries.skip + entries.limit < entries.total
        };
      } catch (error) {
        logger.error('Failed to fetch blog posts from Contentful', error);
        throw new Error(`Failed to fetch blog posts: ${error instanceof Error ? error.message : String(error)}`);
      }
    }, cacheKey);
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    if (!slug) {
      logger.warn('getPostBySlug called with empty slug');
      return null;
    }
    
    const cacheKey = this.getCacheKey('getPostBySlug', { slug });
    logger.info(`Fetching post by slug: ${slug}`);
    
    return this.safeRequest(async () => {
      try {
        // Only query the blogpost content type
        const queryParams: ContentfulQueryParams = {
          content_type: 'blogpost',
          'fields.slug': slug,
          limit: 1
        };

        const entries = await this.client.getEntries(queryParams);

        if (entries.items.length > 0) {
          const post = await this.transformEntry(entries.items[0]);
          return post;
        }

        logger.info(`No post found with slug: ${slug}`);
        return null;
      } catch (error) {
        logger.error(`Error fetching post by slug ${slug}:`, error);
        throw error;
      }
    }, cacheKey);
  }

  async getCategories(pagination?: PaginationOptions): Promise<PaginatedResponse<BlogCategory>> {
    const cacheKey = this.getCacheKey('getCategories', pagination || {});
    
    return this.safeRequest(async () => {
      const pag = {
        limit: pagination?.limit || 100,
        skip: pagination?.skip || 0
      };
      
    try {
      const entries = await this.client.getEntries({
          content_type: 'category',
          order: ['fields.name'], // Use array format for order parameters
          limit: pag.limit,
          skip: pag.skip
      });

        const categories = await Promise.all(
          entries.items
            .filter(entry => entry.sys.contentType.sys.id === 'category')
            .map(entry => ({
        id: entry.sys.id,
              name: entry.fields.name as string || 'Unnamed Category',
              slug: entry.fields.slug as string || entry.sys.id,
              description: entry.fields.description as string || undefined
            }))
        );
        
        return {
          items: categories,
          total: entries.total,
          skip: entries.skip,
          limit: entries.limit,
          hasNextPage: entries.skip + entries.limit < entries.total
        };
    } catch (error) {
        logger.error('Failed to fetch blog categories from Contentful', error);
        throw new Error(`Failed to fetch blog categories: ${error instanceof Error ? error.message : String(error)}`);
      }
    }, cacheKey);
  }

  async getTags(pagination?: PaginationOptions): Promise<PaginatedResponse<BlogTag>> {
    const cacheKey = this.getCacheKey('getTags', pagination || {});
    
    return this.safeRequest(async () => {
      const pag = {
        limit: pagination?.limit || 100,
        skip: pagination?.skip || 0
      };
      
    try {
      const entries = await this.client.getEntries({
          content_type: 'tag',
          order: ['fields.name'], // Use array format for order parameters
          limit: pag.limit,
          skip: pag.skip
      });

        const tags = await Promise.all(
          entries.items
            .filter(entry => entry.sys.contentType.sys.id === 'tag')
            .map(entry => ({
        id: entry.sys.id,
            name: entry.fields.name as string || 'Unnamed Tag',
            slug: entry.fields.slug as string || entry.sys.id,
          }))
        );
        
        return {
          items: tags,
          total: entries.total,
          skip: entries.skip,
          limit: entries.limit,
          hasNextPage: entries.skip + entries.limit < entries.total
        };
    } catch (error) {
        logger.error('Failed to fetch blog tags from Contentful', error);
        throw new Error(`Failed to fetch blog tags: ${error instanceof Error ? error.message : String(error)}`);
      }
    }, cacheKey);
  }

  async getAuthors(pagination?: PaginationOptions): Promise<PaginatedResponse<Author>> {
    const cacheKey = this.getCacheKey('getAuthors', pagination || {});
    
    return this.safeRequest(async () => {
      const pag = {
        limit: pagination?.limit || 100,
        skip: pagination?.skip || 0
      };
      
    try {
      const entries = await this.client.getEntries({
          content_type: 'author',
          order: ['fields.name'], // Use array format for order parameters
          limit: pag.limit,
          skip: pag.skip
        });
        
        const authors = await Promise.all(
          entries.items
            .filter(entry => entry.sys.contentType.sys.id === 'author')
            .map(async entry => {
              let avatarUrl: string | undefined = undefined;
              
              if (entry.fields.avatar) {
                try {
                  const transformedAsset = await this.transformAsset(entry.fields.avatar as Asset);
                  avatarUrl = transformedAsset?.url;
    } catch (error) {
                  logger.warn(`Failed to transform avatar for author ${entry.sys.id}`, error);
                }
              }
              
              return {
        id: entry.sys.id,
                name: entry.fields.name as string || 'Unnamed Author',
                bio: entry.fields.bio as string || undefined,
                avatar: avatarUrl,
                email: entry.fields.email as string || undefined,
                social: typeof entry.fields.social === 'object' ? entry.fields.social : {}
              } as Author;
            })
        );
        
        return {
          items: authors,
          total: entries.total,
          skip: entries.skip,
          limit: entries.limit,
          hasNextPage: entries.skip + entries.limit < entries.total
        };
    } catch (error) {
        logger.error('Failed to fetch blog authors from Contentful', error);
        throw new Error(`Failed to fetch blog authors: ${error instanceof Error ? error.message : String(error)}`);
    }
    }, cacheKey);
  }

  async getRelatedPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
    const cacheKey = this.getCacheKey('getRelatedPosts', { postId: post.id, limit });
    
    // Check cache first
    const cached = this.getFromCache<BlogPost[]>(cacheKey);
    if (cached) return cached;
    
    try {
      logger.info(`Fetching related posts for: ${post.id}`);
      
      // Get category ID if we have a category object
      const categoryId = typeof post.category !== 'string' ? post.category.id : undefined;
      
      const queryParams: Record<string, unknown> = {
        content_type: 'blogpost',
        limit
      };
      
      // Filter by category if available
      if (categoryId) {
        queryParams['fields.category.sys.id'] = categoryId;
      }
      
      // Exclude the current post
      queryParams['sys.id[ne]'] = post.id;

      const entries = await this.client.getEntries(queryParams);
      
      const relatedPosts = await Promise.all(
        entries.items
          .filter(entry => isBlogPostEntry(entry))
          .map(entry => this.transformEntry(entry))
      );
      
      // Cache the result
      this.saveToCache(cacheKey, relatedPosts);
      
      logger.info(`Fetched ${relatedPosts.length} related posts`);
      return relatedPosts;
      
    } catch (error) {
      logger.error(`Error fetching related posts for ${post.id}:`, error);
      return [];
    }
  }

  async searchPosts(query: string, pagination?: PaginationOptions): Promise<PaginatedResponse<BlogPost>> {
    if (!query.trim()) {
      logger.warn('Empty search query provided');
      return {
        items: [],
        total: 0,
        skip: pagination?.skip || 0,
        limit: pagination?.limit || 10,
        hasNextPage: false
      };
    }
    
    // Don't cache search results to ensure freshness
    try {
      logger.info(`Searching posts with query: "${query}"`);
      
      const entries = await this.client.getEntries({
        content_type: 'blogpost',
        query: query.trim(),
        limit: pagination?.limit || 10,
        skip: pagination?.skip || 0
      });

      const posts = await Promise.all(
        entries.items
          .filter(entry => isBlogPostEntry(entry))
          .map(entry => this.transformEntry(entry))
      );
      
      const response: PaginatedResponse<BlogPost> = {
        items: posts,
        total: entries.total,
        skip: entries.skip,
        limit: entries.limit,
        hasNextPage: (entries.skip + entries.limit) < entries.total
      };
      
      logger.info(`Search returned ${posts.length} results for query "${query}"`);
      return response;
      
    } catch (error) {
      logger.error(`Error searching posts with query "${query}":`, error);
      return {
        items: [],
        total: 0,
        skip: pagination?.skip || 0,
        limit: pagination?.limit || 10,
        hasNextPage: false
      };
    }
  }

  async getTrendingPosts(limit = 5): Promise<BlogPost[]> {
    const cacheKey = this.getCacheKey('getTrendingPosts', { limit });
    
    return this.safeRequest(async () => {
      logger.debug(`Fetching trending posts (limit: ${limit})`);
      
    try {
      const entries = await this.client.getEntries({
        content_type: 'blogpost',
        order: ['-fields.publishDate'], // Use array format for order parameters
        limit
      });

        const posts = await Promise.all(
        entries.items
            .filter(entry => isBlogPostEntry(entry))
          .map(entry => this.transformEntry(entry))
      );
        
        // Cache the result with shorter TTL (1 hour)
        const cacheItem: CacheItem<BlogPost[]> = {
          data: posts,
          expiry: Date.now() + (60 * 60 * 1000) // 1 hour
        };
        this.cache.set(cacheKey, cacheItem);
        
        logger.info(`Fetched ${posts.length} trending posts`);
        return posts;
        
    } catch (error) {
        logger.error('Error fetching trending posts:', error);
      return [];
    }
    }, cacheKey);
  }

  /**
   * Detects content format from content data
   * @param content Content to analyze
   * @returns Detected ContentFormat ('richText', 'markdown', or 'html')
   */
  private detectContentFormat(content: unknown): ContentFormat {
    // Check for rich text document
    if (
      content &&
      typeof content === 'object' &&
      'nodeType' in content &&
      content.nodeType === 'document' &&
      'content' in content &&
      Array.isArray(content.content)
    ) {
      logger.debug('Content format detected: richText (object)');
      return 'richText';
    }
    
    // Check for rich text JSON string
    if (typeof content === 'string') {
      try {
        const parsed = JSON.parse(content);
        if (
          parsed &&
          typeof parsed === 'object' &&
          parsed.nodeType === 'document' &&
          Array.isArray(parsed.content)
        ) {
          logger.debug('Content format detected: richText (JSON string)');
          return 'richText';
        }
      } catch {
        // Not a JSON string, continue with other checks
      }
      
      // Check for HTML (look for HTML tags)
      const htmlRegex = /<\/?[a-z][\s\S]*>/i;
      if (htmlRegex.test(content)) {
        logger.debug('Content format detected: html');
        return 'html';
      }
      
      // Check for markdown (look for common markdown patterns)
      const markdownPatterns = [
        /^#\s+/m,          // Headers
        /\*\*(.*?)\*\*/,   // Bold
        /\*(?!\*)(.*?)\*/,  // Italic
        /```[\s\S]*?```/,  // Code blocks
        /\[.*?\]\(.*?\)/,  // Links
        /^\s*[-*+]\s+/m,   // Unordered lists
        /^\s*\d+\.\s+/m,   // Ordered lists
      ];
      
      if (markdownPatterns.some(pattern => pattern.test(content))) {
        logger.debug('Content format detected: markdown');
        return 'markdown';
      }
      
      // Default to markdown for plain text
      logger.debug('Content format defaulting to markdown (plain text)');
      return 'markdown';
    }
    
    // Default for unknown content type
    logger.warn('Unknown content format, defaulting to markdown');
    return 'markdown';
  }

  // Cache management methods
  private getCacheKey(method: string, params: object): string {
    return `${method}:${JSON.stringify(params)}`;
  }

  private getFromCache<T>(key: string): T | null {
    const item = this.cache.get(key);
    const now = Date.now();

    if (!item) {
      this.cacheMetrics.misses++;
      return null;
    }

    if (item.expiry < now) {
      this.cache.delete(key);
      this.cacheMetrics.misses++;
      return null;
    }

    this.cacheMetrics.hits++;
    return item.data as T;
  }

  private saveToCache<T>(key: string, data: T, customTTL?: number): void {
    const ttl = customTTL || this.cacheTTL;
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });

    // Clean cache if it's getting too large
    if (this.cache.size > 1000) {
      this.cleanCache();
    }
  }

  // Method to clear the entire cache
  public clearCache(): void {
    logger.info(`Clearing entire cache with ${this.cache.size} entries`);
    this.cache.clear();
  }

  // Method to clear specific cache entries by prefix
  public clearCacheByPrefix(prefix: string): void {
    logger.info(`Clearing cache entries with prefix: ${prefix}`);
    const keysToDelete = Array.from(this.cache.keys())
      .filter(key => key.startsWith(prefix));
    
    keysToDelete.forEach(key => this.cache.delete(key));
    logger.info(`Cleared ${keysToDelete.length} cache entries`);
  }

  // Rate limiting protection method
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    
    // Reset counter if a minute has passed
    if (now - this.requestRateLimitTime > 60000) {
      this.requestsInLastMinute = 0;
      this.requestRateLimitTime = now;
    }
    
    this.requestsInLastMinute++;
    
    // If we're approaching the rate limit, add a delay
    if (this.requestsInLastMinute >= this.MAX_REQUESTS_PER_MINUTE * 0.8) {
      logger.warn(`Approaching rate limit: ${this.requestsInLastMinute}/${this.MAX_REQUESTS_PER_MINUTE} requests`);
      // Add a delay to spread out requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // If we've hit the rate limit, wait until the minute is up
    if (this.requestsInLastMinute >= this.MAX_REQUESTS_PER_MINUTE) {
      const timeToWait = 60000 - (now - this.requestRateLimitTime) + 100; // Add 100ms buffer
      logger.warn(`Rate limit hit, waiting ${timeToWait}ms before next request`);
      await new Promise(resolve => setTimeout(resolve, timeToWait));
      this.requestsInLastMinute = 0;
      this.requestRateLimitTime = Date.now();
    }
  }

  // Safe API request method with rate limiting, retries, and error handling
  private async safeRequest<T>(requestFn: () => Promise<T>, cacheKey?: string, retries = 2): Promise<T> {
    // Check cache first if cacheKey is provided
    if (cacheKey) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached) return cached;
    }
    
    // Enforce rate limits
    await this.enforceRateLimit();
    
    try {
      const result = await requestFn();
      
      // Cache the result if cacheKey is provided
      if (cacheKey) {
        this.saveToCache(cacheKey, result);
      }
      
      return result;
    } catch (error) {
      if (retries > 0) {
        const isRateLimitError = error instanceof Error && 
          error.message.includes('Rate limit') || 
          (error as Error & {sys?: {id?: string}})?.sys?.id === 'RateLimitExceeded';
        
        // For rate limit errors, wait longer
        const retryDelay = isRateLimitError ? 2000 : 500;
        
        logger.warn(
          `Request failed, retrying in ${retryDelay}ms (${retries} retries left): ${error instanceof Error ? error.message : String(error)}`
        );
        
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return this.safeRequest(requestFn, cacheKey, retries - 1);
      }
      
      // Out of retries, log and throw
      logger.error('API request failed after retries', error);
      throw error;
    }
  }

  // Determine the most appropriate content type for a fallback query
  private detectContentType(query: string): keyof typeof this.defaultImageQueries {
    const queryLower = query.toLowerCase();
    
    // Check for technology-related terms
    const techTerms = ['software', 'programming', 'code', 'tech', 'development', 'app', 'digital', 'data', 'cloud', 'ai'];
    if (techTerms.some(term => queryLower.includes(term))) {
      return 'technology';
    }
    
    // Check for business-related terms
    const businessTerms = ['business', 'company', 'corporate', 'management', 'strategy', 'leadership', 'enterprise', 'office'];
    if (businessTerms.some(term => queryLower.includes(term))) {
      return 'business';
    }
    
    // Check for marketing-related terms
    const marketingTerms = ['marketing', 'social media', 'content', 'campaign', 'brand', 'advertising', 'engagement', 'audience'];
    if (marketingTerms.some(term => queryLower.includes(term))) {
      return 'marketing';
    }
    
    // Default to the provided type
    return 'blog';
  }
  
  // Enhanced asset transformation with improved Pexels fallback
  private async transformAsset(
    asset: Asset | undefined,
    fallbackQuery?: string,
    type: keyof typeof this.defaultImageQueries = 'blog'
  ): Promise<BlogImage | undefined> {
    try {
      const cacheKey = `asset_${asset ? asset.sys.id : 'fallback'}_${fallbackQuery || ''}_${type}`;
      const cached = this.getFromCache<BlogImage>(cacheKey);
      
      if (cached) {
        logger.debug(`Returning cached asset: ${cacheKey}`);
        return cached;
      }
      
      // If we have a valid Contentful asset, transform it
      if (asset && 'fields' in asset && asset.fields && 'file' in asset.fields) {
        logger.debug(`Transforming Contentful asset: ${asset.sys.id}`);
        const file = asset.fields.file;
        
        if (file && typeof file === 'object' && 'url' in file) {
          const blogImage: BlogImage = {
        url: `https:${file.url}`,
            alt: typeof asset.fields.description === 'string' 
              ? asset.fields.description 
              : (typeof asset.fields.title === 'string' ? asset.fields.title : ''),
            width: file.details && typeof file.details === 'object' && 
              'image' in file.details && file.details.image ? 
              file.details.image.width : undefined,
            height: file.details && typeof file.details === 'object' && 
              'image' in file.details && file.details.image ? 
              file.details.image.height : undefined,
        source: 'contentful'
      };
          
          this.saveToCache(cacheKey, blogImage);
          return blogImage;
        }
      }
      
      // If no asset or invalid, try to get a fallback image
      if (fallbackQuery) {
        logger.debug(`Fetching fallback image from Pexels for query: ${fallbackQuery}`);
        
        try {
          // Detect content type from the fallback query
          const detectedType = this.detectContentType(fallbackQuery);
          const effectiveType = detectedType || type;
          
          logger.debug(`Detected content type: ${detectedType} for query "${fallbackQuery}"`);
          
          // Prepare array of relevant queries for better matches
          const relevantQueries = this.getRelevantQueries(fallbackQuery);
          
          // Try each query in sequence until we find a match
          for (let i = 0; i < relevantQueries.length; i++) {
            const query = relevantQueries[i];
            
            // Use different search strategies based on position in the relevance list
            const searchParams: PexelsSearchParams = {
              query,
              per_page: i === 0 ? 5 : 1, // Get more options for the primary query
              size: 'medium',
              // Add orientation based on type
              orientation: effectiveType === 'author' ? 'square' : 'landscape'
            };
            
            try {
              const result = await pexelsClient.searchImages(searchParams);
              
              if (result.images.length > 0) {
                // For primary query, select the most relevant image
                const photo = i === 0 && result.images.length > 1
                  ? this.selectMostRelevantImage(result.images, fallbackQuery)
                  : result.images[0];
                
                logger.debug(`Found fallback image: ${photo.id} using query "${query}"`);
                
                const blogImage: BlogImage = {
                  url: photo.src.medium,
                  alt: photo.alt || fallbackQuery,
                  width: photo.width,
                  height: photo.height,
                  source: 'pexels',
                  photographer: photo.photographer,
                  photographerUrl: photo.photographerUrl,
                  caption: `Photo by ${photo.photographer} on Pexels`
                };
                
                this.saveToCache(cacheKey, blogImage);
                return blogImage;
              }
            } catch (searchError) {
              logger.warn(`Failed to search for "${query}": ${searchError instanceof Error ? searchError.message : String(searchError)}`);
              // Continue to next query
              continue;
            }
          }
          
          // If no images found with specific queries, try curated photos as last resort
          try {
            const curated = await pexelsClient.getCuratedPhotos(1, 1);
            if (curated.images.length > 0) {
              const photo = curated.images[0];
              logger.debug(`Using curated fallback image: ${photo.id}`);
              
              const blogImage: BlogImage = {
                url: photo.src.medium,
                alt: fallbackQuery || 'Featured image',
                width: photo.width,
                height: photo.height,
          source: 'pexels',
                photographer: photo.photographer,
                photographerUrl: photo.photographerUrl,
                caption: `Photo by ${photo.photographer} on Pexels`
              };
              
              this.saveToCache(cacheKey, blogImage);
              return blogImage;
            }
          } catch (curatedError) {
            logger.warn(`Failed to fetch curated photo: ${curatedError instanceof Error ? curatedError.message : String(curatedError)}`);
          }
        } catch (error) {
          logger.warn(`Failed to fetch any fallback image for "${fallbackQuery}":`, error);
        }
      }
      
      // Default placeholder image if nothing else worked
      const placeholder: BlogImage = {
        url: '/images/placeholder.jpg',
        alt: fallbackQuery || 'Placeholder image',
        width: 800,
        height: 600,
        source: 'other'
      };
      
      this.saveToCache(cacheKey, placeholder);
      return placeholder;
      } catch (error) {
      logger.error(`Error transforming asset:`, error);
      return {
        url: '/images/placeholder.jpg',
        alt: 'Error loading image',
        width: 800,
        height: 600,
        source: 'other'
      };
    }
  }
  
  // Helper method to generate relevant queries based on fallback query
  private getRelevantQueries(query: string): string[] {
    const parts = query.toLowerCase().split(/\s+/).filter(Boolean);
    
    return parts.reduce((acc: string[], part) => {
      if (part.length >= 3) {
        acc.push(part);
      }
      return acc;
    }, []);
  }
  
  // Select the most relevant image from a set of candidates
  private selectMostRelevantImage(images: PexelsImage[], query: string): PexelsImage {
    if (images.length <= 1) return images[0];
    
    // Convert query to lowercase for comparison
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/);
    
    // Score each image for relevance
    const scoredImages = images.map(image => {
      let score = 0;
      
      // Check if alt text contains query words
      const alt = (image.alt || '').toLowerCase();
      queryWords.forEach(word => {
        if (alt.includes(word)) score += 2;
      });
      
      // Prefer landscape for blog images
      if (image.width > image.height) score += 1;
      
      // Prefer higher resolution images
      score += (image.width * image.height) / 1000000; // Add points based on megapixels
      
      return { image, score };
    });
    
    // Sort by score (highest first) and return the best match
    scoredImages.sort((a, b) => b.score - a.score);
    return scoredImages[0].image;
  }

  // Enhanced entry transformation with improved error handling and logging
  private async transformEntry(entry: Entry<EntrySkeletonType>): Promise<BlogPost> {
    if (!entry || !entry.sys || !entry.fields) {
      logger.error('Invalid entry provided to transformEntry');
      throw new Error('Invalid entry structure');
    }

    // Verify that this is a blog post entry
    if (!isBlogPostEntry(entry)) {
      logger.error(`Entry is not a blog post: ${entry.sys.id}, type: ${entry.sys.contentType?.sys.id}`);
      throw new Error(`Entry ${entry.sys.id} is not a blog post`);
    }
    
    logger.debug(`Transforming blog post entry: ${entry.sys.id}`);
    
    // Cast the fields to a simple Record to avoid TypeScript errors
    const entryFields = entry.fields as Record<string, unknown>;
    
    // Extract the raw content from the entry (might be richText, markdown, or HTML)
    const rawContent = entryFields.content;
    
    // Detect the content format
    const contentFormat = this.detectContentFormat(rawContent);
    logger.debug(`Detected content format for entry ${entry.sys.id}: ${contentFormat}`);

    // Convert content to plain text for reading time calculation
    let plainTextContent = '';
    if (contentFormat === 'richText' && rawContent && typeof rawContent === 'object') {
      // Extract text content from Rich Text nodes recursively
      const extractText = (nodes: unknown[]): string => {
        if (!Array.isArray(nodes)) return '';
        return nodes.reduce((text: string, node: unknown) => {
          // Safe type checking
          if (node && typeof node === 'object') {
            const typedNode = node as {nodeType?: string; value?: string; content?: unknown[]};
            
            if (typedNode.nodeType === 'text' && typedNode.value) {
              return text + String(typedNode.value || ''); // Ensure value is a string and handle undefined
            }
            
            if (typedNode.content) {
              return text + extractText(typedNode.content);
            }
          }
          return text;
        }, '');
      };
      
      // Use a type assertion to treat the content as unknown[] first
      const richTextContent = (rawContent as {content?: unknown[]}).content || [];
      plainTextContent = extractText(richTextContent);
    } else {
      plainTextContent = String(rawContent || '') as string;
    }
    
    // Extract timestamps
    const createdAt = new Date(entry.sys.createdAt).toISOString();
    const updatedAt = new Date(entry.sys.updatedAt).toISOString();
    
    // Process authors with error handling
    let authors: Author[] = [];
    try {
      const authorEntries = entryFields.authors;
      if (Array.isArray(authorEntries) && authorEntries.length > 0) {
        // Using Promise.all to process all authors in parallel
        const authorPromises = authorEntries.map(async (authorEntry) => {
          // Skip if not a valid entry
          if (!authorEntry || !authorEntry.sys || !authorEntry.fields) {
            return null;
          }
          
          // Author fields
          const authorFields = authorEntry.fields as Record<string, unknown>;
          
          // Create basic author object
          return {
            id: authorEntry.sys.id,
            name: String(authorFields.name || 'Unknown Author'),
            bio: authorFields.bio ? String(authorFields.bio) : undefined,
            avatar: authorFields.avatar ? await this.transformAsset(authorFields.avatar as Asset) : undefined,
            social: authorFields.social as Record<string, string> || {}
          };
        });
        
        // Filter out null values (invalid entries)
        authors = (await Promise.all(authorPromises)).filter(Boolean) as Author[];
      }
    } catch (error) {
      logger.error(`Error processing authors for entry ${entry.sys.id}:`, error);
      // Default to empty array if processing fails
      authors = [];
    }
    
    // Process category
    logger.debug(`Processing category for entry: ${entry.sys.id}`);
    const categoryEntry = entryFields.category;
    let category: BlogCategory | string = 'Uncategorized';

    // Only attempt to process if categoryEntry exists and passes the type check
    if (categoryEntry && typeof categoryEntry === 'object' && 'sys' in categoryEntry) {
      // Check if it has the necessary properties before passing to isCategoryEntry
      const entry = categoryEntry as Entry<EntrySkeletonType>;
      if (entry.sys && entry.sys.contentType && entry.sys.contentType.sys && 
          entry.sys.contentType.sys.id === 'category') {
        category = {
          id: entry.sys.id,
          name: String(entry.fields.name || ''),
          slug: String(entry.fields.slug || ''),
          description: entry.fields.description ? 
            String(entry.fields.description) : undefined
        };
      }
    }
    
    // Process tags
    logger.debug(`Processing tags for entry: ${entry.sys.id}`);
    const tags = await Promise.all(
      (Array.isArray(entryFields.tags) ? entryFields.tags : [])
        .filter(isTagEntry)
        .map((tag: Entry<EntrySkeletonType>) => ({
          id: tag.sys.id,
          name: String(tag.fields.name || ''),
          slug: String(tag.fields.slug || '')
        }))
    );

    // Process cover image
    logger.debug(`Processing cover image for entry: ${entry.sys.id}`);
    const coverImage = await this.transformAsset(
      entryFields.coverImage as Asset,
      entryFields.title + (typeof category !== 'string' ? ` ${category.name}` : '') + 
      (tags.length ? ` ${tags[0].name}` : '')
    );

    // Construct the standardized blog post object
    return {
      id: entry.sys.id,
      title: String(entryFields.title || 'Untitled'),
      slug: String(entryFields.slug || entry.sys.id),
      excerpt: entryFields.excerpt ? String(entryFields.excerpt) : generateExcerpt(plainTextContent),
      content: plainTextContent,
      rawContent,
      contentFormat,
      publishDate: createdAt,
      modifiedDate: updatedAt,
      authors,
      category,
      tags,
      coverImage,
      readingTime: calculateReadingTime(plainTextContent),
      featured: Boolean(entryFields.featured) || false,
      status: 'published',
      tocItems: contentFormat === 'richText' ? extractHeadingsFromRichText(rawContent as Document) : []
    };
  }

  /** @private */
  calculateReadingTime(content: string): number {
    return calculateReadingTime(content);
  }

  /** @private */
  generateExcerptText(content: string, maxLength = 160): string {
    return generateExcerpt(content, maxLength);
  }

  /** @private */
  transformContentToString(rawContent: unknown): string {
    if (typeof rawContent === 'string') {
      return rawContent;
    }
    // Handle other cases or return a default
    return JSON.stringify(rawContent);
  }

  /** 
   * Creates an empty entry with required properties
   * @private 
   */
  createBaseEntry(): Entry<EntrySkeletonType> {
    // Create a minimal object with required properties
    const emptyEntry = {
      sys: {
        id: '',
        type: 'Entry',
        createdAt: '2020-01-01T00:00:00Z',
        updatedAt: '2020-01-01T00:00:00Z',
        locale: '',
        contentType: {
          sys: {
            id: '',
            type: 'Link',
            linkType: 'ContentType'
          }
        },
        revision: 0,
        space: {
          sys: {
            id: '',
            type: 'Link',
            linkType: 'Space'
          }
        },
        environment: {
          sys: {
            id: '',
            type: 'Link',
            linkType: 'Environment'
          }
        },
        // Add required properties for Entry
        publishedVersion: 1,
        publishedAt: '2020-01-01T00:00:00Z',
        firstPublishedAt: '2020-01-01T00:00:00Z',
        publishedCounter: 1
      },
      fields: {},
      metadata: {
        tags: []
      }
    };
    
    // Use the proper casting for safety
    return emptyEntry as unknown as Entry<EntrySkeletonType>;
  }

  /**
   * Helper method to get entries from Contentful with debug logging
   * @param query Query parameters for Contentful
   * @returns Contentful entries response
   */
  private async getEntries(query: ContentfulQueryParams): Promise<EntryCollection<EntrySkeletonType>> {
    try {
      const entries = await this.client.getEntries(query);
      
      // Add debug logging
      logger.debug(`Retrieved ${entries.items.length} entries from Contentful`);
      
      if (entries.items.length > 0) {
        entries.items.forEach((entry: Entry<EntrySkeletonType>) => {
          logger.debug(`Entry ID: ${entry.sys.id}, Content Type: ${entry.sys.contentType?.sys.id}`);
        });
      }
      
      return entries;
    } catch (error) {
      logger.error('Error fetching entries from Contentful:', error);
      throw error;
    }
  }

  /**
   * Gets cache statistics and metrics
   */
  public getCacheStats(): CacheStats {
    const totalItems = this.cache.size; // Use cache.size directly
    let totalSize = 0;
    let oldestItem = Date.now();
    const newestItem = 0; // Use const since it's never reassigned

    for (const item of this.cache.values()) {
      const itemSize = JSON.stringify(item.data).length;
      totalSize += itemSize;
      oldestItem = Math.min(oldestItem, item.expiry - this.cacheTTL);
    }

    return {
      totalItems,
      totalSize,
      oldestItem,
      newestItem: newestItem || Date.now(), // Provide a default value
      hitCount: this.cacheMetrics.hits,
      missCount: this.cacheMetrics.misses,
      invalidationCount: this.cacheMetrics.invalidations
    };
  }

  /**
   * Gets detailed debug information about cached items
   */
  public getCacheDebugInfo(): CacheDebugInfo[] {
    const now = Date.now();
    return Array.from(this.cache.entries()).map(([key, item]) => ({
      key,
      size: JSON.stringify(item.data).length,
      timestamp: item.expiry - this.cacheTTL,
      ttl: this.cacheTTL,
      isExpired: item.expiry < now,
      type: item.data?.constructor?.name || typeof item.data
    }));
  }

  /**
   * Invalidates cache entries that match the given pattern
   */
  public invalidateCache(pattern?: RegExp): number {
    let invalidatedCount = 0;
    
    if (!pattern) {
      invalidatedCount = this.cache.size;
      this.cache.clear();
      this.cacheMetrics.invalidations += invalidatedCount;
      logger.info(`Invalidated all ${invalidatedCount} cache entries`);
      return invalidatedCount;
    }

    for (const [key] of this.cache) {
      if (pattern.test(key)) {
        this.cache.delete(key);
        invalidatedCount++;
      }
    }

    if (invalidatedCount > 0) {
      this.cacheMetrics.invalidations += invalidatedCount;
      logger.info(`Invalidated ${invalidatedCount} cache entries matching pattern: ${pattern}`);
    }

    return invalidatedCount;
  }

  /**
   * Cleans up expired cache entries
   */
  public cleanCache(): number {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, item] of this.cache) {
      if (item.expiry < now) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.info(`Cleaned ${cleanedCount} expired cache entries`);
    }

    return cleanedCount;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateBackoff(attempt: number): number {
    const delay = Math.min(
      this.retryConfig.initialDelay * Math.pow(this.retryConfig.backoffFactor, attempt),
      this.retryConfig.maxDelay
    );
    return delay + (Math.random() * 1000); // Add jitter
  }

  private async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const backoff = this.calculateBackoff(attempt);
          logger.info(`Retry attempt ${attempt}/${this.retryConfig.maxRetries} after ${backoff}ms`);
          await this.delay(backoff);
        }

        const result = await operation();
        if (attempt > 0) {
          logger.info(`Operation succeeded after ${attempt} retries`);
        }
        this.retryCount = 0;
        this.lastError = null;
        return result;

      } catch (error) {
        lastError = error as Error;
        this.retryCount = attempt + 1;
        this.lastError = lastError;

        const shouldRetry = this.shouldRetryError(error) && attempt < this.retryConfig.maxRetries;
        
        if (!shouldRetry) {
          logger.error('Operation failed permanently:', {
            error,
            attempts: attempt + 1,
            maxRetries: this.retryConfig.maxRetries
          });
          throw this.enhanceError(lastError!);
        }

        logger.warn('Operation failed temporarily:', {
          error,
          attempt: attempt + 1,
          willRetry: true
        });
      }
    }

    throw this.enhanceError(lastError!);
  }

  private shouldRetryError(error: unknown): boolean {
    if (error instanceof Error) {
      // Retry on network errors
      if (error.message.includes('ECONNRESET') || 
          error.message.includes('ETIMEDOUT') ||
          error.message.includes('ENOTFOUND')) {
        return true;
      }

      // Retry on rate limits
      if (error.message.includes('429')) {
        return true;
      }

      // Retry on server errors
      if (error.message.includes('500') ||
          error.message.includes('502') ||
          error.message.includes('503') ||
          error.message.includes('504')) {
        return true;
      }
    }
    return false;
  }

  private enhanceError(error: Error): ContentfulError {
    const statusCode = this.extractStatusCode(error);
    const details = this.extractErrorDetails(error);
    
    return new ContentfulError(
      `Contentful operation failed after ${this.retryCount} attempts: ${error.message}`,
      statusCode,
      details
    );
  }

  private extractStatusCode(error: Error): number | undefined {
    const match = error.message.match(/status (\d{3})/i);
    return match ? parseInt(match[1], 10) : undefined;
  }

  private extractErrorDetails(error: unknown): unknown {
    if (error && typeof error === 'object' && 'sys' in error) {
      return error;
    }
    return undefined;
  }
}

export default ContentfulService; 