import { BlogPost, BlogCategory, BlogTag, Author, BlogImage } from '../types/blog';
import logger from '../../utils/logger';

// Custom error types
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DataTypeError extends ValidationError {
  constructor(field: string, expectedType: string, receivedType: string) {
    super(`Invalid type for ${field}: expected ${expectedType}, got ${receivedType}`);
    this.name = 'DataTypeError';
  }
}

export class RequiredFieldError extends ValidationError {
  constructor(field: string) {
    super(`Missing required field: ${field}`);
    this.name = 'RequiredFieldError';
  }
}

// Type guards
export const isBlogImage = (obj: unknown): obj is BlogImage => {
  if (!obj || typeof obj !== 'object') return false;
  
  const image = obj as Partial<BlogImage>;
  return typeof image.url === 'string' &&
    (image.alt === undefined || typeof image.alt === 'string') &&
    (image.width === undefined || typeof image.width === 'number') &&
    (image.height === undefined || typeof image.height === 'number');
};

export const isAuthor = (obj: unknown): obj is Author => {
  if (!obj || typeof obj !== 'object') return false;
  
  const author = obj as Partial<Author>;
  return typeof author.id === 'string' &&
    typeof author.name === 'string' &&
    (author.bio === undefined || typeof author.bio === 'string') &&
    (author.avatar === undefined || isBlogImage(author.avatar));
};

export const isBlogCategory = (obj: unknown): obj is BlogCategory => {
  if (!obj || typeof obj !== 'object') return false;
  
  const category = obj as Partial<BlogCategory>;
  return typeof category.id === 'string' &&
    typeof category.name === 'string' &&
    typeof category.slug === 'string';
};

export const isBlogTag = (obj: unknown): obj is BlogTag => {
  if (!obj || typeof obj !== 'object') return false;
  
  const tag = obj as Partial<BlogTag>;
  return typeof tag.id === 'string' &&
    typeof tag.name === 'string' &&
    typeof tag.slug === 'string';
};

// Validation functions
export const validateBlogPost = (post: unknown): BlogPost => {
  if (!post || typeof post !== 'object') {
    throw new ValidationError('Invalid blog post data');
  }

  const blogPost = post as Partial<BlogPost>;

  // Validate required fields
  if (!blogPost.id) throw new RequiredFieldError('id');
  if (!blogPost.title) throw new RequiredFieldError('title');
  if (!blogPost.slug) throw new RequiredFieldError('slug');

  // Validate field types
  if (typeof blogPost.title !== 'string') {
    throw new DataTypeError('title', 'string', typeof blogPost.title);
  }
  if (typeof blogPost.slug !== 'string') {
    throw new DataTypeError('slug', 'string', typeof blogPost.slug);
  }

  // Validate arrays and complex objects
  if (blogPost.authors && !Array.isArray(blogPost.authors)) {
    throw new DataTypeError('authors', 'array', typeof blogPost.authors);
  }
  if (blogPost.tags && !Array.isArray(blogPost.tags)) {
    throw new DataTypeError('tags', 'array', typeof blogPost.tags);
  }

  // Validate nested objects
  if (blogPost.coverImage && !isBlogImage(blogPost.coverImage)) {
    throw new ValidationError('Invalid cover image data');
  }
  if (blogPost.category && typeof blogPost.category !== 'string' && !isBlogCategory(blogPost.category)) {
    throw new ValidationError('Invalid category data');
  }

  // Return the validated post
  return blogPost as BlogPost;
};

export const validateBlogPosts = (posts: unknown[]): BlogPost[] => {
  if (!Array.isArray(posts)) {
    throw new ValidationError('Expected an array of blog posts');
  }
  
  return posts.map((post, index) => {
    try {
      return validateBlogPost(post);
    } catch (error) {
      logger.error(`Validation failed for post at index ${index}:`, error);
      throw error;
    }
  });
};

export const validateCategory = (category: unknown): BlogCategory => {
  if (!category || typeof category !== 'object') {
    throw new ValidationError('Invalid category data');
  }

  if (!isBlogCategory(category)) {
    throw new ValidationError('Invalid category structure');
  }

  return category;
};

export const validateCategories = (categories: unknown[]): BlogCategory[] => {
  if (!Array.isArray(categories)) {
    throw new ValidationError('Expected an array of categories');
  }
  
  return categories.map((category, index) => {
    try {
      return validateCategory(category);
    } catch (error) {
      logger.error(`Validation failed for category at index ${index}:`, error);
      throw error;
    }
  });
};

export const validateTag = (tag: unknown): BlogTag => {
  if (!tag || typeof tag !== 'object') {
    throw new ValidationError('Invalid tag data');
  }

  if (!isBlogTag(tag)) {
    throw new ValidationError('Invalid tag structure');
  }

  return tag;
};

export const validateTags = (tags: unknown[]): BlogTag[] => {
  if (!Array.isArray(tags)) {
    throw new ValidationError('Expected an array of tags');
  }
  
  return tags.map((tag, index) => {
    try {
      return validateTag(tag);
    } catch (error) {
      logger.error(`Validation failed for tag at index ${index}:`, error);
      throw error;
    }
  });
};

// Utility function to safely validate and transform data
export const safeValidate = <T>(
  data: unknown,
  validator: (data: unknown) => T,
  fallback: T
): T => {
  try {
    return validator(data);
  } catch (error) {
    logger.warn('Validation failed, using fallback:', error);
    return fallback;
  }
}; 