import { useState, useEffect, useCallback } from 'react';
import { BlogPost, BlogCategory } from '../../models/Blog';
import { blogService } from '../services/blogService';

// Define the return type for the hook
interface UseBlogDataReturn {
  // Data states
  posts: BlogPost[];
  categories: BlogCategory[];
  tags: string[];
  featuredPosts: BlogPost[];
  
  // Loading and error states
  loading: boolean;
  error: string | null;
  
  // Data fetching methods
  fetchPosts: () => Promise<BlogPost[]>;
  fetchPostBySlug: (slug: string) => Promise<BlogPost | null>;
  fetchCategories: () => Promise<BlogCategory[]>;
  fetchTags: () => Promise<string[]>;
  fetchFeaturedPosts: () => Promise<BlogPost[]>;
  searchPosts: (query: string) => Promise<BlogPost[]>;
  fetchPostsByCategory: (category: string) => Promise<BlogPost[]>;
  fetchPostsByTag: (tag: string) => Promise<BlogPost[]>;
  fetchRelatedPosts: (post: BlogPost, limit?: number) => Promise<BlogPost[]>;
}

export const useBlogData = (): UseBlogDataReturn => {
  // State for storing blog data
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  
  // Loading and error states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Function to fetch all posts
  const fetchPosts = useCallback(async (): Promise<BlogPost[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getPosts();
      setPosts(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch posts';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to fetch a post by slug
  const fetchPostBySlug = useCallback(async (slug: string): Promise<BlogPost | null> => {
    setLoading(true);
    setError(null);
    try {
      return await blogService.getPostBySlug(slug);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch post';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to fetch all categories
  const fetchCategories = useCallback(async (): Promise<BlogCategory[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getCategories();
      setCategories(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to fetch all tags
  const fetchTags = useCallback(async (): Promise<string[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getTags();
      setTags(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tags';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to fetch featured posts
  const fetchFeaturedPosts = useCallback(async (): Promise<BlogPost[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getFeaturedPosts();
      setFeaturedPosts(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch featured posts';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to search posts
  const searchPostsCallback = useCallback(async (query: string): Promise<BlogPost[]> => {
    setLoading(true);
    setError(null);
    try {
      return await blogService.searchPosts(query);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search posts';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to fetch posts by category
  const fetchPostsByCategory = useCallback(async (category: string): Promise<BlogPost[]> => {
    setLoading(true);
    setError(null);
    try {
      return await blogService.getPostsByCategory(category);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch posts by category';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to fetch posts by tag
  const fetchPostsByTag = useCallback(async (tag: string): Promise<BlogPost[]> => {
    setLoading(true);
    setError(null);
    try {
      return await blogService.getPostsByTag(tag);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch posts by tag';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to fetch related posts
  const fetchRelatedPosts = useCallback(async (post: BlogPost, limit: number = 3): Promise<BlogPost[]> => {
    setLoading(true);
    setError(null);
    try {
      return await blogService.getRelatedPosts(post, limit);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch related posts';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch initial data in parallel
        await Promise.all([
          fetchPosts(),
          fetchCategories(),
          fetchTags(),
          fetchFeaturedPosts()
        ]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load initial data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [fetchPosts, fetchCategories, fetchTags, fetchFeaturedPosts]);

  return {
    // Data states
    posts,
    categories,
    tags,
    featuredPosts,
    
    // Loading and error states
    loading,
    error,
    
    // Data fetching methods
    fetchPosts,
    fetchPostBySlug,
    fetchCategories,
    fetchTags,
    fetchFeaturedPosts,
    searchPosts: searchPostsCallback,
    fetchPostsByCategory,
    fetchPostsByTag,
    fetchRelatedPosts
  };
}; 