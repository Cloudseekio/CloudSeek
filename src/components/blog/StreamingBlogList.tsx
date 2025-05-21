import React, { useEffect, useState, ReactNode } from 'react';
import { withStreaming } from '../../utils/streamingSSR';
import { CursorPagination } from '../pagination/CursorPagination';
import { ProgressiveImage } from '../image/ProgressiveImage';
import { getBlurPlaceholder } from '../../utils/imageBlur';

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

interface StreamingBlogListProps {
  initialPosts?: BlogPost[];
  fetchPosts: (params: {
    cursor?: string;
    limit: number;
  }) => Promise<{
    posts: BlogPost[];
    nextCursor?: string;
  }>;
}

function BlogList({ initialPosts = [], fetchPosts }: StreamingBlogListProps) {
  const [coverPlaceholders, setCoverPlaceholders] = useState<Record<string, string>>({});
  const [avatarPlaceholders, setAvatarPlaceholders] = useState<Record<string, string>>({});

  // Load blur placeholders for images
  useEffect(() => {
    const loadPlaceholders = async () => {
      const coverPromises = initialPosts
        .filter(post => post.coverImage)
        .map(async post => {
          const placeholder = await getBlurPlaceholder(post.coverImage!);
          return [post.id, placeholder] as const;
        });

      const avatarPromises = initialPosts
        .filter(post => post.author.avatar)
        .map(async post => {
          const placeholder = await getBlurPlaceholder(post.author.avatar!);
          return [post.id, placeholder] as const;
        });

      const [coverResults, avatarResults] = await Promise.all([
        Promise.all(coverPromises),
        Promise.all(avatarPromises),
      ]);

      setCoverPlaceholders(Object.fromEntries(coverResults));
      setAvatarPlaceholders(Object.fromEntries(avatarResults));
    };

    void loadPlaceholders();
  }, [initialPosts]);

  // Create a streaming data loader for posts
  const loadPosts = async ({ cursor, limit }: { cursor?: string; limit: number }) => {
    const { posts, nextCursor } = await fetchPosts({ cursor, limit });
    return {
      items: posts,
      nextCursor,
      hasMore: !!nextCursor,
    };
  };

  const EmptyMessage = (
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

  return (
    <div className="space-y-8">
      <CursorPagination<BlogPost>
        initialItems={initialPosts}
        fetchData={loadPosts}
        pageSize={10}
        getItemKey={(post) => post.id}
        renderItem={(post) => (
          <article key={post.id} className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
            {post.coverImage && (
              <ProgressiveImage
                src={post.coverImage}
                placeholderSrc={coverPlaceholders[post.id] || ''}
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
                  placeholderSrc={avatarPlaceholders[post.id] || ''}
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
        )}
        containerClassName="divide-y divide-gray-200"
        loadingIndicator={
          <div className="flex justify-center p-6">
            <div className="w-8 h-8 border-4 border-blue-600 rounded-full animate-spin border-t-transparent" />
          </div>
        }
        emptyMessage={EmptyMessage}
      />
    </div>
  );
}

// Export as a streaming-ready component
export const StreamingBlogList = withStreaming(BlogList, {
  fallback: (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse p-6 bg-white rounded-lg shadow-md"
        >
          <div className="w-full h-48 bg-gray-200 rounded-md mb-4" />
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
          <div className="flex items-center gap-4 mt-6">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-3 bg-gray-200 rounded w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
  suspense: true,
  preload: true,
}); 