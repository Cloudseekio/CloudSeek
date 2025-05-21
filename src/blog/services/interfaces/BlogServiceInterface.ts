import { BlogPost, BlogCategory, BlogTag } from '../../types/blog';

export interface PaginationOptions {
  limit?: number;
  skip?: number;
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
  featured?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
  hasNextPage: boolean;
}

export interface BlogServiceInterface {
  // Post operations
  getPosts(options?: { filters?: BlogFilters; pagination?: PaginationOptions }): Promise<PaginatedResponse<BlogPost>>;
  getPostBySlug(slug: string): Promise<BlogPost | null>;
  getRelatedPosts?(post: BlogPost, limit?: number): Promise<BlogPost[]>;
  getTrendingPosts?(limit?: number): Promise<BlogPost[]>;
  
  // Category operations
  getCategories(pagination?: PaginationOptions): Promise<PaginatedResponse<BlogCategory>>;
  
  // Tag operations
  getTags(pagination?: PaginationOptions): Promise<PaginatedResponse<BlogTag>>;
  
  // Service status
  getConnectionStatus(): Promise<{ isConnected: boolean; lastChecked: number; error?: string }>;
  initialize(): Promise<void>;
  
  // Cache operations
  clearCache?(): void;
} 