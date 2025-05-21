import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BlogPost, BlogCategory, BlogTag } from '../../../blog/types/blog';

// Define mock blog data
const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Test Post',
    slug: 'test-post',
    excerpt: 'Test excerpt',
    content: 'Test content',
    contentFormat: 'markdown',
    publishDate: '2024-03-20T12:00:00Z',
    authors: [{ id: '1', name: 'Test Author' }],
    category: { id: '1', name: 'Test Category', slug: 'test-category' },
    tags: [{ id: '1', name: 'Test Tag', slug: 'test-tag' }],
    readingTime: 3
  }
];

const mockCategories: BlogCategory[] = [
  { id: '1', name: 'Test Category', slug: 'test-category' }
];

const mockTags: BlogTag[] = [
  { id: '1', name: 'Test Tag', slug: 'test-tag' }
];

// Define the context type
interface BlogContextType {
  posts: BlogPost[];
  categories: BlogCategory[];
  tags: BlogTag[];
  featuredPosts: BlogPost[];
  popularPosts: BlogPost[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  getPostBySlug: (slug: string) => Promise<BlogPost | null>;
  getRelatedPosts: (post: BlogPost) => Promise<BlogPost[]>;
}

// Create the context
const BlogContext = createContext<BlogContextType>({
  posts: [],
  categories: [],
  tags: [],
  featuredPosts: [],
  popularPosts: [],
  isLoading: false,
  error: null,
  refetch: async () => {},
  getPostBySlug: async () => null,
  getRelatedPosts: async () => []
});

// Create global variables for tests to control
let shouldReturnError = false;
let errorMessage = 'Failed to fetch';
let isLoadingState = true;

// Reset the mock state
export const resetMockState = () => {
  shouldReturnError = false;
  errorMessage = 'Failed to fetch';
  isLoadingState = true;
};

// Configure error for testing
export const setMockError = (shouldError: boolean, message?: string) => {
  shouldReturnError = shouldError;
  if (message) errorMessage = message;
};

// Configure loading state
export const setMockLoadingState = (loading: boolean) => {
  isLoadingState = loading;
};

// Provider component
export const BlogProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(isLoadingState);
  const [error, setError] = useState<Error | null>(null);
  
  // Simulate data fetching
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (shouldReturnError) {
        setError(new Error(errorMessage));
      }
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Define context value
  const value: BlogContextType = {
    posts: mockPosts,
    categories: mockCategories,
    tags: mockTags,
    featuredPosts: mockPosts,
    popularPosts: mockPosts,
    isLoading,
    error,
    refetch: async () => {
      setIsLoading(true);
      setTimeout(() => {
        if (shouldReturnError) {
          setError(new Error(errorMessage));
        } else {
          setError(null);
        }
        setIsLoading(false);
      }, 100);
    },
    getPostBySlug: async (slug: string) => {
      return mockPosts.find(p => p.slug === slug) || null;
    },
    getRelatedPosts: async () => {
      return mockPosts;
    }
  };
  
  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};

// Custom hook
export const useBlog = () => useContext(BlogContext);

export default BlogContext; 