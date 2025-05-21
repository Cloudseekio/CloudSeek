import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getContentfulService } from '../services/serviceFactory';
import ContentRenderer from '../components/ContentRenderer';
import { TocItem, BlogPost } from '../types/blog';
import { useTheme } from '../../context/ThemeContext';
import { AlertTriangle, Bug, FileText, RefreshCw } from 'lucide-react';
import logger from '../../utils/logger';

const BlogpostDebugPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [showRaw, setShowRaw] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Load the blog post
  useEffect(() => {
    async function loadPost() {
      if (!slug) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const contentfulService = getContentfulService();
        const fetchedPost = await contentfulService.getPostBySlug(slug);
        
        if (fetchedPost) {
          logger.info(`Post loaded: ${fetchedPost.title}`);
          logger.debug(`Content format: ${fetchedPost.contentFormat}`);
          logger.debug(`Content length: ${typeof fetchedPost.content === 'string' ? fetchedPost.content.length : 'object'}`);
          setPost(fetchedPost);
        } else {
          setError(`No post found with slug "${slug}"`);
        }
      } catch (err) {
        logger.error('Error loading post:', err);
        setError(`Failed to load blog post: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    }
    
    loadPost();
  }, [slug]);

  // Handle extracted headings for table of contents
  const handleHeadingsExtracted = (extractedHeadings: TocItem[]) => {
    setHeadings(extractedHeadings);
  };

  // Refresh the post data
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const contentfulService = getContentfulService();
      contentfulService.clearCache();
      const fetchedPost = await contentfulService.getPostBySlug(slug as string);
      
      if (fetchedPost) {
        setPost(fetchedPost);
      } else {
        setError(`No post found with slug "${slug}"`);
      }
    } catch (err) {
      setError(`Failed to refresh blog post: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // Toggle raw content view
  const toggleRawView = () => {
    setShowRaw(!showRaw);
  };

  // Display loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-lg">Loading blog post...</span>
          </div>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className={`p-6 rounded-lg border ${isDark ? 'bg-red-900/20 border-red-800 text-red-200' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <div className="flex items-center mb-4">
              <AlertTriangle className="mr-2" size={24} />
              <h2 className="text-xl font-semibold">Error Loading Blog Post</h2>
            </div>
            <p className="mb-4">{error}</p>
            <button 
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              <RefreshCw size={16} className="mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Display post not found state
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className={`p-6 rounded-lg border ${isDark ? 'bg-yellow-900/20 border-yellow-800 text-yellow-200' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
            <div className="flex items-center mb-4">
              <FileText className="mr-2" size={24} />
              <h2 className="text-xl font-semibold">Blog Post Not Found</h2>
            </div>
            <p className="mb-4">The blog post with slug "{slug}" could not be found.</p>
            <button 
              onClick={() => window.history.back()}
              className="flex items-center px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Debug controls */}
        <div className={`mb-6 p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Bug size={20} className="mr-2" />
              <h2 className="text-lg font-semibold">Debug Information</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                className="flex items-center px-3 py-1 rounded text-sm bg-blue-600 text-white hover:bg-blue-700"
              >
                <RefreshCw size={14} className="mr-1" />
                Refresh
              </button>
              <button
                onClick={toggleRawView}
                className={`flex items-center px-3 py-1 rounded text-sm ${
                  showRaw 
                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {showRaw ? 'Show Rendered' : 'Show Raw Content'}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium mb-1">Post ID:</p>
              <p className="text-sm font-mono bg-gray-200 dark:bg-gray-700 p-1 rounded">{post.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Slug:</p>
              <p className="text-sm font-mono bg-gray-200 dark:bg-gray-700 p-1 rounded">{post.slug}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Content Format:</p>
              <p className="text-sm font-mono bg-gray-200 dark:bg-gray-700 p-1 rounded">{post.contentFormat}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Content Length:</p>
              <p className="text-sm font-mono bg-gray-200 dark:bg-gray-700 p-1 rounded">
                {typeof post.content === 'string' 
                  ? `${post.content.length} chars` 
                  : 'Rich Text Object'}
              </p>
            </div>
          </div>
          
          <details className="text-sm">
            <summary className="cursor-pointer font-medium mb-2">Content Structure Details</summary>
            <pre className={`whitespace-pre-wrap text-xs p-2 rounded overflow-auto ${
              isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-200 text-gray-800'
            }`}>
              {JSON.stringify({
                title: post.title,
                contentFormat: post.contentFormat,
                contentType: typeof post.content,
                hasRawContent: post.rawContent !== undefined,
                headingsCount: headings.length,
                authorsCount: post.authors.length,
                category: typeof post.category === 'string' ? post.category : post.category.name,
                tagsCount: post.tags.length,
                hasCoverImage: post.coverImage !== undefined
              }, null, 2)}
            </pre>
          </details>
        </div>
      
        {/* Blog post title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm ${
              isDark ? 'bg-blue-900/40 text-blue-200' : 'bg-blue-100 text-blue-800'
            }`}>
              {typeof post.category === 'string' ? post.category : post.category.name}
            </span>
            
            {post.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className={`px-3 py-1 rounded-full text-sm ${
                  isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-800'
                }`}
              >
                {typeof tag === 'string' ? tag : tag.name}
              </span>
            ))}
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span>Published: {new Date(post.publishDate).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>{post.readingTime} min read</span>
          </div>
        </div>
        
        {/* Table of Contents */}
        {headings.length > 0 && (
          <div className={`mb-6 p-4 rounded-lg border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h2 className="font-medium mb-2">Table of Contents</h2>
            <ul className="space-y-1">
              {headings.map((heading, index) => (
                <li key={index} style={{ marginLeft: `${(heading.level - 1) * 16}px` }}>
                  <a 
                    href={`#${heading.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Content */}
        <div className={`${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border rounded-lg p-6`}>
          {showRaw ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <h2 className="text-xl font-bold mb-4">Raw Content</h2>
              <pre className={`whitespace-pre-wrap overflow-auto p-4 rounded ${
                isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'
              }`}>
                {typeof post.content === 'string' 
                  ? post.content 
                  : JSON.stringify(post.content, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="prose max-w-none dark:prose-invert">
              <ContentRenderer
                content={post.content}
                format={post.contentFormat}
                onHeadingsExtracted={handleHeadingsExtracted}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogpostDebugPage; 