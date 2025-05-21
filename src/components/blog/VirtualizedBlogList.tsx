import React, { useCallback, useRef, useState } from 'react';
import { DynamicVirtualizedList } from '../pagination/DynamicVirtualizedList';
import { ProgressiveImage } from '../image/ProgressiveImage';
import { getBlurPlaceholder } from '../../utils/imageBlur';
import { useCursorPagination } from '../../utils/cursorPagination';

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

interface VirtualizedBlogListProps {
  initialPosts: BlogPost[];
  fetchPosts: ({ cursor, limit }: {
    cursor?: string;
    limit: number;
  }) => Promise<{
    posts: BlogPost[];
    nextCursor?: string;
  }>;
  containerHeight: string;
  itemEstimatedHeight: number;
  overscanCount: number;
  pageSize: number;
  children: (post: BlogPost) => React.ReactElement;
}

export function VirtualizedBlogList({
  initialPosts,
  fetchPosts,
  containerHeight,
  itemEstimatedHeight,
  overscanCount,
  pageSize,
  children,
}: VirtualizedBlogListProps) {
  // Image placeholder state
  const [placeholders, setPlaceholders] = useState<Record<string, { cover?: string; avatar?: string }>>({});
  const loadingRef = useRef(false);

  // Set up cursor pagination
  const {
    items: posts,
    isLoading,
    isLoadingMore,
    hasNextPage,
    loadMore,
  } = useCursorPagination<BlogPost>({
    fetchData: async ({ cursor, limit }) => {
      const { posts, nextCursor } = await fetchPosts({ cursor, limit });
      return {
        items: posts,
        nextCursor,
        hasMore: !!nextCursor,
      };
    },
    pageSize,
    initialItems: initialPosts,
    getItemKey: (post) => post.id,
  });

  // Load image placeholders for a post
  const loadPlaceholders = useCallback(async (post: BlogPost) => {
    if (placeholders[post.id]) return;

    const newPlaceholders: { cover?: string; avatar?: string } = {};

    if (post.coverImage) {
      try {
        newPlaceholders.cover = await getBlurPlaceholder(post.coverImage);
      } catch (error) {
        console.error('Failed to load cover placeholder:', error);
      }
    }

    if (post.author.avatar) {
      try {
        newPlaceholders.avatar = await getBlurPlaceholder(post.author.avatar);
      } catch (error) {
        console.error('Failed to load avatar placeholder:', error);
      }
    }

    setPlaceholders(prev => ({
      ...prev,
      [post.id]: newPlaceholders,
    }));
  }, [placeholders]);

  // Handle infinite scroll
  const handleLoadMore = useCallback(async () => {
    if (loadingRef.current || !hasNextPage || isLoadingMore) return;
    loadingRef.current = true;
    
    try {
      await loadMore();
    } finally {
      loadingRef.current = false;
    }
  }, [hasNextPage, isLoadingMore, loadMore]);

  // Render a blog post
  const renderPost = useCallback((post: BlogPost) => {
    // Load placeholders when post comes into view
    void loadPlaceholders(post);

    const postPlaceholders = placeholders[post.id] || {};

    return (
      <article className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
        {post.coverImage && (
          <ProgressiveImage
            src={post.coverImage}
            placeholderSrc={postPlaceholders.cover || ''}
            alt={post.title}
            className="w-full h-48 object-cover rounded-md"
            wrapperClassName="relative aspect-[16/9]"
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
              src={post.author.avatar}
              placeholderSrc={postPlaceholders.avatar || ''}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover"
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
    );
  }, [loadPlaceholders, placeholders]);

  // Loading indicator
  const LoadingIndicator = (
    <div className="flex justify-center p-6">
      <div className="w-8 h-8 border-4 border-blue-600 rounded-full animate-spin border-t-transparent" />
    </div>
  );

  // Empty state
  if (!isLoading && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500">
        <svg
          className="w-16 h-16 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"
          />
        </svg>
        <p className="text-xl font-medium">No posts found</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <DynamicVirtualizedList
        items={posts}
        renderItem={renderPost}
        getItemKey={(post) => post.id}
        containerHeight={containerHeight}
        estimatedItemHeight={itemEstimatedHeight}
        overscanCount={overscanCount}
        onLoadMore={handleLoadMore}
        hasNextPage={hasNextPage}
        loadingMore={isLoadingMore}
        loadingIndicator={LoadingIndicator}
        isLoading={isLoading && posts.length === 0}
        className="space-y-6 px-4"
      />
    </div>
  );
} 