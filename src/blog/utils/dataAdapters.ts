import { 
  BlogPost, 
  BlogCategory, 
  BlogTag, 
  Author, 
  ContentFormat,
  TocItem,
  BlogImage,
  BlogFilters,
  SEOMetadata,
  PostStatus,
  RelatedPost
} from '../types/blog';
import logger from '../../utils/logger';
import { Document } from '@contentful/rich-text-types';

/**
 * Error types for data processing
 */
export enum DataErrorType {
  VALIDATION = 'validation_error',
  TRANSFORMATION = 'transformation_error',
  MISSING_FIELD = 'missing_field',
  TYPE_MISMATCH = 'type_mismatch',
  SERVICE_ERROR = 'service_error'
}

/**
 * Custom error class for data handling operations
 */
export class DataAdapterError extends Error {
  constructor(
    message: string,
    public type: DataErrorType,
    public field?: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'DataAdapterError';
    
    // Set the prototype explicitly
    Object.setPrototypeOf(this, DataAdapterError.prototype);
  }

  /**
   * Creates a formatted error message for logging
   */
  formatForLogging(): string {
    let message = `${this.type.toUpperCase()}: ${this.message}`;
    
    if (this.field) {
      message += ` (field: ${this.field})`;
    }

    if (this.originalError instanceof Error) {
      message += `\nOriginal error: ${this.originalError.message}`;
    }

    return message;
  }
}

/**
 * Type guards for all content types
 */

export function isBlogPost(obj: unknown): obj is BlogPost {
  if (!obj || typeof obj !== 'object') return false;
  
  const post = obj as Partial<BlogPost>;
  return (
    typeof post.id === 'string' &&
    typeof post.title === 'string' &&
    typeof post.slug === 'string' &&
    typeof post.content === 'string' &&
    typeof post.contentFormat === 'string' &&
    Array.isArray(post.authors) &&
    typeof post.readingTime === 'number'
  );
}

export function isBlogCategory(obj: unknown): obj is BlogCategory {
  if (!obj || typeof obj !== 'object') return false;
  
  const category = obj as Partial<BlogCategory>;
  return (
    typeof category.id === 'string' &&
    typeof category.name === 'string' &&
    typeof category.slug === 'string'
  );
}

export function isBlogTag(obj: unknown): obj is BlogTag {
  if (!obj || typeof obj !== 'object') return false;
  
  const tag = obj as Partial<BlogTag>;
  return (
    typeof tag.id === 'string' &&
    typeof tag.name === 'string' &&
    typeof tag.slug === 'string'
  );
}

export function isAuthor(obj: unknown): obj is Author {
  if (!obj || typeof obj !== 'object') return false;
  
  const author = obj as Partial<Author>;
  return (
    typeof author.id === 'string' &&
    typeof author.name === 'string'
  );
}

export function isBlogImage(obj: unknown): obj is BlogImage {
  if (!obj || typeof obj !== 'object') return false;
  
  const image = obj as Partial<BlogImage>;
  return typeof image.url === 'string';
}

export function isDocument(obj: unknown): obj is Document {
  if (!obj || typeof obj !== 'object') return false;
  
  const doc = obj as Partial<Document>;
  return (
    typeof doc.nodeType === 'string' &&
    Array.isArray(doc.content) &&
    doc.nodeType === 'document'
  );
}

export function isContentFormat(value: unknown): value is ContentFormat {
  return typeof value === 'string' && ['markdown', 'richText', 'html'].includes(value as string);
}

export function isPostStatus(value: unknown): value is PostStatus {
  return typeof value === 'string' && ['draft', 'published', 'archived'].includes(value as string);
}

/**
 * Normalizes date strings to ensure consistent format
 */
export function normalizeDate(date: string | Date | undefined): string | undefined {
  if (!date) return undefined;
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString();
  } catch (error) {
    logger.warn(`Failed to normalize date: ${date}`, error);
    return undefined;
  }
}

/**
 * Normalizes a blog post object to ensure consistent field names and data structure
 * across different data sources (Contentful, mock data, etc.)
 */
