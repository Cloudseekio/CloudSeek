import { BlogPost, BlogCategory, BlogTag, BlogFilters, Author } from '../types/blog';
import { BlogServiceInterface, PaginatedResponse, PaginationOptions } from './interfaces/BlogServiceInterface';

const mockAuthors: Author[] = [
  {
    id: '1',
    name: 'John Doe',
    bio: 'Senior Software Engineer with 10+ years of experience',
    avatar: 'https://i.pravatar.cc/150?u=john',
    social: {
      twitter: '@johndoe',
      linkedin: 'johndoe',
      github: 'johndoe'
    }
  },
  {
    id: '2',
    name: 'Jane Smith',
    bio: 'Tech Lead & Cloud Architecture Specialist',
    avatar: 'https://i.pravatar.cc/150?u=jane',
    social: {
      twitter: '@janesmith',
      linkedin: 'janesmith'
    }
  }
];

const mockCategories: BlogCategory[] = [
  {
    id: '1',
    name: 'Technology',
    slug: 'technology',
    description: 'Latest in tech and software development'
  },
  {
    id: '2',
    name: 'Cloud Computing',
    slug: 'cloud-computing',
    description: 'Cloud technologies and best practices'
  }
];

const mockTags: BlogTag[] = [
  {
    id: '1',
    name: 'React',
    slug: 'react'
  },
  {
    id: '2',
    name: 'TypeScript',
    slug: 'typescript'
  },
  {
    id: '3',
    name: 'Cloud',
    slug: 'cloud'
  }
];

const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with React and TypeScript',
    slug: 'getting-started-with-react-typescript',
    excerpt: 'Learn how to set up a new React project with TypeScript and best practices for type safety.',
    content: 'Full article content here...',
    contentFormat: 'markdown',
    publishDate: '2024-03-01T00:00:00Z',
    modifiedDate: '2024-03-01T00:00:00Z',
    authors: [mockAuthors[0]],
    category: mockCategories[0].id,
    tags: mockTags.slice(0, 2).map(tag => tag.id),
    readingTime: 5,
    featured: true,
    status: 'published',
    coverImage: {
      url: 'https://picsum.photos/800/400?random=1',
      alt: 'React and TypeScript code on a screen'
    }
  },
  {
    id: '2',
    title: 'Cloud Computing Fundamentals',
    slug: 'cloud-computing-fundamentals',
    excerpt: 'An introduction to cloud computing concepts and services.',
    content: 'Full article content here...',
    contentFormat: 'markdown',
    publishDate: '2024-03-02T00:00:00Z',
    modifiedDate: '2024-03-02T00:00:00Z',
    authors: [mockAuthors[1]],
    category: mockCategories[1].id,
    tags: [mockTags[2].id],
    readingTime: 8,
    featured: false,
    status: 'published',
    coverImage: {
      url: 'https://picsum.photos/800/400?random=2',
      alt: 'Cloud computing diagram'
    }
  },
  {
    id: '3',
    title: 'Advanced TypeScript Patterns',
    slug: 'advanced-typescript-patterns',
    excerpt: 'Deep dive into advanced TypeScript patterns and best practices.',
    content: 'Full article content here...',
    contentFormat: 'markdown',
    publishDate: '2024-03-15T10:30:00Z',
    modifiedDate: '2024-03-15T10:30:00Z',
    authors: [mockAuthors[0]],
    category: mockCategories[0].id,
    tags: mockTags.slice(0, 2).map(tag => tag.id),
    readingTime: 10,
    featured: true,
    status: 'published',
    coverImage: {
      url: 'https://picsum.photos/800/400?random=3',
      alt: 'TypeScript code patterns'
    }
  },
  {
    id: '4',
    title: 'Web Performance Optimization',
    slug: 'web-performance-optimization',
    excerpt: 'Learn how to optimize your web applications for better performance.',
    content: 'Full article content here...',
    contentFormat: 'markdown',
    publishDate: '2024-03-13T14:30:00Z',
    modifiedDate: '2024-03-13T14:30:00Z',
    authors: [mockAuthors[1]],
    category: mockCategories[0].id,
    tags: mockTags.slice(0, 2).map(tag => tag.id),
    readingTime: 12,
    featured: true,
    status: 'published',
    coverImage: {
      url: 'https://picsum.photos/800/400?random=4',
      alt: 'Web performance metrics'
    }
  }
];

