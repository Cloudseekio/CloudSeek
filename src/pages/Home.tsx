import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { withRouteSplitting } from '../components/routing/SplitRoute';
import { ProgressiveImage } from '../components/image/ProgressiveImage';
import { getBlurPlaceholder } from '../utils/imageBlur';

interface FeaturedPost {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
}

function HomePage() {
  const [featuredPosts, setFeaturedPosts] = useState<FeaturedPost[]>([]);
  const [placeholders, setPlaceholders] = useState<Record<string, { cover: string; avatar: string }>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock featured posts
        const posts: FeaturedPost[] = Array.from({ length: 3 }).map((_, index) => ({
          id: `featured-${index}`,
          title: `Featured Post ${index + 1}`,
          excerpt: 'Discover the latest insights and developments in our featured article...',
          coverImage: `https://picsum.photos/seed/featured-${index}/800/400`,
          author: {
            name: 'John Doe',
            avatar: `https://i.pravatar.cc/150?u=featured-${index}`,
          },
          publishedAt: new Date().toISOString(),
        }));

        setFeaturedPosts(posts);

        // Generate image placeholders
        const newPlaceholders: Record<string, { cover: string; avatar: string }> = {};

        await Promise.all(
          posts.map(async (post) => {
            const [cover, avatar] = await Promise.all([
              getBlurPlaceholder(post.coverImage),
              getBlurPlaceholder(post.author.avatar),
            ]);
            newPlaceholders[post.id] = { cover, avatar };
          })
        );

        setPlaceholders(newPlaceholders);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchFeaturedPosts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to Our Blog
            </h1>
            <p className="text-xl mb-8">
              Discover insightful articles, tutorials, and stories from our expert writers.
            </p>
            <Link
              to="/blog"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Explore Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Featured Articles
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg aspect-[2/1] mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-full mb-4" />
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map(post => (
                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Link to={`/blog/${post.id}`}>
                    <ProgressiveImage
                      src={post.coverImage}
                      placeholderSrc={placeholders[post.id]?.cover || ''}
                      alt={post.title}
                      className="w-full object-cover"
                      wrapperClassName="aspect-[2/1]"
                    />
                  </Link>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      <Link
                        to={`/blog/${post.id}`}
                        className="text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center space-x-3">
                      <ProgressiveImage
                        src={post.author.avatar}
                        placeholderSrc={placeholders[post.id]?.avatar || ''}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {post.author.name}
                        </p>
                        <time className="text-sm text-gray-500">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </time>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/blog"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View All Posts
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              About Our Blog
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We're passionate about sharing knowledge and insights. Our team of experts
              brings you the latest trends, in-depth tutorials, and thought-provoking
              articles.
            </p>
            <Link
              to="/about"
              className="inline-block px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Export with route splitting and preloading
export default withRouteSplitting(HomePage, {
  preloadPaths: ['/blog', '/about'], // Preload main navigation targets
  fallback: (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-blue-600 rounded-full animate-spin border-t-transparent" />
    </div>
  ),
}); 