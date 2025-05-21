import { useQuery } from '@tanstack/react-query';
import { BlogPost, BlogFilters } from '../../models/Blog';
import { blogService } from '../services/blogService';

// Query keys for React Query caching
export const blogQueryKeys = {
  all: ['blog'] as const,
  posts: () => [...blogQueryKeys.all, 'posts'] as const,
  post: (slug: string) => [...blogQueryKeys.posts(), slug] as const,
  categories: () => [...blogQueryKeys.all, 'categories'] as const,
  tags: () => [...blogQueryKeys.all, 'tags'] as const,
  authors: () => [...blogQueryKeys.all, 'authors'] as const,
  featured: () => [...blogQueryKeys.posts(), 'featured'] as const,
  trending: () => [...blogQueryKeys.posts(), 'trending'] as const,
  filtered: (filters: BlogFilters) => [...blogQueryKeys.posts(), 'filtered', filters] as const,
  search: (query: string) => [...blogQueryKeys.posts(), 'search', query] as const
};

// Posts hooks
export function usePostsQuery(filters?: BlogFilters, options = {}) {
  return useQuery({
    queryKey: filters ? blogQueryKeys.filtered(filters) : blogQueryKeys.posts(),
    queryFn: () => blogService.getPosts(filters),
    ...options
  });
}

export function usePostQuery(slug: string, options = {}) {
  return useQuery({
    queryKey: blogQueryKeys.post(slug),
    queryFn: () => blogService.getPostBySlug(slug),
    ...options
  });
}

export function useFeaturedPostsQuery(options = {}) {
  return useQuery({
    queryKey: blogQueryKeys.featured(),
    queryFn: async () => {
      const posts = await blogService.getPosts({ featured: true });
      return posts;
    },
    ...options
  });
}

export function useTrendingPostsQuery(limit = 5, options = {}) {
  return useQuery({
    queryKey: [...blogQueryKeys.trending(), limit],
    queryFn: async () => {
      // In a real app, this would fetch trending posts based on analytics
      // For now, we'll just use the normal posts and sort by date
      const posts = await blogService.getPosts();
      return posts.slice(0, limit);
    },
    ...options
  });
}

export function useSearchPostsQuery(query: string, options = {}) {
  return useQuery({
    queryKey: blogQueryKeys.search(query),
    queryFn: async () => {
      if (!query || query.trim().length < 2) return [];
      
      // In the future, this would use a dedicated search endpoint
      const posts = await blogService.getPosts({ search: query });
      return posts;
    },
    enabled: !!query && query.trim().length >= 2,
    ...options
  });
}

// Categories, Tags, Authors hooks
export function useCategoriesQuery(options = {}) {
  return useQuery({
    queryKey: blogQueryKeys.categories(),
    queryFn: () => blogService.getCategories(),
    ...options
  });
}

export function useTagsQuery(options = {}) {
  return useQuery({
    queryKey: blogQueryKeys.tags(),
    queryFn: () => blogService.getTags(),
    ...options
  });
}

export function useAuthorsQuery(options = {}) {
  return useQuery({
    queryKey: blogQueryKeys.authors(),
    queryFn: () => blogService.getAuthors(),
    ...options
  });
}

// Related posts hook
export function useRelatedPostsQuery(postId: string, category?: string, options = {}) {
  return useQuery({
    queryKey: [...blogQueryKeys.post(postId), 'related'],
    queryFn: async () => {
      // Simple implementation - get posts with the same category
      const posts = await blogService.getPosts({ category });
      return posts.filter(post => post.id !== postId).slice(0, 3);
    },
    enabled: !!postId,
    ...options
  });
}

// Custom hook for handling bookmarks
export function useBookmarks() {
  // Get bookmarks from localStorage
  const getBookmarks = (): string[] => {
    try {
      const bookmarks = localStorage.getItem('blog-bookmarks');
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return [];
    }
  };

  // Add or remove a bookmark
  const toggleBookmark = (postId: string): boolean => {
    try {
      const bookmarks = getBookmarks();
      const isBookmarked = bookmarks.includes(postId);
      
      if (isBookmarked) {
        // Remove bookmark
        const updatedBookmarks = bookmarks.filter(id => id !== postId);
        localStorage.setItem('blog-bookmarks', JSON.stringify(updatedBookmarks));
        return false;
      } else {
        // Add bookmark
        const updatedBookmarks = [...bookmarks, postId];
        localStorage.setItem('blog-bookmarks', JSON.stringify(updatedBookmarks));
        return true;
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      return false;
    }
  };

  // Check if a post is bookmarked
  const isBookmarked = (postId: string): boolean => {
    const bookmarks = getBookmarks();
    return bookmarks.includes(postId);
  };

  // Get all bookmarked posts
  const getBookmarkedPosts = async (): Promise<BlogPost[]> => {
    const bookmarks = getBookmarks();
    if (bookmarks.length === 0) return [];
    
    const allPosts = await blogService.getPosts();
    return allPosts.filter(post => bookmarks.includes(post.id));
  };

  // React Query hook for bookmarked posts
  const useBookmarkedPostsQuery = (options = {}) => {
    return useQuery({
      queryKey: [...blogQueryKeys.all, 'bookmarks'],
      queryFn: getBookmarkedPosts,
      ...options
    });
  };

  return {
    getBookmarks,
    toggleBookmark,
    isBookmarked,
    getBookmarkedPosts,
    useBookmarkedPostsQuery
  };
}

// Advanced search queries data
export function useSuggestionsQuery(query: string, options = {}) {
  return useQuery({
    queryKey: [...blogQueryKeys.search(query), 'suggestions'],
    queryFn: async () => {
      if (!query || query.trim().length < 2) return [];
      
      // In a real app, this would fetch suggestions from a backend API
      // For now, we'll just use the normal tags
      const tags = await blogService.getTags();
      return tags
        .filter(tag => tag.name.toLowerCase().includes(query.toLowerCase()))
        .map(tag => tag.name)
        .slice(0, 5);
    },
    enabled: !!query && query.trim().length >= 2,
    ...options
  });
}

// Reading history
export function useReadingHistory() {
  // Get reading history from localStorage
  const getHistory = (): string[] => {
    try {
      const history = localStorage.getItem('blog-reading-history');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting reading history:', error);
      return [];
    }
  };

  // Add a post to reading history
  const addToHistory = (postId: string): void => {
    try {
      let history = getHistory();
      
      // Remove if already exists (to move to the front)
      history = history.filter(id => id !== postId);
      
      // Add to front of the array
      history.unshift(postId);
      
      // Keep only the last 20 items
      history = history.slice(0, 20);
      
      localStorage.setItem('blog-reading-history', JSON.stringify(history));
    } catch (error) {
      console.error('Error adding to reading history:', error);
    }
  };

  // Get all posts in reading history
  const getHistoryPosts = async (): Promise<BlogPost[]> => {
    const history = getHistory();
    if (history.length === 0) return [];
    
    const allPosts = await blogService.getPosts();
    
    // Sort posts based on the order in history
    return history
      .map(id => allPosts.find(post => post.id === id))
      .filter(Boolean) as BlogPost[];
  };

  // React Query hook for reading history
  const useReadingHistoryQuery = (options = {}) => {
    return useQuery({
      queryKey: [...blogQueryKeys.all, 'history'],
      queryFn: getHistoryPosts,
      ...options
    });
  };

  return {
    getHistory,
    addToHistory,
    getHistoryPosts,
    useReadingHistoryQuery
  };
} 