import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePostQuery, useRelatedPostsQuery } from '../hooks/useBlogQuery';
import { useTheme } from '../../context/ThemeContext';
import UnifiedContentRenderer from './UnifiedContentRenderer';
import ContentfulErrorBoundary from './error/ContentfulErrorBoundary';
import { 
  Clock, 
  Calendar, 
  ChevronUp, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Link2, 
  Share2, 
  Bookmark, 
  BookmarkCheck,
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { TocItem, isCategoryObject } from '../types/blog';
import TableOfContents from './TableOfContents';
import AuthorProfile from './AuthorProfile';

const BlogDetailEnhanced: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { theme } = useTheme();
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState('');
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  const { data: post, isLoading, error } = usePostQuery(slug || '');
  // Store the related posts query result but don't reference it yet, we'll use it in the sidebar component
  useRelatedPostsQuery(
    post?.id || '', 
    post?.category && isCategoryObject(post.category) ? post.category.id : ''
  );
  
  // Check if post is bookmarked
  useEffect(() => {
    if (!post) return;
    
    const bookmarks = JSON.parse(localStorage.getItem('blog_bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(post.id));
  }, [post]);
  
  // Handle bookmark toggle
  const toggleBookmark = () => {
    if (!post) return;
    
    const bookmarks = JSON.parse(localStorage.getItem('blog_bookmarks') || '[]');
    
    if (isBookmarked) {
      const newBookmarks = bookmarks.filter((id: string) => id !== post.id);
      localStorage.setItem('blog_bookmarks', JSON.stringify(newBookmarks));
      setIsBookmarked(false);
    } else {
      bookmarks.push(post.id);
      localStorage.setItem('blog_bookmarks', JSON.stringify(bookmarks));
      setIsBookmarked(true);
    }
  };
  
  // Handle headings extracted from the content renderer
  const handleHeadingsExtracted = (headings: TocItem[]) => {
    setTocItems(headings);
  };
  
  // Handle reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;
      
      const totalHeight = articleRef.current.clientHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      
      // Calculate reading progress
      const currentProgress = (scrollTop / (totalHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(currentProgress, 100));
      
      // Show/hide scroll to top button
      setShowScrollToTop(scrollTop > 500);
      
      // Update active heading in table of contents
      const headings = articleRef.current.querySelectorAll('h1, h2, h3, h4');
      let currentActiveHeading = '';
      
      headings.forEach((heading) => {
        const headingTop = heading.getBoundingClientRect().top;
        
        if (headingTop < windowHeight / 3) {
          currentActiveHeading = heading.id;
        }
      });
      
      setActiveHeading(currentActiveHeading);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Track reading history
  useEffect(() => {
    if (!post) return;
    
    const now = new Date().toISOString();
    const historyItem = {
      id: post.id,
      slug: post.slug,
      title: post.title,
      timestamp: now,
    };
    
    const history = JSON.parse(localStorage.getItem('blog_reading_history') || '[]');
    
    // Remove this post if it exists already
    const newHistory = history.filter((item: { id: string }) => item.id !== post.id);
    
    // Add to the start of the array
    newHistory.unshift(historyItem);
    
    // Keep only the most recent 20 items
    if (newHistory.length > 20) {
      newHistory.pop();
    }
    
    localStorage.setItem('blog_reading_history', JSON.stringify(newHistory));
  }, [post]);
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Share functions
  const shareUrl = window.location.href;
  const shareTitle = post?.title || '';
  
  const shareSocial = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    let url = '';
    
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
    }
    
    window.open(url, '_blank', 'width=600,height=400');
  };
  
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    // You could add a toast notification here
  };
  
  // Format date from post data
  const getPublishDate = () => {
    if (!post) return new Date().toISOString();
    return post.publishedAt || new Date().toISOString();
  };
  
  // Handle retry for ContentfulErrorBoundary
  const handleRetry = () => {
    // Refetch the post data
    window.location.reload(); // Simple approach - reload the page
  };
  
  if (isLoading) {
    return (
      <div className={`container mx-auto px-4 py-8 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
        <div className="animate-pulse">
          <div className={`h-10 w-3/4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded mb-4`}></div>
          <div className={`h-6 w-1/2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded mb-8`}></div>
          <div className={`h-64 w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded mb-8`}></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`h-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded w-full`}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className={`container mx-auto px-4 py-8 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
        <h1 className="text-2xl font-bold mb-4">Error loading blog post</h1>
        <p>We couldn't load the blog post you requested. Please try again later.</p>
        <Link to="/blog" className={`mt-4 inline-block ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
          Return to blog
        </Link>
      </div>
    );
  }

  // Get publish date once
  const publishDate = getPublishDate();
  
  // Content section
  const ContentContainer = () => (
    <ContentfulErrorBoundary onRetry={handleRetry}>
      <div className="lg:col-span-2 xl:col-span-3">
        {post && (
          <article 
            ref={articleRef} 
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            <UnifiedContentRenderer
              content={post.content}
              contentFormat={'html'}
              onHeadingsExtracted={handleHeadingsExtracted}
            />
          </article>
        )}
      </div>
    </ContentfulErrorBoundary>
  );
  
  return (
    <>
      {/* Reading progress bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-blue-500 z-50 transition-all duration-300" 
        style={{ width: `${readingProgress}%` }}
      />
      
      <div className={`container mx-auto px-4 py-8 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
        {/* Back to blogs link */}
        <div className="mb-8">
          <Link 
            to="/blog" 
            className={`inline-flex items-center ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
          >
            <ChevronUp className="rotate-270 w-5 h-5 mr-1 transform rotate-[-90deg]" />
            <span>Back to blogs</span>
          </Link>
        </div>
        
        {/* Article header */}
        <header className="mb-12 max-w-4xl mx-auto text-center">
          {/* Category */}
          {post.category && isCategoryObject(post.category) && (
                <Link 
              to={`/blog/category/${post.category.slug}`}
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                    theme === 'dark' 
                      ? 'bg-blue-900 text-blue-200 hover:bg-blue-800' 
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
              {post.category.name}
                </Link>
              )}
              
          {/* Title */}
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {post.title}
              </h1>
              
          {/* Post metadata */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
            {/* Date */}
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1.5" />
              <time dateTime={publishDate}>
                {formatDate(publishDate)}
                  </time>
                </div>
                
            {/* Reading time */}
                <div className="flex items-center">
                  <Clock size={16} className="mr-1.5" />
              <span>{post.readingTime} min read</span>
                </div>
                
            {/* Bookmark button */}
                <button 
                  onClick={toggleBookmark}
                  className={`flex items-center ${
                    theme === 'dark' 
                      ? 'hover:text-blue-400' 
                      : 'hover:text-blue-600'
                  }`}
                  aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  {isBookmarked ? (
                <BookmarkCheck size={16} className="mr-1.5" />
                  ) : (
                    <Bookmark size={16} className="mr-1.5" />
                  )}
                  <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
                </button>
                
            {/* Share button */}
                <div className="relative">
                  <button
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    className={`flex items-center ${
                      theme === 'dark' 
                        ? 'hover:text-blue-400' 
                        : 'hover:text-blue-600'
                    }`}
                    aria-label="Share post"
                  >
                    <Share2 size={16} className="mr-1.5" />
                    <span>Share</span>
                  </button>
                  
                  {showShareOptions && (
                <div 
                  className={`absolute right-0 mt-2 py-2 w-48 rounded-md shadow-lg z-10 ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
                  }`}
                >
                      <button 
                        onClick={() => shareSocial('facebook')}
                    className={`w-full text-left px-4 py-2 flex items-center ${
                          theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                    <Facebook size={16} className="mr-3" />
                    <span>Facebook</span>
                      </button>
                      <button 
                        onClick={() => shareSocial('twitter')}
                    className={`w-full text-left px-4 py-2 flex items-center ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Twitter size={16} className="mr-3" />
                    <span>Twitter</span>
                      </button>
                      <button 
                        onClick={() => shareSocial('linkedin')}
                    className={`w-full text-left px-4 py-2 flex items-center ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Linkedin size={16} className="mr-3" />
                    <span>LinkedIn</span>
                      </button>
                      <button 
                        onClick={copyLink}
                    className={`w-full text-left px-4 py-2 flex items-center ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Link2 size={16} className="mr-3" />
                    <span>Copy link</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>
            
        {/* Cover image */}
            {post.coverImage && (
          <div className="mb-12 max-w-5xl mx-auto">
            <figure>
                <img 
                  src={post.coverImage.url} 
                alt={post.coverImage.alt || post.title} 
                className="w-full h-auto rounded-lg object-cover"
                style={{ maxHeight: '600px' }}
              />
              {post.coverImage.alt && (
                <figcaption className={`text-center text-sm mt-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {post.coverImage.alt}
                  </figcaption>
                )}
              </figure>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main content column */}
          <ContentContainer />
          
          {/* Sidebar */}
          <aside className="lg:w-1/3 lg:pl-8" ref={sidebarRef}>
            <div className="sticky top-24">
              {/* Table of contents */}
              {tocItems.length > 0 && (
                <div className={`p-6 rounded-lg mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Table of Contents
                  </h3>
                  <TableOfContents 
                    items={tocItems} 
                    activeId={activeHeading}
                    maxDepth={3}
                  />
                </div>
              )}
              
              {/* Featured author in sidebar */}
              {post.authors && post.authors.length > 0 && (
                <div className={`p-6 rounded-lg mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Written by
                  </h3>
                  <AuthorProfile 
                    author={post.authors[0]} 
                    showFullBio={false}
                    avatarSize="small"
                  />
                </div>
              )}
              
              {/* Share card */}
              <div className={`p-6 rounded-lg mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Share this article
                </h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => shareSocial('facebook')}
                    className={`p-2 rounded-full ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' 
                        : 'bg-gray-200 hover:bg-gray-300 text-blue-600'
                    }`}
                    aria-label="Share on Facebook"
                  >
                    <Facebook size={20} />
                  </button>
                  <button
                    onClick={() => shareSocial('twitter')}
                    className={`p-2 rounded-full ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' 
                        : 'bg-gray-200 hover:bg-gray-300 text-blue-600'
                    }`}
                    aria-label="Share on Twitter"
                  >
                    <Twitter size={20} />
                  </button>
                  <button
                    onClick={() => shareSocial('linkedin')}
                    className={`p-2 rounded-full ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' 
                        : 'bg-gray-200 hover:bg-gray-300 text-blue-600'
                    }`}
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin size={20} />
                  </button>
                  <button
                    onClick={copyLink}
                    className={`p-2 rounded-full ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' 
                        : 'bg-gray-200 hover:bg-gray-300 text-blue-600'
                    }`}
                    aria-label="Copy link"
                  >
                    <Link2 size={20} />
                  </button>
                </div>
              </div>
              
              {/* More from this category */}
              {post.category && isCategoryObject(post.category) && (
                <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    More from {post.category.name}
                  </h3>
                  <Link 
                    to={`/blog/category/${post.category.slug}`}
                    className={`inline-block mt-2 text-sm font-medium ${
                      theme === 'dark' 
                        ? 'text-blue-400 hover:text-blue-300' 
                        : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    View all {post.category.name} posts
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
      
      {/* Scroll to top button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg z-50 transition-all ${
            theme === 'dark'
              ? 'bg-gray-800 text-white hover:bg-gray-700'
              : 'bg-white text-gray-800 hover:bg-gray-100'
          }`}
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </>
  );
};

export default BlogDetailEnhanced; 