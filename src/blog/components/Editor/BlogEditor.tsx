import React, { useState } from 'react';
import { BlogPost } from '../../../models/Blog';
import SEOAnalyzer from '../SEO/SEOAnalyzer';
import SocialPreview from '../SEO/SocialPreview';
import { useTheme } from '../../../context/ThemeContext';

interface BlogEditorProps {
  post: BlogPost;
  onSave: (post: BlogPost) => void;
  className?: string;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ post, onSave, className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'editor' | 'seo' | 'preview'>('editor');
  const [editedPost, setEditedPost] = useState<BlogPost>(post);

  const handleChange = (field: keyof BlogPost, value: string | string[]) => {
    setEditedPost(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(editedPost);
  };

  return (
    <div className={`${className} ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('editor')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'editor'
              ? 'bg-blue-500 text-white'
              : isDark
              ? 'bg-gray-800 hover:bg-gray-700'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Editor
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'seo'
              ? 'bg-blue-500 text-white'
              : isDark
              ? 'bg-gray-800 hover:bg-gray-700'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          SEO
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'preview'
              ? 'bg-blue-500 text-white'
              : isDark
              ? 'bg-gray-800 hover:bg-gray-700'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Social Preview
        </button>
      </div>

      {/* Editor Content */}
      <div className="space-y-6">
        {activeTab === 'editor' && (
          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={editedPost.title}
                onChange={e => handleChange('title', e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-300'
                }`}
                placeholder="Enter post title"
              />
            </div>

            {/* Excerpt Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Excerpt</label>
              <textarea
                value={editedPost.excerpt}
                onChange={e => handleChange('excerpt', e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-300'
                }`}
                rows={3}
                placeholder="Enter post excerpt"
              />
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                value={editedPost.content}
                onChange={e => handleChange('content', e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-300'
                }`}
                rows={10}
                placeholder="Write your post content"
              />
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <input
                type="text"
                value={editedPost.tags.join(', ')}
                onChange={e => handleChange('tags', e.target.value.split(', '))}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-300'
                }`}
                placeholder="Enter tags, separated by commas"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save Post
            </button>
          </div>
        )}

        {/* SEO Analysis */}
        {activeTab === 'seo' && (
          <SEOAnalyzer post={editedPost} />
        )}

        {/* Social Preview */}
        {activeTab === 'preview' && (
          <SocialPreview post={editedPost} />
        )}
      </div>
    </div>
  );
};

export default BlogEditor; 