export class MockBlogService implements BlogServiceInterface {
  private categories: BlogCategory[] = [...mockCategories];
  private tags: BlogTag[] = [...mockTags];
  private posts: BlogPost[] = [...mockPosts];
  private authors: Author[] = [...mockAuthors];
  private initialized = false;
  
  constructor() {
    console.log('Using MockBlogService for development/testing');
  }
  
  // Add delay to simulate API calls
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Filter posts based on filters
  private filterPosts(filters?: BlogFilters): BlogPost[] {
    if (!filters) return this.posts;

    return this.posts.filter(post => {
      if (filters.category && post.category !== filters.category) {
        return false;
      }

      if (filters.tag && !post.tags.some(tag => tag === filters.tag)) {
        return false;
      }

      if (filters.featured !== undefined && post.featured !== filters.featured) {
        return false;
      }

      if (filters.search) {
        const search = filters.search.toLowerCase();
        return (
          post.title.toLowerCase().includes(search) ||
          post.excerpt.toLowerCase().includes(search) ||
          post.content.toLowerCase().includes(search)
        );
      }

      return true;
    });
  }
  
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    await this.delay();
    this.initialized = true;
  }
  
  async getConnectionStatus(): Promise<{ isConnected: boolean; lastChecked: number; error?: string }> {
    return {
      isConnected: this.initialized,
      lastChecked: Date.now()
    };
  }
  
  async getPosts(options?: { filters?: BlogFilters; pagination?: PaginationOptions }): Promise<PaginatedResponse<BlogPost>> {
    await this.delay();
    const filteredPosts = this.filterPosts(options?.filters);
    const skip = options?.pagination?.skip || 0;
    const limit = options?.pagination?.limit || filteredPosts.length;
    const paginatedPosts = filteredPosts.slice(skip, skip + limit);
    
    return {
      items: paginatedPosts,
      total: filteredPosts.length,
      skip,
      limit,
      hasNextPage: skip + limit < filteredPosts.length
    };
  }
  
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    await this.delay();
    console.log(`Looking for blog post with slug: "${slug}"`);
    console.log('Available slugs:', this.posts.map(post => post.slug));
    const post = this.posts.find(post => post.slug === slug);
    console.log('Found post:', post ? post.title : 'None');
    return post || null;
  }
  
  async getCategories(pagination?: PaginationOptions): Promise<PaginatedResponse<BlogCategory>> {
    const { skip = 0, limit = 10 } = pagination || {};
    const items = this.categories.slice(skip, skip + limit);
    
    return {
      items,
      total: this.categories.length,
      skip,
      limit,
      hasNextPage: skip + limit < this.categories.length
    };
  }
  
  async getTags(pagination?: PaginationOptions): Promise<PaginatedResponse<BlogTag>> {
    const { skip = 0, limit = 10 } = pagination || {};
    const items = this.tags.slice(skip, skip + limit);
    
    return {
      items,
      total: this.tags.length,
      skip,
      limit,
      hasNextPage: skip + limit < this.tags.length
    };
  }
  
  async getAuthors(): Promise<Author[]> {
    await this.delay();
    return this.authors;
  }
  
  async getRelatedPosts(post: BlogPost, limit: number = 3): Promise<BlogPost[]> {
    if (!post.category || typeof post.category !== 'string') return [];
    
    return this.posts
      .filter(p => 
        p.id !== post.id && 
        p.category && 
        typeof p.category === 'string' &&
        p.category === post.category
      )
      .slice(0, limit);
  }
  
  async getTrendingPosts(limit: number = 5): Promise<BlogPost[]> {
    await this.delay();
    // Return random posts as trending
    return this.posts
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  }
  
  clearCache(): void {
    // No caching in mock service
    console.log('Cache cleared (mock)');
  }
}

// Export a singleton instance
export const mockBlogService = new MockBlogService();

// Also export the class for custom configuration
export default MockBlogService; 