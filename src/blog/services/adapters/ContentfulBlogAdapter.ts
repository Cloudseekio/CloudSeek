import { BlogServiceInterface, PaginationOptions, BlogFilters, PaginatedResponse } from '../interfaces/BlogServiceInterface';
import { BlogPost, BlogCategory, BlogTag } from '../../types/blog';
import ContentfulService from '../contentfulService';
import logger from '../../../utils/logger';
import { Entry, EntrySkeletonType } from 'contentful';
import { calculateReadingTime } from '../../utils/contentUtils';
import { Document } from '@contentful/rich-text-types';

export class ContentfulBlogAdapter implements BlogServiceInterface {
  private contentfulService: ContentfulService;
  
  constructor(contentfulService: ContentfulService) {
    this.contentfulService = contentfulService;
  }
  
  async initialize(): Promise<void> {
    try {
      await this.contentfulService.ensureInitialized();
      logger.info('ContentfulBlogAdapter: Successfully initialized');
    } catch (error) {
      logger.error('ContentfulBlogAdapter: Failed to initialize', error);
      throw error;
    }
  }
  
  async getConnectionStatus(): Promise<{ isConnected: boolean; lastChecked: number; error?: string }> {
    return this.contentfulService.getConnectionStatus();
  }
  
  async getPosts(options?: { filters?: BlogFilters; pagination?: PaginationOptions }): Promise<PaginatedResponse<BlogPost>> {
    try {
      return await this.contentfulService.getPosts(options);
    } catch (error) {
      logger.error('ContentfulBlogAdapter: Failed to get posts', error);
      throw error;
    }
  }
  
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      return await this.contentfulService.getPostBySlug(slug);
    } catch (error) {
      logger.error(`ContentfulBlogAdapter: Failed to get post by slug ${slug}`, error);
      throw error;
    }
  }
  
  async getRelatedPosts(post: BlogPost, limit: number = 3): Promise<BlogPost[]> {
    try {
      return await this.contentfulService.getRelatedPosts(post, limit);
    } catch (error) {
      logger.error(`ContentfulBlogAdapter: Failed to get related posts for ${post.id}`, error);
      throw error;
    }
  }
  
  async getTrendingPosts(limit: number = 5): Promise<BlogPost[]> {
    try {
      return await this.contentfulService.getTrendingPosts(limit);
    } catch (error) {
      logger.error('ContentfulBlogAdapter: Failed to get trending posts', error);
      throw error;
    }
  }
  
  async getCategories(pagination?: PaginationOptions): Promise<PaginatedResponse<BlogCategory>> {
    try {
      return await this.contentfulService.getCategories(pagination);
    } catch (error) {
      logger.error('ContentfulBlogAdapter: Failed to get categories', error);
      throw error;
    }
  }
  
  async getTags(pagination?: PaginationOptions): Promise<PaginatedResponse<BlogTag>> {
    try {
      return await this.contentfulService.getTags(pagination);
    } catch (error) {
      logger.error('ContentfulBlogAdapter: Failed to get tags', error);
      throw error;
    }
  }
  
  clearCache(): void {
    try {
      this.contentfulService.clearCache();
      logger.info('ContentfulBlogAdapter: Cache cleared');
    } catch (error) {
      logger.error('ContentfulBlogAdapter: Failed to clear cache', error);
    }
  }

  async transformEntry(entry: Entry<EntrySkeletonType>): Promise<BlogPost> {
    if (!entry || !entry.sys || !entry.fields) {
      throw new Error('Invalid entry structure');
    }

    // Verify content type - only accept 'blogpost' content type now
    const contentTypeId = entry.sys.contentType?.sys.id;
    if (contentTypeId !== 'blogpost') {
      throw new Error(`Invalid content type: ${contentTypeId}. Expected 'blogpost'.`);
    }

    const fields = entry.fields;
    
    // Handle content properly based on its type
    const rawContent = fields.content || '';
    
    // Determine if content is Rich Text or plain text
    const isRichText = rawContent && 
                      typeof rawContent === 'object' && 
                      'nodeType' in rawContent && 
                      (rawContent as {nodeType: string}).nodeType === 'document';
    
    // Convert to plain text for reading time calculations
    let plainTextContent = '';
    
    if (isRichText) {
      // Extract text from Rich Text document recursively
      const extractText = (nodes: unknown): string => {
        if (!Array.isArray(nodes)) return '';
        
        return nodes.reduce((text, node) => {
          // Safe type checking
          if (node && typeof node === 'object' && 'nodeType' in node) {
            const typedNode = node as {nodeType: string; value?: string; content?: unknown};
            
            if (typedNode.nodeType === 'text' && typedNode.value) {
              return text + typedNode.value;
            }
            
            if (typedNode.content) {
              return text + extractText(typedNode.content);
            }
          }
          return text;
        }, '');
      };
      
      // Use document as unknown to avoid type conflicts
      const richTextDoc = rawContent as Document;
      plainTextContent = extractText(richTextDoc.content);
    } else {
      // If it's already a string or null/undefined, convert to string
      plainTextContent = String(rawContent || '');
    }
    
    return {
      id: entry.sys.id,
      title: String(fields.title || 'Untitled'),
      slug: String(fields.slug || entry.sys.id),
      content: plainTextContent,
      rawContent: rawContent,
      contentFormat: isRichText ? 'richText' : 'markdown',
      excerpt: String(fields.excerpt || ''),
      publishDate: entry.sys.createdAt,
      modifiedDate: entry.sys.updatedAt,
      authors: [],
      category: 'Uncategorized',
      tags: [],
      status: 'published',
      featured: Boolean(fields.featured) || false,
      readingTime: calculateReadingTime(plainTextContent),
      tocItems: []
    };
  }
} 