import React, { useState } from 'react';
import { Twitter, Facebook, Linkedin } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { BlogPost } from '../../../models/Blog';

interface SocialPreviewProps {
  post: BlogPost;
  className?: string;
}

type Platform = 'twitter' | 'facebook' | 'linkedin';

const SocialPreview: React.FC<SocialPreviewProps> = ({ post, className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [platform, setPlatform] = useState<Platform>('twitter');

  const siteUrl = 'https://cloudseek.com';
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  const getCharacterLimit = (platform: Platform): number => {
    switch (platform) {
      case 'twitter':
        return 280;
      case 'facebook':
        return 63;
      case 'linkedin':
        return 220;
    }
  };

  const getTruncatedText = (text: string, limit: number): string => {
    if (text.length <= limit) return text;
    return text.substring(0, limit - 3) + '...';
  };

  const getPlatformStyles = () => {
    switch (platform) {
      case 'twitter':
        return {
          bg: isDark ? 'bg-gray-900' : 'bg-white',
          border: isDark ? 'border-gray-800' : 'border-gray-200',
          font: 'font-chirp',
        };
      case 'facebook':
        return {
          bg: isDark ? 'bg-[#242526]' : 'bg-white',
          border: isDark ? 'border-gray-700' : 'border-gray-300',
          font: 'font-helvetica',
        };
      case 'linkedin':
        return {
          bg: isDark ? 'bg-[#1B1F23]' : 'bg-white',
          border: isDark ? 'border-gray-800' : 'border-gray-200',
          font: 'font-system',
        };
    }
  };

  const styles = getPlatformStyles();

  return (
    <div className={`${className} ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Social Media Preview</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setPlatform('twitter')}
            className={`p-2 rounded-lg transition-colors ${
              platform === 'twitter'
                ? 'bg-blue-500 text-white'
                : isDark
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            aria-label="Twitter Preview"
          >
            <Twitter size={24} />
          </button>
          <button
            onClick={() => setPlatform('facebook')}
            className={`p-2 rounded-lg transition-colors ${
              platform === 'facebook'
                ? 'bg-blue-600 text-white'
                : isDark
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            aria-label="Facebook Preview"
          >
            <Facebook size={24} />
          </button>
          <button
            onClick={() => setPlatform('linkedin')}
            className={`p-2 rounded-lg transition-colors ${
              platform === 'linkedin'
                ? 'bg-blue-700 text-white'
                : isDark
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            aria-label="LinkedIn Preview"
          >
            <Linkedin size={24} />
          </button>
        </div>
      </div>

      <div
        className={`rounded-lg border ${styles.bg} ${styles.border} overflow-hidden ${styles.font}`}
      >
        {/* Preview Card */}
        <div className="p-4">
          {/* Image */}
          {post.coverImage.url && (
            <div className="relative aspect-[1.91/1] mb-4 rounded-lg overflow-hidden">
              <img
                src={post.coverImage.url}
                alt={post.coverImage.alt || post.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="space-y-2">
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {platform === 'twitter' ? '@cloudseek' : 'CloudSeek'}
            </div>
            <h3 className="font-bold">
              {getTruncatedText(post.title, getCharacterLimit(platform))}
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {getTruncatedText(post.excerpt, getCharacterLimit(platform))}
            </p>
            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {postUrl}
            </div>
          </div>
        </div>

        {/* Character Count */}
        <div className={`px-4 py-2 border-t ${styles.border}`}>
          <div className="flex justify-between items-center">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Character Count
            </span>
            <span className={`text-sm font-mono ${
              post.excerpt.length > getCharacterLimit(platform)
                ? 'text-red-500'
                : isDark
                ? 'text-gray-400'
                : 'text-gray-600'
            }`}>
              {post.excerpt.length} / {getCharacterLimit(platform)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialPreview; 