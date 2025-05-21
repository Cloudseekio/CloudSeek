import { z } from 'zod';
import logger from '../../utils/logger';
import {
  BlogPost,
  BlogCategory,
  BlogTag,
  Author,
  BlogFilters,
  BlogPostSchema,
  BlogCategorySchema,
  BlogTagSchema,
  AuthorSchema,
  BlogFiltersSchema,
  ValidationResult,
  PaginationParams
} from '../types/blog';

export class ValidationError extends Error {
  constructor(
    message: string,
    public errors?: z.ZodError,
    public field?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }

  formatErrors(): string[] {
    if (!this.errors) return [this.message];
    return this.errors.errors.map(err => {
      const path = err.path.join('.');
      return `${path}: ${err.message}`;
    });
  }
}

export class ValidationService {
  private static instance: ValidationService;

  private constructor() {}

  static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  validateBlogPost(data: unknown): ValidationResult<BlogPost> {
    try {
      const result = BlogPostSchema.safeParse(data);
      if (!result.success) {
        logger.warn('Blog post validation failed:', {
          errors: result.error.errors
        });
      }
      return {
        success: result.success,
        data: result.success ? result.data : undefined,
        errors: !result.success ? result.error : undefined
      };
    } catch (error) {
      logger.error('Unexpected error during blog post validation:', error);
      throw new ValidationError(
        'Failed to validate blog post',
        error instanceof z.ZodError ? error : undefined
      );
    }
  }

  validateBlogCategory(data: unknown): ValidationResult<BlogCategory> {
    try {
      const result = BlogCategorySchema.safeParse(data);
      if (!result.success) {
        logger.warn('Blog category validation failed:', {
          errors: result.error.errors
        });
      }
      return {
        success: result.success,
        data: result.success ? result.data : undefined,
        errors: !result.success ? result.error : undefined
      };
    } catch (error) {
      logger.error('Unexpected error during blog category validation:', error);
      throw new ValidationError(
        'Failed to validate blog category',
        error instanceof z.ZodError ? error : undefined
      );
    }
  }

  validateBlogTag(data: unknown): ValidationResult<BlogTag> {
    try {
      const result = BlogTagSchema.safeParse(data);
      if (!result.success) {
        logger.warn('Blog tag validation failed:', {
          errors: result.error.errors
        });
      }
      return {
        success: result.success,
        data: result.success ? result.data : undefined,
        errors: !result.success ? result.error : undefined
      };
    } catch (error) {
      logger.error('Unexpected error during blog tag validation:', error);
      throw new ValidationError(
        'Failed to validate blog tag',
        error instanceof z.ZodError ? error : undefined
      );
    }
  }

  validateAuthor(data: unknown): ValidationResult<Author> {
    try {
      const result = AuthorSchema.safeParse(data);
      if (!result.success) {
        logger.warn('Author validation failed:', {
          errors: result.error.errors
        });
      }
      return {
        success: result.success,
        data: result.success ? result.data : undefined,
        errors: !result.success ? result.error : undefined
      };
    } catch (error) {
      logger.error('Unexpected error during author validation:', error);
      throw new ValidationError(
        'Failed to validate author',
        error instanceof z.ZodError ? error : undefined
      );
    }
  }

  validateBlogFilters(data: unknown): ValidationResult<BlogFilters> {
    try {
      const result = BlogFiltersSchema.safeParse(data);
      if (!result.success) {
        logger.warn('Blog filters validation failed:', {
          errors: result.error.errors
        });
      }
      return {
        success: result.success,
        data: result.success ? result.data : undefined,
        errors: !result.success ? result.error : undefined
      };
    } catch (error) {
      logger.error('Unexpected error during blog filters validation:', error);
      throw new ValidationError(
        'Failed to validate blog filters',
        error instanceof z.ZodError ? error : undefined
      );
    }
  }

  validatePaginationParams(params: unknown): ValidationResult<PaginationParams> {
    const PaginationSchema = z.object({
      page: z.number().min(1).optional(),
      limit: z.number().min(1).max(100).optional(),
      offset: z.number().min(0).optional()
    });

    try {
      const result = PaginationSchema.safeParse(params);
      if (!result.success) {
        logger.warn('Pagination params validation failed:', {
          errors: result.error.errors
        });
      }
      return {
        success: result.success,
        data: result.success ? result.data : undefined,
        errors: !result.success ? result.error : undefined
      };
    } catch (error) {
      logger.error('Unexpected error during pagination params validation:', error);
      throw new ValidationError(
        'Failed to validate pagination parameters',
        error instanceof z.ZodError ? error : undefined
      );
    }
  }

  validateSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug);
  }

  validateEmail(email: string): boolean {
    return AuthorSchema.shape.email.safeParse(email).success;
  }

  validateUrl(url: string): boolean {
    const urlSchema = z.string().url();
    return urlSchema.safeParse(url).success;
  }

  validateDateRange(from: string, to: string): boolean {
    try {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      return fromDate <= toDate;
    } catch {
      return false;
    }
  }
} 