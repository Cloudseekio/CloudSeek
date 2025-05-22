import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { BlogPost, BlogCategory, BlogTag } from '../types/blog';
import { getBlogService } from '../services/serviceFactory';

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

// Create context with default values
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

// Custom hook to use the blog context
export const useBlog = () => useContext(BlogContext);

interface BlogProviderProps {
  children: ReactNode;
}

export const BlogProvider: React.FC<BlogProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Get the blog service
  const blogService = useMemo(() => getBlogService(), []);

  // Fetch all blog data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch posts
      const postsResponse = await blogService.getPosts();
      setPosts(postsResponse.items);

      // Extract featured posts
      const featured = postsResponse.items.filter(post => post.featured);
      setFeaturedPosts(featured.length > 0 ? featured : postsResponse.items.slice(0, 3));

      // Fetch categories
      const categoriesResponse = await blogService.getCategories();
      setCategories(categoriesResponse.items);

      // Fetch tags
      const tagsResponse = await blogService.getTags();
      setTags(tagsResponse.items);

      // Fetch popular posts
      const popular = await blogService.getTrendingPosts?.(5) || [];
      setPopularPosts(popular);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch blog data'));
    } finally {
      setIsLoading(false);
    }
  }, [blogService]);

  // Get post by slug
  const getPostBySlug = useCallback(
    async (slug: string) => {
      try {
        return await blogService.getPostBySlug(slug);
      } catch (err) {
        console.error('Error fetching post by slug:', err);
        return null;
      }
    },
    [blogService]
  );

  // Get related posts
  const getRelatedPosts = useCallback(
    async (post: BlogPost) => {
      try {
        return await blogService.getRelatedPosts?.(post) || [];
      } catch (err) {
        console.error('Error fetching related posts:', err);
        return [];
      }
    },
    [blogService]
  );

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Context value
  const value: BlogContextType = {
    posts,
    categories,
    tags,
    featuredPosts,
    popularPosts,
    isLoading,
    error,
    refetch: fetchData,
    getPostBySlug,
    getRelatedPosts
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};

export default BlogContext; 