import React, { useCallback, useState } from 'react';
import { VirtualizedBlogList } from './VirtualizedBlogList';
import { usePredictivePrefetch } from '../../utils/predictivePrefetch';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
}

interface PredictiveBlogListProps {
  initialPosts?: BlogPost[];
  fetchPosts: (params: {
    cursor?: string;
    limit: number;
  }) => Promise<{
    posts: BlogPost[];
    nextCursor?: string;
  }>;
  children: (post: BlogPost) => React.ReactElement;
}

export function PredictiveBlogList({
  initialPosts = [],
  fetchPosts,
  children,
}: PredictiveBlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Set up predictive prefetching
  const {
    getPrefetchedData,
    clearCache,
    getMetrics,
  } = usePredictivePrefetch({
    fetchData: async ({ cursor, limit }) => {
      const { posts, nextCursor } = await fetchPosts({ cursor, limit });
      return {
        items: posts,
        nextCursor,
      };
    },
    strategy: {
      // Customize strategy based on your needs
      probability: 0.9, // Higher probability for blog posts
      batchSize: 5, // Smaller batches for faster loading
      cooldown: 3000, // More frequent prefetching
      maxConcurrent: 2,
      cacheTTL: 10 * 60 * 1000, // 10 minutes cache
    },
    onPrefetch: (items) => {
      console.debug('Prefetched posts:', items.length);
    },
    onError: (error) => {
      console.error('Prefetch error:', error);
    },
  });

  // Handle post loading with prefetch support
  const handleFetchPosts = useCallback(async ({
    cursor,
    limit,
  }: {
    cursor?: string;
    limit: number;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      // Check prefetch cache first
      const prefetchedData = getPrefetchedData(cursor);
      if (prefetchedData) {
        const newPosts = prefetchedData as BlogPost[];
        setPosts(prev => [...prev, ...newPosts]);
        return {
          posts: newPosts,
          nextCursor: cursor,
        };
      }

      // Fallback to regular fetch
      const result = await fetchPosts({ cursor, limit });
      setPosts(prev => [...prev, ...result.posts]);
      return result;
    } catch (error) {
      setError(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchPosts, getPrefetchedData]);

  // Clear cache on unmount
  React.useEffect(() => {
    return () => {
      clearCache();
    };
  }, [clearCache]);

  // Optional: Debug metrics
  React.useEffect(() => {
    const interval = setInterval(() => {
      const metrics = getMetrics();
      console.debug('User behavior metrics:', metrics);
    }, 10000);

    return () => clearInterval(interval);
  }, [getMetrics]);

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        <p>Error loading posts: {error.message}</p>
        <button
          onClick={() => {
            setError(null);
            void handleFetchPosts({ limit: 10 });
          }}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <VirtualizedBlogList
        initialPosts={posts}
        fetchPosts={handleFetchPosts}
        containerHeight="80vh"
        itemEstimatedHeight={400}
        overscanCount={3}
        pageSize={10}
      >
        {children}
      </VirtualizedBlogList>
      {isLoading && (
        <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 rounded-full animate-spin border-t-transparent" />
            <span className="text-sm text-gray-600">Loading more posts...</span>
          </div>
        </div>
      )}
    </div>
  );
} 