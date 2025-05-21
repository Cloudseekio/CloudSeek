import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { withRouteSplitting } from '../components/routing/SplitRoute';
import { ProgressiveImage } from '../components/image/ProgressiveImage';
import { getBlurPlaceholder } from '../utils/imageBlur';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishedAt: string;
  readingTime: string;
}

function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [coverPlaceholder, setCoverPlaceholder] = useState<string>('');
  const [avatarPlaceholder, setAvatarPlaceholder] = useState<string>('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock post data
        const mockPost: BlogPost = {
          id: id!,
          title: `Blog Post ${id}`,
          content: `
            This is a detailed blog post content. It includes multiple paragraphs
            of text to demonstrate the layout and styling of a full article.

            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.

            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          `.trim(),
          coverImage: `https://picsum.photos/seed/${id}/1200/600`,
          author: {
            name: 'John Doe',
            avatar: `https://i.pravatar.cc/150?u=${id}`,
            bio: 'Technical writer and software developer with a passion for creating engaging content.',
          },
          publishedAt: new Date().toISOString(),
          readingTime: '5 min read',
        };

        setPost(mockPost);

        // Generate image placeholders
        const [cover, avatar] = await Promise.all([
          getBlurPlaceholder(mockPost.coverImage),
          getBlurPlaceholder(mockPost.author.avatar),
        ]);

        setCoverPlaceholder(cover);
        setAvatarPlaceholder(avatar);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPost();
  }, [id]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Post
          </h1>
          <p className="text-gray-600 mb-8">{error.message}</p>
          <Link
            to="/blog"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !post) {
    return null; // Using fallback from withRouteSplitting
  }

  return (
    <article className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        {/* Cover Image */}
        <div className="mb-8">
          <ProgressiveImage
            src={post.coverImage}
            placeholderSrc={coverPlaceholder}
            alt={post.title}
            className="w-full rounded-lg shadow-lg"
            wrapperClassName="aspect-[2/1]"
          />
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center space-x-4">
            <ProgressiveImage
              src={post.author.avatar}
              placeholderSrc={avatarPlaceholder}
              alt={post.author.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-sm text-gray-600">
                {new Date(post.publishedAt).toLocaleDateString()} · {post.readingTime}
              </p>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg mx-auto">
          {post.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-between items-center pt-8 border-t">
          <Link
            to="/blog"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Blog
          </Link>
          <Link
            to={`/blog/${parseInt(id!) + 1}`}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Next Post →
          </Link>
        </div>
      </div>
    </article>
  );
}

// Export with route splitting and preloading
export default withRouteSplitting(BlogPostPage, {
  preloadPaths: ['/blog'], // Preload blog listing for back navigation
  fallback: (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-blue-600 rounded-full animate-spin border-t-transparent" />
    </div>
  ),
}); 