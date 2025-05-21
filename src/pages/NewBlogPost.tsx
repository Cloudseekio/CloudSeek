import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogPost } from '../models/Blog';
import { blogPublishingService } from '../blog/services/blogPublishingService';
import BlogPostEditor from '../blog/components/editor/BlogPostEditor';

const NewBlogPost: React.FC = () => {
  const navigate = useNavigate();

  const handleSave = async (post: Partial<BlogPost>) => {
    try {
      // Create a draft post
      const savedPost = await blogPublishingService.createDraft(post);
      
      // Navigate to the published post
      navigate(`/blog/${savedPost.slug}`);
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Failed to save blog post. Please try again.');
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to discard this post?')) {
      navigate('/blog');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Create New Blog Post
        </h1>
        
        <BlogPostEditor
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default NewBlogPost; 