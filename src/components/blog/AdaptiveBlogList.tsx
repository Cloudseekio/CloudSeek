import React, { useCallback, useState, useEffect } from 'react';
import { PredictiveBlogList } from './PredictiveBlogList';
import { useAdaptiveLoading } from '../../utils/adaptiveLoading';
import { ProgressiveImage } from '../image/ProgressiveImage';
import { getBlurPlaceholder } from '../../utils/imageBlur';
import { cn } from '../../utils/cn';
import { useDataCleanup } from '../../utils/dataCleanup';
import { normalizer } from '../../utils/stateNormalization';

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
  [key: string]: unknown;
}

interface AdaptiveBlogListProps {
  initialPosts?: BlogPost[];
  fetchPosts: (params: {
    cursor?: string;
    limit: number;
  }) => Promise<{
    posts: BlogPost[];
    nextCursor?: string;
  }>;
}

export function AdaptiveBlogList({
  initialPosts = [],
  fetchPosts,
}: AdaptiveBlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [networkStatus, setNetworkStatus] = useState<string>('');
  const [imageQuality, setImageQuality] = useState<number>(80);
  const [placeholders, setPlaceholders] = useState<Record<string, string>>({});

  // Setup data cleanup for posts
  const { registerData, accessData } = useDataCleanup<BlogPost[]>('blog-posts', {
    inactivityThreshold: 10 * 60 * 1000, // 10 minutes
    maxItems: 100,
    debug: true,
    cleanupOnUnmount: true,
    customCleanup: () => {
      console.log('Cleaning up blog posts cache');
    }
  });

  // Register schemas for normalization
  useEffect(() => {
    // Register BlogPost schema
    normalizer.registerSchema<BlogPost>('posts', {
      key: 'id',
      relations: {
        author: { type: 'one', entity: 'authors' }
      }
    });

    // Register Author schema
    normalizer.registerSchema('authors', {
      key: 'name',
    });
  }, []);

  // Set up adaptive loading
  const {
    metrics,
    strategy,
    adaptiveFetch,
    isOnline,
    saveData,
  } = useAdaptiveLoading({
    strategy: {
      // Customize default strategy
      imageQuality: 80,
      maxImageDimension: 1200,
      prefetchDistance: 3,
      batchSize: 10,
    },
    onStrategyChange: (newStrategy) => {
      setImageQuality(newStrategy.imageQuality);
    },
    onNetworkChange: (newMetrics) => {
      setNetworkStatus(
        `${newMetrics.effectiveType} - ${newMetrics.downlink.toFixed(1)} Mbps`
      );
    },
  });

  // Load image placeholders
  useEffect(() => {
    const loadPlaceholders = async () => {
      const newPlaceholders: Record<string, string> = {};

      // Load cover image placeholders
      const coverPromises = initialPosts
        .filter(post => post.coverImage)
        .map(async post => {
          try {
            const placeholder = await getBlurPlaceholder(post.coverImage!);
            newPlaceholders[`cover-${post.id}`] = placeholder;
          } catch (error) {
            console.error('Failed to load cover placeholder:', error);
          }
        });

      // Load avatar placeholders
      const avatarPromises = initialPosts
        .filter(post => post.author.avatar)
        .map(async post => {
          try {
            const placeholder = await getBlurPlaceholder(post.author.avatar!);
            newPlaceholders[`avatar-${post.id}`] = placeholder;
          } catch (error) {
            console.error('Failed to load avatar placeholder:', error);
          }
        });

      await Promise.all([...coverPromises, ...avatarPromises]);
      setPlaceholders(newPlaceholders);
    };

    void loadPlaceholders();
  }, [initialPosts]);

  const loadPosts = useCallback(async ({ cursor, limit }: {
    cursor?: string;
    limit: number;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to get cached posts first
      const cachedPosts = accessData();
      if (cachedPosts && !cursor) {
        setPosts(cachedPosts);
        return { posts: cachedPosts, nextCursor: undefined };
      }

      // Fetch new posts
      const result = await fetchPosts({ cursor, limit });

      // Normalize the data
      const normalizedState = normalizer.normalize<BlogPost>('posts', result.posts);
      const denormalizedPosts = normalizer.denormalize<BlogPost>('posts', normalizedState) as BlogPost[];
      
      // Store normalized data with cleanup
      registerData(denormalizedPosts, {
        size: denormalizedPosts.length,
        type: 'blog-posts'
      });

      setPosts(prev => cursor ? [...prev, ...denormalizedPosts] : denormalizedPosts);
      return { posts: denormalizedPosts, nextCursor: result.nextCursor };
    } catch (error) {
      const err = error as Error;
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchPosts, registerData, accessData]);

  // Adaptive fetch wrapper for posts
  const handleFetchPosts = useCallback(async (params: {
    cursor?: string;
    limit: number;
  }) => {
    try {
      return await adaptiveFetch(
        () => loadPosts(params),
        { priority: 'high' }
      );
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      throw error;
    }
  }, [adaptiveFetch, loadPosts]);

  // Adaptive image loading
  const getImageUrl = useCallback((url: string, width: number) => {
    const params = new URLSearchParams({
      w: width.toString(),
      q: imageQuality.toString(),
    });
    return `${url}?${params.toString()}`;
  }, [imageQuality]);

  // Network status indicator
  const NetworkStatus = () => (
    <div className={cn(
      'fixed bottom-4 right-4 px-4 py-2 rounded-full shadow-lg',
      'transition-colors duration-200',
      isOnline ? 'bg-white' : 'bg-red-50',
    )}>
      <div className="flex items-center gap-2">
        <div className={cn(
          'w-2 h-2 rounded-full',
          isOnline ? 'bg-green-500' : 'bg-red-500',
        )} />
        <span className="text-sm text-gray-600">
          {isOnline ? networkStatus : 'Offline'}
        </span>
        {saveData && (
          <span className="text-sm text-blue-600 ml-2">
            Data Saver
          </span>
        )}
      </div>
    </div>
  );

  // Performance metrics
  const PerformanceMetrics = () => (
    <div className="fixed bottom-16 right-4 p-4 bg-white rounded-lg shadow-lg">
      <div className="space-y-2 text-sm text-gray-600">
        <p>RTT: {metrics.rtt}ms</p>
        <p>Load Time: {metrics.averageLoadTime.toFixed(0)}ms</p>
        <p>Failure Rate: {(metrics.failureRate * 100).toFixed(1)}%</p>
        <p>Image Quality: {imageQuality}%</p>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        <p>Error loading posts: {error.message}</p>
        <button
          onClick={() => void loadPosts({ limit: 10 })}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <PredictiveBlogList<BlogPost>
        initialPosts={posts}
        fetchPosts={handleFetchPosts}
        isLoading={isLoading}
      >
        {(post: BlogPost) => (
          <article key={post.id} className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
            {post.coverImage && (
              <ProgressiveImage
                src={getImageUrl(post.coverImage, strategy.maxImageDimension)}
                placeholderSrc={placeholders[`cover-${post.id}`] || ''}
                alt={post.title}
                className="w-full h-48 object-cover rounded-md"
                wrapperClassName="relative aspect-[16/9]"
                loadingDelay={metrics.rtt}
              />
            )}

            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-900">
                {post.title}
              </h2>
              <p className="text-gray-600">
                {post.excerpt}
              </p>
            </div>

            <div className="flex items-center gap-4 mt-4">
              {post.author.avatar && (
                <ProgressiveImage
                  src={getImageUrl(post.author.avatar, 80)}
                  placeholderSrc={placeholders[`avatar-${post.id}`] || ''}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                  loadingDelay={metrics.rtt}
                />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {post.author.name}
                </span>
                <time className="text-sm text-gray-500">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </time>
              </div>
            </div>
          </article>
        )}
      </PredictiveBlogList>

      <NetworkStatus />
      <PerformanceMetrics />
    </div>
  );
} 