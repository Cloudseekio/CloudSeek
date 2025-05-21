import { BlogPost, BlogCategory, BlogTag, BlogFilters } from '../types/blog';
import { BlogServiceInterface, PaginatedResponse } from './interfaces/BlogServiceInterface';
import { mockBlogService } from './mockBlogService';
import { ContentfulBlogAdapter } from './adapters/ContentfulBlogAdapter';
import { getContentfulService } from './serviceFactory';
import logger from '../../utils/logger';

// Blog service class
class BlogService implements BlogServiceInterface {
  private config: {
    source: 'mock' | 'contentful';
  };
  private service: BlogServiceInterface;
  
  constructor(config: { source: 'mock' | 'contentful' } = { source: 'contentful' }) {
    this.config = config;
    
    // Initialize the appropriate service based on configuration
    if (this.config.source === 'contentful') {
      logger.info('BlogService: Initializing ContentfulBlogAdapter', {
        config: {
          ...config,
          source: config.source
        }
      });
      try {
        const contentfulService = getContentfulService();
        logger.debug('BlogService: Successfully created ContentfulService');
        this.service = new ContentfulBlogAdapter(contentfulService);
        logger.debug('BlogService: Successfully created ContentfulBlogAdapter');
      } catch (error) {
        const errorDetails = error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
          cause: error.cause
        } : error;
        logger.error('BlogService: Failed to initialize ContentfulBlogAdapter', { error: errorDetails });
        throw error;
      }
    } else {
      logger.info('BlogService: Using MockBlogService for development/testing');
      this.service = mockBlogService;
    }
  }
  
  async initialize(): Promise<void> {
    logger.debug('BlogService: Starting initialization');
    try {
      await this.service.initialize?.();
      logger.info('BlogService: Successfully initialized');
    } catch (error) {
      const errorDetails = error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      } : error;
      logger.error('BlogService: Failed to initialize', { error: errorDetails });
      throw error;
    }
  }

  async getConnectionStatus(): Promise<{ isConnected: boolean; lastChecked: number; error?: string }> {
    return this.service.getConnectionStatus();
  }
  
  // Public API methods
  async getPosts(options?: { filters?: BlogFilters }): Promise<PaginatedResponse<BlogPost>> {
    return this.service.getPosts(options);
  }
  
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    return this.service.getPostBySlug(slug);
  }
  
  async getCategories(): Promise<PaginatedResponse<BlogCategory>> {
    return this.service.getCategories();
  }
  
  async getTags(): Promise<PaginatedResponse<BlogTag>> {
    return this.service.getTags();
  }

  async getRelatedPosts(post: BlogPost): Promise<BlogPost[]> {
    return this.service.getRelatedPosts?.(post) || [];
  }
  
  async getTrendingPosts(limit: number = 5): Promise<BlogPost[]> {
    return this.service.getTrendingPosts?.(limit) || [];
  }

  clearCache(): void {
    this.service.clearCache?.();
  }
}

// Export a singleton instance
export const blogService = new BlogService({
  source: 'contentful'
});

// Also export the class for custom configuration
export default BlogService; 