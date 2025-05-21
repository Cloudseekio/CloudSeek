import React from 'react';
import { Link } from 'react-router-dom';
import { withRouteSplitting } from '../components/routing/SplitRoute';
import { AdaptiveBlogList } from '../components/blog/AdaptiveBlogList';

function BlogPage() {
  const fetchPosts = async ({ cursor, limit }: { cursor?: string; limit: number }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      posts: Array.from({ length: limit }).map((_, index) => ({
        id: cursor ? `${cursor}-${index}` : `${index}`,
        title: `Blog Post ${index + 1}`,
        excerpt: 'This is a sample blog post excerpt...',
        coverImage: `https://picsum.photos/seed/${index}/800/400`,
        author: {
          name: 'John Doe',
          avatar: `https://i.pravatar.cc/150?u=${index}`,
        },
        publishedAt: new Date().toISOString(),
      })),
      nextCursor: 'next-page',
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      
      <div className="mb-8">
        <Link
          to="/about"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          About Us
        </Link>
      </div>

      <AdaptiveBlogList
        initialPosts={[]}
        fetchPosts={fetchPosts}
      />
    </div>
  );
}

// Export with route splitting and preloading
export default withRouteSplitting(BlogPage, {
  preloadPaths: ['/about'], // Preload about page when blog page loads
  fallback: (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-blue-600 rounded-full animate-spin border-t-transparent" />
    </div>
  ),
}); 