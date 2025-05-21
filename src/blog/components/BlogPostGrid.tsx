import React from 'react';
import { BlogPost } from '../../models/Blog';
import BlogPostCard from './BlogPostCard';
import FeaturedBlogPost from './FeaturedBlogPost';

interface BlogPostGridProps {
  posts: BlogPost[];
  showFeatured?: boolean;
  columns?: 1 | 2 | 3 | 4;
  variant?: 'default' | 'compact';
}

const BlogPostGrid: React.FC<BlogPostGridProps> = ({
  posts,
  showFeatured = true,
  columns = 3,
  variant = 'default'
}) => {
  if (!posts.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No posts found</p>
      </div>
    );
  }

  const featuredPost = showFeatured ? posts[0] : null;
  const remainingPosts = showFeatured ? posts.slice(1) : posts;

  const getGridColumns = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <div className="space-y-8">
      {featuredPost && (
        <div className="mb-12">
          <FeaturedBlogPost post={featuredPost} />
        </div>
      )}
      
      {remainingPosts.length > 0 && (
        <div className={`grid ${getGridColumns()} gap-6`}>
          {remainingPosts.map((post) => (
            <BlogPostCard
              key={post.slug}
              post={post}
              variant={variant}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPostGrid; 