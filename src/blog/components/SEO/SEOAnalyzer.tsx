import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { BlogPost } from '../../../models/Blog';
import { useTheme } from '../../../context/ThemeContext';

interface SEOAnalyzerProps {
  post: BlogPost;
  className?: string;
}

interface SEOCheck {
  id: string;
  title: string;
  description: string;
  status: 'good' | 'warning' | 'error';
  priority: 'high' | 'medium' | 'low';
  suggestion?: string;
}

const SEOAnalyzer: React.FC<SEOAnalyzerProps> = ({ post, className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const analyzeSEO = (): SEOCheck[] => {
    const checks: SEOCheck[] = [];

    // Title checks
    if (!post.title) {
      checks.push({
        id: 'title-missing',
        title: 'Missing Title',
        description: 'The post must have a title',
        status: 'error',
        priority: 'high',
        suggestion: 'Add a descriptive title to your post'
      });
    } else {
      const titleLength = post.title.length;
      if (titleLength < 30) {
        checks.push({
          id: 'title-short',
          title: 'Title Length',
          description: 'Title is too short for optimal SEO',
          status: 'warning',
          priority: 'medium',
          suggestion: 'Make your title between 30-60 characters for better SEO'
        });
      } else if (titleLength > 60) {
        checks.push({
          id: 'title-long',
          title: 'Title Length',
          description: 'Title might be truncated in search results',
          status: 'warning',
          priority: 'medium',
          suggestion: 'Keep your title under 60 characters'
        });
      } else {
        checks.push({
          id: 'title-good',
          title: 'Title Length',
          description: 'Title length is optimal',
          status: 'good',
          priority: 'high'
        });
      }
    }

    // Meta description checks
    if (!post.excerpt) {
      checks.push({
        id: 'desc-missing',
        title: 'Missing Meta Description',
        description: 'The post should have a meta description',
        status: 'error',
        priority: 'high',
        suggestion: 'Add a compelling meta description'
      });
    } else {
      const descLength = post.excerpt.length;
      if (descLength < 120) {
        checks.push({
          id: 'desc-short',
          title: 'Meta Description Length',
          description: 'Meta description is too short',
          status: 'warning',
          priority: 'medium',
          suggestion: 'Make your meta description between 120-155 characters'
        });
      } else if (descLength > 155) {
        checks.push({
          id: 'desc-long',
          title: 'Meta Description Length',
          description: 'Meta description might be truncated',
          status: 'warning',
          priority: 'medium',
          suggestion: 'Keep your meta description under 155 characters'
        });
      } else {
        checks.push({
          id: 'desc-good',
          title: 'Meta Description Length',
          description: 'Meta description length is optimal',
          status: 'good',
          priority: 'high'
        });
      }
    }

    // Content length check
    const wordCount = post.content.split(/\s+/).length;
    if (wordCount < 300) {
      checks.push({
        id: 'content-short',
        title: 'Content Length',
        description: 'Content might be too thin',
        status: 'warning',
        priority: 'high',
        suggestion: 'Add more valuable content, aim for at least 300 words'
      });
    } else {
      checks.push({
        id: 'content-good',
        title: 'Content Length',
        description: `Content length is good (${wordCount} words)`,
        status: 'good',
        priority: 'high'
      });
    }

    // Image optimization checks
    if (!post.coverImage.url) {
      checks.push({
        id: 'image-missing',
        title: 'Missing Featured Image',
        description: 'Posts should have a featured image',
        status: 'error',
        priority: 'high',
        suggestion: 'Add a relevant featured image'
      });
    } else if (!post.coverImage.alt) {
      checks.push({
        id: 'image-alt',
        title: 'Image Alt Text',
        description: 'Featured image is missing alt text',
        status: 'warning',
        priority: 'medium',
        suggestion: 'Add descriptive alt text to your featured image'
      });
    }

    // URL slug check
    if (!post.slug) {
      checks.push({
        id: 'slug-missing',
        title: 'Missing URL Slug',
        description: 'The post must have a URL slug',
        status: 'error',
        priority: 'high',
        suggestion: 'Add a URL-friendly slug'
      });
    } else if (post.slug.length > 60) {
      checks.push({
        id: 'slug-long',
        title: 'URL Length',
        description: 'URL slug is too long',
        status: 'warning',
        priority: 'medium',
        suggestion: 'Keep the URL slug concise and under 60 characters'
      });
    }

    return checks;
  };

  const seoChecks = analyzeSEO();
  const score = Math.round(
    (seoChecks.filter(check => check.status === 'good').length / seoChecks.length) * 100
  );

  const getScoreColor = () => {
    if (score >= 80) return isDark ? 'text-green-400' : 'text-green-600';
    if (score >= 60) return isDark ? 'text-yellow-400' : 'text-yellow-600';
    return isDark ? 'text-red-400' : 'text-red-600';
  };

  const getStatusIcon = (status: SEOCheck['status']) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'error':
        return <AlertTriangle className="text-red-500" size={20} />;
    }
  };

  return (
    <div className={`${className} ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">SEO Analysis</h2>
        <div className={`text-2xl font-bold ${getScoreColor()}`}>
          {score}/100
        </div>
      </div>

      <div className="space-y-4">
        {seoChecks.map(check => (
          <div
            key={check.id}
            className={`p-4 rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } shadow-sm`}
          >
            <div className="flex items-start gap-3">
              {getStatusIcon(check.status)}
              <div className="flex-1">
                <h3 className="font-medium">{check.title}</h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {check.description}
                </p>
                {check.suggestion && (
                  <div className="mt-2 flex items-start gap-2">
                    <Info size={16} className="text-blue-500 mt-0.5" />
                    <p className={`text-sm ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      {check.suggestion}
                    </p>
                  </div>
                )}
              </div>
              <div className={`text-xs px-2 py-1 rounded ${
                check.priority === 'high'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : check.priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {check.priority}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SEOAnalyzer; 