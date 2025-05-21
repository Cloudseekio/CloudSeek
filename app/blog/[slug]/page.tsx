import React from 'react';
import { blogPosts } from '../../data/blogPosts';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find(post => post.slug === params.slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">
            The blog post you're looking for doesn't exist or has been moved.
          </p>
          <a
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Blog
          </a>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="flex items-center text-gray-600">
              <div className="mr-4">
                <span className="font-medium">{post.author.name}</span>
              </div>
              <span className="mx-2">•</span>
              <div>{post.date}</div>
              <span className="mx-2">•</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {post.category}
              </span>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              {post.excerpt}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Introduction</h2>
            <p className="text-gray-600 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Points</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-600">
              <li className="mb-2">Understanding the fundamentals</li>
              <li className="mb-2">Implementing best practices</li>
              <li className="mb-2">Optimizing for performance</li>
              <li className="mb-2">Ensuring maintainability</li>
            </ul>

            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-8">
              The key to success is understanding the fundamental principles and applying them 
              consistently in your projects.
            </blockquote>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Conclusion</h2>
            <p className="text-gray-600">
              In conclusion, staying up-to-date with the latest developments while maintaining a 
              strong grasp of the fundamentals is crucial for success in modern web development.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center">
              <div className="ml-4">
                <h3 className="font-bold text-xl">{post.author.name}</h3>
                <p className="text-gray-600">
                  Technical writer and software engineer specializing in modern web development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
} 