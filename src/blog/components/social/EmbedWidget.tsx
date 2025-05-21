import React, { useState } from 'react';
import { Code, Copy, Check } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { BlogPost } from '../../../models/Blog';

interface EmbedWidgetProps {
  post: BlogPost;
  siteUrl: string;
  className?: string;
}

const EmbedWidget: React.FC<EmbedWidgetProps> = ({
  post,
  siteUrl,
  className = ''
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState(false);

  const embedCode = `<iframe src="${siteUrl}/blog/embed/${post.slug}" width="100%" height="400" frameborder="0" scrolling="no" title="${post.title}"></iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy embed code:', err);
    }
  };

  return (
    <div className={`rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Code size={18} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              Embed this post
            </span>
          </div>
          <button
            onClick={handleCopy}
            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
              isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
            }`}
          >
            {copied ? (
              <>
                <Check size={16} className="text-green-500" />
                <span className="text-sm">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span className="text-sm">Copy code</span>
              </>
            )}
          </button>
        </div>
        <pre className={`p-3 rounded-md text-sm font-mono whitespace-pre-wrap break-all ${
          isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'
        }`}>
          {embedCode}
        </pre>
      </div>
    </div>
  );
};

export default EmbedWidget; 