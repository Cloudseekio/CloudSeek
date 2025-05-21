import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import type { BlogPost } from '../../models/Blog';
import { useTheme } from '../../context/ThemeContext';
import ShareButtons from './social/ShareButtons';
import TableOfContents from './TableOfContents';
import ContentRenderer from './ContentRenderer';
import { TocItem } from '../types/blog';
import { formatDate } from '../../utils/dateUtils';

interface BlogPostProps {
  post: BlogPost;
  className?: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ post, className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleHeadingsExtracted = (items: TocItem[]) => {
    setTocItems(items);
  };

  // Function to handle scroll events and update active heading
  const handleScroll = () => {
    if (!contentRef.current) return;

    const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4');
    let currentHeading = '';
    
    headings.forEach((heading) => {
      const rect = heading.getBoundingClientRect();
      if (rect.top <= 150) {
        currentHeading = heading.id;
      }
    });
    
    if (currentHeading) {
      setActiveHeading(currentHeading);
    }
  };

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const HeaderSection = () => (
    <div className="mb-8">
      {/* Back Navigation */}
      <Link
        to="/blog"
        className={`inline-flex items-center mb-6 text-sm font-medium ${
          isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
        } transition-colors`}
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Blog
      </Link>

      {/* Category Badge */}
      {post.category && (
        <Link
          to={`/blog?category=${post.category.slug}`}
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
            isDark
              ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          } transition-colors`}
        >
          {post.category.name}
        </Link>
      )}

      {/* Title */}
      <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        {post.title}
      </h1>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        {/* Author */}
        {post.authors[0] && (
          <div className="flex items-center">
            {post.authors[0].avatar && (
              <img
                src={post.authors[0].avatar}
                alt={post.authors[0].name}
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              {post.authors[0].name}
            </span>
          </div>
        )}

        {/* Date */}
        <div className={`flex items-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <Calendar size={16} className="mr-1" />
          {formatDate(post.publishedAt)}
        </div>

        {/* Reading Time */}
        <div className={`flex items-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <Clock size={16} className="mr-1" />
          {post.readingTime} min read
        </div>
      </div>
    </div>
  );

  const ContentContainer = () => (
    <div className="my-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="md:w-3/4" ref={contentRef}>
          <div className="prose prose-lg max-w-none">
            <ContentRenderer
              content={post.rawContent || post.content}
              format={post.contentFormat || 'html'}
              onHeadingsExtracted={handleHeadingsExtracted}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="sticky top-20">
            {tocItems.length > 0 && (
              <div className="mb-8">
                <TableOfContents 
                  items={tocItems} 
                  activeId={activeHeading}
                  maxDepth={3}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const FooterSection = () => (
    <div className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} pt-8`}>
      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mb-6">
          <h3 className={`text-sm font-medium mb-3 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Tagged with
          </h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Link
                key={tag.id}
                to={`/blog?tag=${tag.slug}`}
                className={`px-3 py-1 rounded-full text-sm ${
                  isDark
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Share Buttons */}
      <ShareButtons
        url={window.location.href}
        title={post.title}
        description={post.excerpt}
        tags={post.tags.map(tag => tag.name)}
      />
    </div>
  );

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${className}`}>
      <HeaderSection />
      <ContentContainer />
      <FooterSection />
    </div>
  );
};

export default BlogPost; 