import React from 'react';
import { Link } from 'react-router-dom';
import { withRouteSplitting } from '../components/routing/SplitRoute';

function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          About Us
        </h1>

        <div className="prose prose-lg mx-auto">
          <p className="lead">
            We're passionate about creating and sharing valuable content with our readers.
            Our blog is a platform for sharing insights, knowledge, and experiences.
          </p>

          <h2>Our Mission</h2>
          <p>
            To provide high-quality, engaging content that helps our readers learn,
            grow, and stay informed about the latest developments in technology
            and software development.
          </p>

          <h2>Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
            {[
              {
                name: 'John Doe',
                role: 'Lead Writer',
                avatar: 'https://i.pravatar.cc/150?u=1',
              },
              {
                name: 'Jane Smith',
                role: 'Technical Editor',
                avatar: 'https://i.pravatar.cc/150?u=2',
              },
            ].map((member) => (
              <div
                key={member.name}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>

          <h2>Get in Touch</h2>
          <p>
            We'd love to hear from you! Whether you have questions, feedback,
            or just want to say hello, feel free to reach out.
          </p>

          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/blog"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Read Our Blog
            </Link>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export with route splitting and preloading
export default withRouteSplitting(AboutPage, {
  preloadPaths: ['/blog'], // Preload blog as it's a likely next destination
  fallback: (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-blue-600 rounded-full animate-spin border-t-transparent" />
    </div>
  ),
}); 