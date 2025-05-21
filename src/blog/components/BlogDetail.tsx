import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Clock, ChevronLeft, Facebook, Twitter, Linkedin, Copy, Check, Share2 } from 'lucide-react';
import { BlogPost } from '../../models/Blog';
import { useTheme } from '../../context/ThemeContext';

interface BlogDetailProps {
  post: BlogPost;
  relatedPosts?: BlogPost[];
  isLoading?: boolean;
}

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ post, relatedPosts = [], isLoading = false }) => {
  const { theme } = useTheme();
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [copied, setCopied] = useState(false);
  
  // Extract headings for table of contents
  useEffect(() => {
    if (!post?.content) return;
    
    // Simple regex to extract markdown headings
    const headingRegex = /^(#{2,4})\s+(.+)$/gm;
    const headings: TableOfContentsItem[] = [];
    
    let match;
    while ((match = headingRegex.exec(post.content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
      
      headings.push({ id, text, level });
    }
    
    setTableOfContents(headings);
  }, [post?.content]);
  
  // Handle copy URL
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (isLoading) {
    return (
      <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
        <div className={`h-8 w-2/3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-4`}></div>
        <div className={`h-6 w-1/4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-8`}></div>
        <div className={`h-64 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-8`}></div>
        <div className={`h-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-3`}></div>
        <div className={`h-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-3`}></div>
        <div className={`h-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-3 w-4/5`}></div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className={`p-6 text-center ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'} rounded-lg shadow-sm`}>
        <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          Blog post not found
        </h2>
        <p className="mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/blog" 
          className={`inline-flex items-center ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
        >
          <ChevronLeft size={16} className="mr-1" /> Back to all articles
        </Link>
      </div>
    );
  }
  
  return (
    <div className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>
      {/* Back button */}
      <div className="mb-6">
      <Link 
        to="/blog" 
          className={`inline-flex items-center ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
      >
          <ChevronLeft size={16} className="mr-1" /> Back to all articles
      </Link>
      </div>
      
      {/* Article header */}
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <Link 
            to={`/blog/category/${post.category.toLowerCase()}`}
            className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-blue-900 text-blue-100' : 'bg-blue-50 text-blue-700'}`}
          >
            {post.category}
          </Link>
          
          {post.tags && post.tags.slice(0, 3).map(tag => (
            <Link 
              key={tag}
              to={`/blog/tag/${tag.toLowerCase()}`}
              className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
            >
              {tag}
            </Link>
          ))}
        </div>
        
        <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center justify-between gap-y-4 mb-8">
          <div className="flex items-center">
            {post.authors && post.authors.length > 0 && (
              <div className="flex items-center mr-6">
                <img 
                  src={post.authors[0].avatar || '/images/avatars/default.jpg'} 
                  alt={post.authors[0].name}
                  className="w-10 h-10 rounded-full mr-3 border-2"
                />
                <div>
                  <span className={`block font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {post.authors[0].name}
                  </span>
                  {post.authors[0].title && (
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {post.authors[0].title}
                    </span>
                  )}
                </div>
              </div>
            )}
            
            <div className={`flex flex-wrap items-center gap-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{format(new Date(post.publishDate), 'MMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </div>
          
          {/* Share buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopyLink}
              className={`p-2 rounded-full ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors`}
              aria-label="Copy link"
              title="Copy link"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
            
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-blue-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
              } transition-colors`}
              aria-label="Share on Twitter"
              title="Share on Twitter"
            >
              <Twitter size={16} />
            </a>
            
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-blue-600' 
                  : 'bg-gray-100 hover:bg-gray-200 text-blue-800'
              } transition-colors`}
              aria-label="Share on Facebook"
              title="Share on Facebook"
            >
              <Facebook size={16} />
            </a>
            
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-blue-500' 
                  : 'bg-gray-100 hover:bg-gray-200 text-blue-700'
              } transition-colors`}
              aria-label="Share on LinkedIn"
              title="Share on LinkedIn"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </header>
      
      {/* Featured Image */}
      <div className="mb-8 rounded-lg overflow-hidden">
        <img 
          src={post.coverImage.url} 
          alt={post.coverImage.alt || post.title}
          className="w-full h-auto object-cover"
        />
        {post.coverImage.caption && (
          <div className={`text-center text-sm p-2 ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
            {post.coverImage.caption}
          </div>
        )}
      </div>
      
      {/* Article layout with optional table of contents */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Table of contents (desktop) */}
        {tableOfContents.length > 0 && (
          <aside className="hidden lg:block lg:w-1/4 sticky top-8 self-start">
            <div className={`p-5 rounded-lg ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-100'}`}>
              <h2 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Table of Contents
              </h2>
              <nav>
                <ul className="space-y-3">
                  {tableOfContents.map(item => (
                    <li 
                      key={item.id} 
                      className={`${item.level === 2 ? '' : 'ml-4'} ${item.level === 4 ? 'ml-8' : ''}`}
                    >
                      <a
                        href={`#${item.id}`}
                        className={`block text-sm hover:underline transition-colors ${
                          item.id === 'introduction'
                            ? (theme === 'dark' ? 'text-blue-400 font-medium' : 'text-blue-600 font-medium')
                            : (theme === 'dark' ? 'text-gray-400' : 'text-gray-600')
                        }`}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
        )}
        
        {/* Main content */}
        <article className={`lg:flex-1 prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </div>
      
      {/* Author bio */}
      {post.authors && post.authors.length > 0 && post.authors[0].bio && (
        <div className={`mt-12 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-100'}`}>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="sm:w-1/4 flex flex-col items-center text-center">
              <img 
                src={post.authors[0].avatar || '/images/avatars/default.jpg'} 
                alt={post.authors[0].name}
                className="w-20 h-20 rounded-full mb-4 border-2"
              />
              <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {post.authors[0].name}
              </h3>
              {post.authors[0].title && (
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {post.authors[0].title}
                </p>
              )}
              
              {post.authors[0].socialLinks && (
                <div className="flex mt-4 space-x-2">
                  {post.authors[0].socialLinks.twitter && (
                    <a 
                      href={post.authors[0].socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                      aria-label="Twitter profile"
                      title="Twitter profile"
                    >
                      <Twitter size={16} />
                    </a>
                  )}
                  {post.authors[0].socialLinks.linkedin && (
                    <a 
                      href={post.authors[0].socialLinks.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                      aria-label="LinkedIn profile"
                      title="LinkedIn profile"
                    >
                      <Linkedin size={16} />
                    </a>
                  )}
                  {post.authors[0].socialLinks.website && (
                    <a 
                      href={post.authors[0].socialLinks.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                      aria-label="Personal website"
                      title="Personal website"
                    >
                      <Share2 size={16} />
                    </a>
                  )}
                </div>
              )}
            </div>
            
            <div className="sm:w-3/4">
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                {post.authors[0].bio}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-16">
          <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Related Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map(relatedPost => (
              <div key={relatedPost.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Link to={`/blog/${relatedPost.slug}`}>
                  <img 
                    src={relatedPost.coverImage.url} 
                    alt={relatedPost.title}
                    className="w-full h-48 object-cover" 
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/blog/${relatedPost.slug}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600">
                      {relatedPost.title}
                    </h3>
                  </Link>
                  <div className="text-sm text-gray-500">
                    {format(new Date(relatedPost.publishDate), 'MMM d, yyyy')} • {relatedPost.readTime} min read
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
  );
};

export default BlogDetail; 