export function normalizeBlogPost(post: Record<string, any>): BlogPost {
  try {
    // Handle field name differences
    const publishDate = normalizeDate(post.publishDate || post.publishedAt || post.published_at || post.date);
    const modifiedDate = normalizeDate(post.modifiedDate || post.updatedAt || post.updated_at || post.lastUpdated);
    
    // Handle content formats
    let contentFormat: ContentFormat = 'markdown';
    if (post.contentFormat) {
      contentFormat = post.contentFormat;
    } else if (post.content_format) {
      contentFormat = post.content_format;
    } else if (isDocument(post.content)) {
      contentFormat = 'richText';
    } else if (post.content && post.content.includes('<')) {
      contentFormat = 'html';
    }
    
    // Normalize author data
    const authors = normalizeAuthors(post.authors || post.author);
    
    // Normalize category
    const category = normalizeCategory(post.category);
    
    // Normalize tags
    const tags = normalizeTags(post.tags);
    
    // Normalize cover image
    const coverImage = normalizeCoverImage(
      post.coverImage || post.heroImage || post.featuredImage || post.image
    );
    
    // Build normalized post object
    const normalizedPost: BlogPost = {
      id: post.id || post.sys?.id || '',
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || post.summary || '',
      content: typeof post.content === 'string' ? post.content : '',
      rawContent: post.rawContent || post.content,
      contentFormat,
      publishDate: publishDate || new Date().toISOString(),
      modifiedDate,
      authors,
      category,
      tags,
      coverImage,
      readingTime: typeof post.readingTime === 'number' ? post.readingTime : 0,
      featured: !!post.featured || !!post.isFeatured,
      status: isPostStatus(post.status) ? post.status : 'published',
      seo: normalizeSEO(post.seo || post.metadata),
      tocItems: Array.isArray(post.tocItems) ? post.tocItems : undefined,
      relatedPosts: Array.isArray(post.relatedPosts) ? post.relatedPosts : undefined
    };
    
    return normalizedPost;
  } catch (error) {
    const message = `Failed to normalize blog post: ${post.title || post.id || 'Unknown post'}`;
    logger.error(message, error);
    throw new DataAdapterError(
      message,
      DataErrorType.TRANSFORMATION,
      undefined,
      error
    );
  }
}

/**
 * Helper to normalize author data
 */
function normalizeAuthors(authorData: unknown): Author[] {
  if (!authorData) return [];
  
  try {
    if (Array.isArray(authorData)) {
      return authorData.map(author => {
        if (typeof author === 'string') {
          return { id: author, name: author };
        } else if (author && typeof author === 'object') {
          return {
            id: author.id || '',
            name: author.name || author.fullName || 'Unknown Author',
            bio: author.bio || author.biography || author.description,
            avatar: author.avatar || author.avatarUrl || author.image,
            email: author.email,
            social: author.social
          };
        }
        return { id: 'unknown', name: 'Unknown Author' };
      });
    } else if (typeof authorData === 'string') {
      return [{ id: authorData, name: authorData }];
    } else if (authorData && typeof authorData === 'object') {
      return [{
        id: (authorData as any).id || '',
        name: (authorData as any).name || (authorData as any).fullName || 'Unknown Author',
        bio: (authorData as any).bio || (authorData as any).biography || (authorData as any).description,
        avatar: (authorData as any).avatar || (authorData as any).avatarUrl || (authorData as any).image,
        email: (authorData as any).email,
        social: (authorData as any).social
      }];
    }
  } catch (error) {
    logger.warn('Failed to normalize author data', error);
  }
  
  return [];
}

/**
 * Helper to normalize category data
 */
function normalizeCategory(categoryData: unknown): BlogCategory | string {
  if (!categoryData) return 'Uncategorized';
  
  try {
    if (typeof categoryData === 'string') {
      return categoryData;
    } else if (categoryData && typeof categoryData === 'object') {
      return {
        id: (categoryData as any).id || '',
        name: (categoryData as any).name || 'Uncategorized',
        slug: (categoryData as any).slug || 'uncategorized',
        description: (categoryData as any).description
      };
    }
  } catch (error) {
    logger.warn('Failed to normalize category data', error);
  }
  
  return 'Uncategorized';
}

