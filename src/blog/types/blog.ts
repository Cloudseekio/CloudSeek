import { Document } from '@contentful/rich-text-types';
import { z } from 'zod';

/**
 * Standardized Author interface
 */
export interface Author {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  email?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

/**
 * Standardized BlogCategory interface
 */
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number; // For UI purposes, showing number of posts in category
}

/**
 * Standardized BlogTag interface
 */
export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  count?: number; // For UI purposes, showing number of posts with tag
}

/**
 * Unified image interface that works with both Contentful assets and external images
 */
export interface BlogImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  source?: 'contentful' | 'pexels' | 'unsplash' | 'other';
  photographer?: string;
  photographerUrl?: string;
  caption?: string;
}

/**
 * Table of Contents item for navigation
 */
export interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

/**
 * Content format types supported by the blog system
 */
export type ContentFormat = 'richText' | 'markdown' | 'html';

/**
 * Publication status of a blog post
 */
export type PostStatus = 'draft' | 'published' | 'archived';

/**
 * SEO metadata for blog posts
 */
export interface SEOMetadata {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  ogImage?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  keywords?: string[];
}

/**
 * Related post reference
 */
export interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  type: 'related' | 'recommended' | 'popular';
}

/**
 * Standardized BlogPost interface that works with both mock data and CMS data
 */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  rawContent?: string | Document | unknown; // More flexible typing to handle various content forms
  contentFormat: ContentFormat;
  publishDate: string; // ISO format date string
  modifiedDate?: string; // ISO format date string
  authors: Author[];
  category: BlogCategory | string;
  tags: (BlogTag | string)[];
  coverImage?: BlogImage;
  readingTime: number;
  featured?: boolean;
  status?: PostStatus;
  seo?: SEOMetadata;
  tocItems?: TocItem[]; // For table of contents navigation
  relatedPosts?: RelatedPost[];
}

/**
 * Filters for querying blog posts
 */
export interface BlogFilters {
  category?: string;
  tag?: string;
  author?: string;
  sortBy?: 'newest' | 'oldest' | 'title-az' | 'title-za';
  featured?: boolean;
  search?: string;
}

/**
 * Checks if the given content is a Contentful Rich Text Document
 */
export const isRichTextDocument = (content: unknown): content is Document => {
  return content !== null && 
         typeof content === 'object' && 
         'nodeType' in content && 
         'content' in content;
};

/**
 * Type guard to check if a value is a proper author object or just a string
 */
export const isAuthorObject = (author: Author | string): author is Author => {
  return typeof author !== 'string' && 'id' in author;
};

/**
 * Type guard to check if a value is a proper category object or just a string
 */
export const isCategoryObject = (category: BlogCategory | string): category is BlogCategory => {
  return typeof category !== 'string' && 'id' in category;
};

/**
 * Type guard to check if a value is a proper tag object or just a string
 */
export const isTagObject = (tag: BlogTag | string): tag is BlogTag => {
  return typeof tag !== 'string' && 'id' in tag;
};

// Base Types
export type BlogStatus = 'draft' | 'published' | 'archived';
export type SortOrder = 'newest' | 'oldest' | 'title-az' | 'title-za';

// Image Schema
export const BlogImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  source: z.enum(['contentful', 'pexels', 'other']),
  photographer: z.string().optional(),
  photographerUrl: z.string().url().optional(),
  caption: z.string().optional()
});

export type BlogImage = z.infer<typeof BlogImageSchema>;

// Author Schema
export const AuthorSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  bio: z.string().optional(),
  avatar: BlogImageSchema.optional(),
  email: z.string().email().optional(),
  social: z.record(z.string().url()).optional()
});

export type Author = z.infer<typeof AuthorSchema>;

// Category Schema
export const BlogCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional()
});

export type BlogCategory = z.infer<typeof BlogCategorySchema>;

// Tag Schema
export const BlogTagSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1)
});

export type BlogTag = z.infer<typeof BlogTagSchema>;

// Blog Post Schema
export const BlogPostSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string(),
  rawContent: z.unknown(),
  contentFormat: z.enum(['richText', 'markdown', 'html']),
  publishDate: z.string().datetime(),
  modifiedDate: z.string().datetime(),
  authors: z.array(AuthorSchema),
  category: z.union([BlogCategorySchema, z.string()]),
  tags: z.array(BlogTagSchema),
  coverImage: BlogImageSchema.optional(),
  readingTime: z.number().min(1),
  featured: z.boolean(),
  status: z.enum(['draft', 'published', 'archived']),
  tocItems: z.array(z.object({
    id: z.string(),
    text: z.string(),
    level: z.number().min(1).max(6)
  })).optional()
});

export type BlogPost = z.infer<typeof BlogPostSchema>;

// Blog Filters Schema
export const BlogFiltersSchema = z.object({
  category: z.string().optional(),
  tag: z.string().optional(),
  author: z.string().optional(),
  search: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  sortBy: z.enum(['newest', 'oldest', 'title-az', 'title-za']).optional()
});

export type BlogFilters = z.infer<typeof BlogFiltersSchema>;

// Type Guards
export const isBlogImage = (value: unknown): value is BlogImage => {
  return BlogImageSchema.safeParse(value).success;
};

export const isAuthor = (value: unknown): value is Author => {
  return AuthorSchema.safeParse(value).success;
};

export const isBlogCategory = (value: unknown): value is BlogCategory => {
  return BlogCategorySchema.safeParse(value).success;
};

export const isBlogTag = (value: unknown): value is BlogTag => {
  return BlogTagSchema.safeParse(value).success;
};

export const isBlogPost = (value: unknown): value is BlogPost => {
  return BlogPostSchema.safeParse(value).success;
};

// Validation Results Type
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
}

// Validation Functions
export const validateBlogPost = (data: unknown): ValidationResult<BlogPost> => {
  const result = BlogPostSchema.safeParse(data);
  return {
    success: result.success,
    data: result.success ? result.data : undefined,
    errors: !result.success ? result.error : undefined
  };
};

export const validateBlogCategory = (data: unknown): ValidationResult<BlogCategory> => {
  const result = BlogCategorySchema.safeParse(data);
  return {
    success: result.success,
    data: result.success ? result.data : undefined,
    errors: !result.success ? result.error : undefined
  };
};

export const validateBlogTag = (data: unknown): ValidationResult<BlogTag> => {
  const result = BlogTagSchema.safeParse(data);
  return {
    success: result.success,
    data: result.success ? result.data : undefined,
    errors: !result.success ? result.error : undefined
  };
};

export const validateAuthor = (data: unknown): ValidationResult<Author> => {
  const result = AuthorSchema.safeParse(data);
  return {
    success: result.success,
    data: result.success ? result.data : undefined,
    errors: !result.success ? result.error : undefined
  };
};

export const validateBlogFilters = (data: unknown): ValidationResult<BlogFilters> => {
  const result = BlogFiltersSchema.safeParse(data);
  return {
    success: result.success,
    data: result.success ? result.data : undefined,
    errors: !result.success ? result.error : undefined
  };
};

// Helper Types
export type BlogPostId = BlogPost['id'];
export type BlogCategoryId = BlogCategory['id'];
export type BlogTagId = BlogTag['id'];
export type AuthorId = Author['id'];

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} 