import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlogPost } from '../../models/Blog';
import { useBlog } from '../hooks/useBlog';
import BlogPostEditor from '../components/Editor/BlogPostEditor';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft } from 'lucide-react';

const BlogEditorPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const {
    currentPost,
    authors,
    categories,
    tags,
    fetchPostBySlug,
    fetchAuthors,
    fetchCategories,
    fetchTags,
    error,
    isLoading
  } = useBlog();

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchAuthors(),
        fetchCategories(),
        fetchTags(),
        slug ? fetchPostBySlug(slug) : Promise.resolve()
      ]);
    };

    loadData();
  }, [fetchAuthors, fetchCategories, fetchTags, fetchPostBySlug, slug]);

  const handleSave = async (post: BlogPost) => {
    setIsSaving(true);
    try {
      // Save post logic here
      // Navigate to the published post
      navigate(`/blog/${post.slug}`);
    } catch (error) {
      console.error('Failed to save post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className={`text-xl ${isDark ? 'text-red-400' : 'text-red-600'}`}>
          {error.message}
        </div>
        <button
          onClick={() => navigate('/blog')}
          className={`mt-4 px-4 py-2 rounded-lg ${
            isDark
              ? 'bg-gray-800 text-white hover:bg-gray-700'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
        >
          Return to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/blog')}
          className={`flex items-center space-x-2 ${
            isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowLeft size={20} />
          <span>Back to Blog</span>
        </button>
        <h1 className={`text-2xl font-bold mt-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {slug ? 'Edit Post' : 'Create New Post'}
        </h1>
      </div>

      {/* Editor */}
      <BlogPostEditor
        post={currentPost || undefined}
        authors={authors}
        categories={categories}
        tags={tags}
        onSave={handleSave}
        className={isSaving ? 'opacity-50 pointer-events-none' : ''}
      />
    </div>
  );
};

export default BlogEditorPage; 