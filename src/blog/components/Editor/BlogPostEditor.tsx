import React, { useState, useCallback } from 'react';
import { BlogPost, BlogImage } from '../../../models/Blog';
import { useTheme } from '../../../context/ThemeContext';
import { Image as ImageIcon, Calendar } from 'lucide-react';
import ImageGallery from './ImageGallery';

interface BlogPostEditorProps {
  post?: BlogPost;
  onSave: (post: Partial<BlogPost>) => void;
  onCancel: () => void;
}

const BlogPostEditor: React.FC<BlogPostEditorProps> = ({
  post,
  onSave,
  onCancel
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [coverImage, setCoverImage] = useState<BlogImage | undefined>(post?.coverImage);
  const [publishDate, setPublishDate] = useState<string>(
    post?.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : ''
  );
  const [showImageGallery, setShowImageGallery] = useState(false);

  const handleSave = useCallback(() => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    onSave({
      ...post,
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim(),
      coverImage,
      publishedAt: publishDate ? new Date(publishDate).toISOString() : undefined,
      lastModified: new Date().toISOString()
    });
  }, [post, title, content, excerpt, coverImage, publishDate, onSave]);

  const handleImageSelect = (image: BlogImage) => {
    setCoverImage(image);
    setShowImageGallery(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            placeholder="Enter post title"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Cover Image
          </label>
          <div className="flex items-center gap-4">
            {coverImage ? (
              <div className="relative w-40 h-24">
                <img
                  src={coverImage.url}
                  alt={coverImage.alt || 'Cover image'}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => setCoverImage(undefined)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove cover image"
                >
                  <span className="sr-only">Remove</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className={`w-40 h-24 flex items-center justify-center rounded-lg border-2 border-dashed ${
                isDark ? 'border-gray-700' : 'border-gray-300'
              }`}>
                <ImageIcon className={isDark ? 'text-gray-600' : 'text-gray-400'} />
              </div>
            )}
            <button
              onClick={() => setShowImageGallery(true)}
              className={`px-4 py-2 rounded-lg ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              {coverImage ? 'Change Image' : 'Select Image'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            className={`w-full px-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            placeholder="Write your post content here..."
          />
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className={`w-full px-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            placeholder="Write a brief excerpt..."
          />
        </div>

        {/* Publish Date */}
        <div>
          <label htmlFor="publish-schedule" className="block text-sm font-medium mb-2">
            Schedule Publish Date
          </label>
          <div className="flex items-center gap-2">
            <Calendar size={20} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            <input
              id="publish-schedule"
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              aria-label="Schedule publish date"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className={`px-6 py-2 rounded-lg ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
          >
            Save
          </button>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {showImageGallery && (
        <ImageGallery
          onSelect={handleImageSelect}
          onClose={() => setShowImageGallery(false)}
        />
      )}
    </div>
  );
};

export default BlogPostEditor; 