/**
 * Helper to normalize tags data
 */
function normalizeTags(tagsData: unknown): (BlogTag | string)[] {
  if (!tagsData) return [];
  
  try {
    if (Array.isArray(tagsData)) {
      return tagsData.map(tag => {
        if (typeof tag === 'string') {
          return tag;
        } else if (tag && typeof tag === 'object') {
          return {
            id: tag.id || '',
            name: tag.name || '',
            slug: tag.slug || tag.name?.toLowerCase().replace(/\s+/g, '-') || ''
          };
        }
        return '';
      }).filter(Boolean);
    } else if (typeof tagsData === 'string') {
      // Handle comma-separated tags
      return tagsData.split(',').map(tag => tag.trim()).filter(Boolean);
    }
  } catch (error) {
    logger.warn('Failed to normalize tags data', error);
  }
  
  return [];
}

/**
 * Helper to normalize image data
 */
function normalizeCoverImage(imageData: unknown): BlogImage | undefined {
  if (!imageData) return undefined;
  
  try {
    if (typeof imageData === 'string') {
      return { url: imageData };
    } else if (imageData && typeof imageData === 'object') {
      const img = imageData as any;
      return {
        url: img.url || img.src || '',
        alt: img.alt || img.altText || '',
        width: typeof img.width === 'number' ? img.width : undefined,
        height: typeof img.height === 'number' ? img.height : undefined,
        source: img.source,
        photographer: img.photographer || img.credit,
        photographerUrl: img.photographerUrl || img.creditUrl,
        caption: img.caption
      };
    }
  } catch (error) {
    logger.warn('Failed to normalize image data', error);
  }
  
  return undefined;
}

/**
 * Helper to normalize SEO metadata
 */
function normalizeSEO(seoData: unknown): SEOMetadata | undefined {
  if (!seoData) return undefined;
  
  try {
    if (seoData && typeof seoData === 'object') {
      const seo = seoData as any;
      return {
        title: seo.title || seo.metaTitle,
        description: seo.description || seo.metaDescription,
        canonicalUrl: seo.canonicalUrl || seo.canonical,
        noIndex: seo.noIndex || seo.noindex || false,
        ogImage: seo.ogImage || seo.openGraphImage || seo.socialImage,
        ogType: seo.ogType || seo.openGraphType || 'article',
        twitterCard: seo.twitterCard || 'summary_large_image',
        keywords: Array.isArray(seo.keywords) 
          ? seo.keywords 
          : (typeof seo.keywords === 'string' ? seo.keywords.split(',').map((k: string) => k.trim()) : [])
      };
    }
  } catch (error) {
    logger.warn('Failed to normalize SEO data', error);
  }
  
  return undefined;
}

/**
 * Batch normalize multiple blog posts
 */
