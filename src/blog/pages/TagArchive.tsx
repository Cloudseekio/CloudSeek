import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Grid, Layout, Home, Tag as TagIcon } from 'lucide-react';
import { BlogPost, BlogFilters as IBlogFilters } from '../../models/Blog';
import { usePostsQuery } from '../hooks/useBlogQuery';
import BlogCard from '../components/BlogCard';
import BlogFilters from '../components/BlogFilters';
import { useTheme } from '../../context/ThemeContext';
import { ExtendedBlogFilters } from '../components/BlogFilters';

const TagArchive: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { theme } = useTheme();
  
  // State for filters
  const [filters, setFilters] = useState<ExtendedBlogFilters>({
    tag: slug,
    sortBy: 'newest'
  });
  
  // View mode for posts listing
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Fetch posts with the tag filter
  const { data: posts, isLoading, error } = usePostsQuery(filters);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: ExtendedBlogFilters) => {
    // Make sure we keep the tag filter
    setFilters({
      ...newFilters,
      tag: slug
    });
  };
  
  // Determine background and text colors based on theme
  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subtitleColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  
  // Format tag name for display (convert slug to title case)
  const formatTagName = (tagSlug: string): string => {
    return tagSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const tagName = formatTagName(slug || '');
  
  // Error handling
  if (error) {
    return (
      <div className={`min-h-screen ${bgColor} py-12 px-4`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h1 className={`text-2xl font-bold ${textColor}`}>Error Loading Posts</h1>
            <p className={`mt-4 ${subtitleColor}`}>
              We encountered an error while trying to load posts for this tag.
              Please try again later or go back to the blog home.
            </p>
            <Link 
              to="/blog" 
              className="mt-6 inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ChevronLeft size={16} className="mr-1" /> Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Loading UI
  if (isLoading) {
    return (
      <div className={`min-h-screen ${bgColor} py-12 px-4`}>
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 w-1/4 mb-4 rounded"></div>
            <div className="h-16 bg-gray-300 dark:bg-gray-700 w-full mb-8 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-72 bg-gray-300 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${bgColor} py-12 px-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm mb-8 text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center">
            <Home size={14} className="mr-1" /> Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/blog" className="hover:text-blue-600 dark:hover:text-blue-400">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <Link to="/blog/tags" className="hover:text-blue-600 dark:hover:text-blue-400">
            Tags
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-blue-600 dark:text-blue-400">
            {tagName}
          </span>
        </div>
        
        {/* Tag Header */}
        <header className="mb-10">
          <div className="mb-4 inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
            <TagIcon size={16} className="mr-2" />
            <span>{tagName}</span>
          </div>
          
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${textColor}`}>
            Posts Tagged with "{tagName}"
          </h1>
          
          <p className={`text-lg ${subtitleColor} max-w-3xl`}>
            Browse all our content related to {tagName} to deepen your knowledge on this topic.
          </p>
          
          {posts && (
            <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>{posts.length} {posts.length === 1 ? 'post' : 'posts'} found</span>
            </div>
          )}
        </header>
        
        {/* Controls */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div>
            <h2 className={`text-xl font-semibold ${textColor}`}>
              All Posts
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid' ? 'true' : 'false'}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              aria-label="List view"
              aria-pressed={viewMode === 'list' ? 'true' : 'false'}
            >
              <Layout size={18} />
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <BlogFilters 
          filters={filters}
          onFiltersChange={handleFilterChange}
          showTags={false} // Hide tag filters since we're already on a tag page
          className="mb-8"
        />
        
        {/* Posts grid/list */}
        {posts && posts.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {posts.map((post: BlogPost) => (
              <BlogCard 
                key={post.id}
                post={post}
                variant={viewMode === 'grid' ? 'grid' : 'list'}
                showCategory={true}
                showAuthor={viewMode === 'grid'}
                showExcerpt={viewMode === 'grid'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <p className={`mt-4 ${subtitleColor}`}>
              No posts found with this tag and the current filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
  
  // Helper function to clear filters
  function handleClearFilters() {
    setFilters({
      tag: slug,
      sortBy: 'newest'
    });
  }
};

export default TagArchive; 