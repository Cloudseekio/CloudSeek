import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, List } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useBlog } from '../../hooks/useBlog';
import AuthorCard from '../components/authors/AuthorCard';
import BlogCard from '../components/BlogCard';
import { Author, BlogPost } from '../../models/Blog';

interface UseBlogReturn {
  posts: BlogPost[];
  authors: Author[];
  isLoading: boolean;
  error: Error | null;
  setFilters: (filters: { author?: string }) => void;
}

const AuthorProfile: React.FC = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFollowing, setIsFollowing] = useState(false);
  
  const blogContext = useBlog() as unknown as UseBlogReturn;
  const posts = blogContext?.posts || [];
  const authors = blogContext?.authors || [];
  const isLoading = blogContext?.isLoading || false;
  const error = blogContext?.error || null;
  const setBlogFilters = blogContext?.setFilters;

  const author = authors.find((a: Author) => a.id === authorId);
  const authorPosts = posts.filter((post: BlogPost) => 
    post.authors.some((a: Author) => a.id === authorId)
  );
  
  // Calculate total views (assuming each post view counts as 1 if no metrics available)
  const totalViews = authorPosts.reduce((sum: number) => sum + 1, 0);

  useEffect(() => {
    if (authorId && setBlogFilters) {
      setBlogFilters({ author: authorId });
    }
  }, [authorId, setBlogFilters]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement follow functionality
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {error ? 'Error loading author profile' : 'Author not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Author Card */}
      <AuthorCard
        author={author}
        variant="profile"
        postCount={authorPosts.length}
        totalViews={totalViews}
        showFollow={true}
        isFollowing={isFollowing}
        onFollow={handleFollow}
        className="mb-8"
      />

      {/* View Mode Toggle and Filters */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          Latest Posts
        </h2>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${
              viewMode === 'grid' 
                ? isDark 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-200 text-gray-900'
                : isDark
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
            aria-label="Grid view"
            aria-pressed="true"
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${
              viewMode === 'list' 
                ? isDark 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-200 text-gray-900'
                : isDark
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
            aria-label="List view"
            aria-pressed="false"
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      {authorPosts.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {authorPosts.map((post: BlogPost) => (
            <BlogCard
              key={post.id}
              post={post}
              variant={viewMode === 'grid' ? 'default' : 'horizontal'}
              showAuthor={false}
            />
          ))}
        </div>
      ) : (
        <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          No posts found
        </div>
      )}
    </div>
  );
};

export default AuthorProfile; 