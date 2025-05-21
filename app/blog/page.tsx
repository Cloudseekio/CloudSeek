'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useBlog } from '../../src/blog/hooks/useBlog';
import { useContentfulConnection } from '../../src/blog/hooks/useContentfulConnection';
import BlogList from '../../src/blog/components/BlogList';
import BlogFilters from '../../src/blog/components/BlogFilters';
import BlogCategories from '../../src/blog/components/BlogCategories';
import BlogTags from '../../src/blog/components/BlogTags';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import ErrorMessage from '../../src/components/ErrorMessage';
import logger from '../../src/utils/logger';
import { BlogFilters as BlogFiltersType } from '../../src/blog/types/blog';

export default function BlogPage() {
  // Always call hooks at the top level
  const { 
    status: connectionStatus, 
    error: connectionError, 
    isInitializing: isConnectionInitializing,
    checkConnection 
  } = useContentfulConnection();
  
  const { 
    posts, 
    featuredPosts, 
    categories, 
    tags, 
    loading, 
    error,
    isInitialized 
  } = useBlog();

  const [retryCount, setRetryCount] = useState(0);
  const [filters, setFilters] = useState<BlogFiltersType>({
    sortBy: 'newest'
  });
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    checkConnection();
  }, [checkConnection]);

  // Logging effect
  useEffect(() => {
    logger.debug('BlogPage: State updated', {
      postsCount: posts.length,
      featuredCount: featuredPosts.length,
      categoriesCount: categories.length,
      tagsCount: tags.length,
      isLoading: loading,
      hasError: !!error,
      connectionStatus,
      connectionError: connectionError ? connectionError.message : null,
      isConnectionInitializing,
      isInitialized,
      retryCount
    });
  }, [
    posts.length,
    featuredPosts.length,
    categories.length,
    tags.length,
    loading,
    error,
    connectionStatus,
    connectionError,
    isConnectionInitializing,
    isInitialized,
    retryCount
  ]);

  // Render function to handle different states
  const renderContent = () => {
    // Show loading state while initializing connection or loading data
    if (isConnectionInitializing || (!isInitialized && loading)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
          <LoadingSpinner />
          <p className="text-gray-600">
            {isConnectionInitializing ? 'Connecting to blog service...' : 'Loading blog content...'}
          </p>
        </div>
      );
    }

    // Show connection error if any
    if (connectionError || !connectionStatus.isConnected) {
      return (
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage
            title="Connection Error"
            message={connectionError?.message || 'Failed to connect to the blog service'}
            retryButtonText="Retry Connection"
            onRetry={handleRetry}
          />
        </div>
      );
    }

    // Show error state if any
    if (error) {
      return (
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage
            title="Error Loading Blog"
            message={error.message}
            retryButtonText="Retry Loading"
            onRetry={handleRetry}
          />
        </div>
      );
    }

    // Show main content
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <BlogFilters
              filters={filters}
              onFiltersChange={setFilters}
            />
            <BlogCategories
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
            <BlogTags
              tags={tags}
              selectedTag={selectedTag}
              onTagSelect={setSelectedTag}
            />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <BlogList
              posts={posts}
              isLoading={loading}
              emptyMessage="No posts found"
              variant="default"
              columns={3}
            />
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return renderContent();
}