export function normalizeBlogPosts(posts: Array<Record<string, any>>): BlogPost[] {
  return posts.map(post => {
    try {
      return normalizeBlogPost(post);
    } catch (error) {
      logger.warn(`Skipping post normalization due to error: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }).filter((post): post is BlogPost => post !== null);
}

/**
 * Normalize blog filters to ensure consistent handling across services
 */
export function normalizeBlogFilters(filters: Record<string, any>): BlogFilters {
  const normalizedFilters: BlogFilters = {};
  
  if (filters.category) normalizedFilters.category = filters.category;
  if (filters.tag) normalizedFilters.tag = filters.tag;
  if (filters.author) normalizedFilters.author = filters.author;
  if ('featured' in filters) normalizedFilters.featured = !!filters.featured;
  if (filters.search) normalizedFilters.search = filters.search;
  if (filters.status && isPostStatus(filters.status)) normalizedFilters.status = filters.status;
  
  // Handle sorting options
  if (filters.sortBy) {
    normalizedFilters.sortBy = 
      ['date', 'title', 'popularity'].includes(filters.sortBy) 
        ? filters.sortBy as 'date' | 'title' | 'popularity'
        : 'date';
  }
  
  if (filters.order) {
    normalizedFilters.order = 
      ['asc', 'desc'].includes(filters.order) 
        ? filters.order as 'asc' | 'desc'
        : 'desc';
  }
  
  return normalizedFilters;
}

/**
 * Creates an asset transformer function for use with transformContent
 * that fetches assets from Contentful
 */
export function createContentfulAssetTransformer(
  client: any, // Contentful client
  options?: {
    cacheTTL?: number; // Cache duration in milliseconds
    locale?: string;   // Content locale
  }
) {
  // Simple cache for assets
  const cache = new Map<string, { data: any; expiry: number }>();
  const cacheTTL = options?.cacheTTL || 5 * 60 * 1000; // 5 minutes default
  const locale = options?.locale || 'en-US';
  
  /**
   * Transform a Contentful asset to the format expected by transformContent
   */
  return async function transformAsset(assetId: string) {
    // Check cache first
    const now = Date.now();
    const cacheKey = `asset:${assetId}`;
    const cached = cache.get(cacheKey);
    
    if (cached && cached.expiry > now) {
      return cached.data;
    }
    
    try {
      // Fetch the asset from Contentful
      const asset = await client.getAsset(assetId);
      
      if (!asset || !asset.fields || !asset.fields.file) {
        throw new DataAdapterError(
          `Invalid asset structure for ${assetId}`,
          DataErrorType.MISSING_FIELD,
          'file'
        );
      }
      
      const { file } = asset.fields;
      const url = `https:${file.url}`;
      const alt = asset.fields.description?.[locale] || asset.fields.title?.[locale] || '';
      const contentType = file.contentType || '';
      
      // Create result object
      const result = {
        url,
        alt,
        contentType,
        width: file.details?.image?.width,
        height: file.details?.image?.height,
        title: asset.fields.title?.[locale] || '',
        description: asset.fields.description?.[locale] || ''
      };
      
      // Cache the result
      cache.set(cacheKey, {
        data: result,
        expiry: now + cacheTTL
      });
      
      return result;
    } catch (error) {
      if (error instanceof DataAdapterError) {
        throw error;
      }
      
      throw new DataAdapterError(
        `Failed to transform asset ${assetId}`,
        DataErrorType.TRANSFORMATION,
        undefined,
        error
      );
    }
  };
}

/**
 * Creates an entry transformer function for use with transformContent
 * that fetches entries from Contentful
 */
export function createContentfulEntryTransformer(
  client: any, // Contentful client
  options?: {
    cacheTTL?: number; // Cache duration in milliseconds
    locale?: string;   // Content locale
  }
) {
  // Simple cache for entries
  const cache = new Map<string, { data: any; expiry: number }>();
  const cacheTTL = options?.cacheTTL || 5 * 60 * 1000; // 5 minutes default
  const locale = options?.locale || 'en-US';
  
  /**
   * Transform a Contentful entry to the format expected by transformContent
   */
  return async function transformEntry(entryId: string, contentType: string) {
    // Check cache first
    const now = Date.now();
    const cacheKey = `entry:${contentType}:${entryId}`;
    const cached = cache.get(cacheKey);
    
    if (cached && cached.expiry > now) {
      return cached.data;
    }
    
    try {
      // Fetch the entry from Contentful
      const entry = await client.getEntry(entryId);
      
      if (!entry || !entry.fields) {
        throw new DataAdapterError(
          `Invalid entry structure for ${entryId}`,
          DataErrorType.MISSING_FIELD,
          'fields'
        );
      }
      
      // Create normalized fields object
      const normalizedFields: Record<string, any> = {};
      
      // Extract and normalize the fields
      Object.entries(entry.fields).forEach(([key, value]) => {
        // Handle localized fields
        if (value && typeof value === 'object' && locale in (value as any)) {
          normalizedFields[key] = (value as any)[locale];
        } else {
          normalizedFields[key] = value;
        }
      });
      
      // Cache the result
      cache.set(cacheKey, {
        data: normalizedFields,
        expiry: now + cacheTTL
      });
      
      return normalizedFields;
    } catch (error) {
      if (error instanceof DataAdapterError) {
        throw error;
      }
      
      throw new DataAdapterError(
        `Failed to transform entry ${entryId}`,
        DataErrorType.TRANSFORMATION,
        undefined,
        error
      );
    }
  };
} 