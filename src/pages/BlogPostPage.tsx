import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import BlogErrorBoundary from '../blog/components/error/BlogErrorBoundary';
import { BlogPost, getBlogPostBySlug, getRelatedPosts } from '../data/blogPosts';
import '../styles/blog-post-page.css';

const BlogPostContent: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Post slug is required");
      setIsLoading(false);
      return;
    }

    try {
      const fetchedPost = getBlogPostBySlug(slug);
      if (fetchedPost) {
        setPost(fetchedPost);
        setRelatedPosts(getRelatedPosts(fetchedPost.id));
      } else {
        setError("Post not found");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load post";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="blog-post-loading">
        <div className="loading-spinner"></div>
        <p>Loading blog post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-post-error">
        <h2>{error || "Blog post not found"}</h2>
        <p>The blog post you're looking for could not be loaded.</p>
        <button className="back-button" onClick={() => navigate('/blog')}>
          <ArrowLeft size={18} />
          Back to Blog
        </button>
      </div>
    );
  }

  // Blog post details for schema.org
  const blogPostDetails = {
    title: post.title,
    description: post.excerpt,
    author: post.author.name,
    publishDate: post.date,
    modifiedDate: post.date,
    image: post.imageUrl,
    url: `/blog/${post.slug}`,
    categories: [post.category],
    tags: post.tags ? [...post.tags, post.category] : [post.category]
  };

  // Use avatar from either avatar or avatarUrl property
  const authorAvatar = post.author.avatar || post.author.avatarUrl;
  // Use title or role for author title
  const authorTitle = post.author.title || post.author.role;

  return (
    <div className="blog-post-page">
      <SEO 
        title={`${post.title} | CloudSeek Blog`}
        description={post.excerpt}
        image={post.imageUrl}
        canonical={`/blog/${post.slug}`}
        type="article"
        publishDate={post.date}
        modifiedDate={post.date}
        author={post.author.name}
        blogPostDetails={blogPostDetails}
      />
      
      <div className="blog-post-header">
        <div className="container">
          <Link to="/blog" className="back-link">
            <ArrowLeft size={18} />
            Back to Blog
          </Link>
          
          <div className="post-category">{post.category}</div>
          <h1>{post.title}</h1>
          
          <div className="post-meta">
            <div className="author">
              <img src={authorAvatar} alt={post.author.name} className="author-avatar" />
              <div className="author-info">
                <div className="author-name">{post.author.name}</div>
                <div className="author-title">{authorTitle}</div>
              </div>
            </div>
            
            <div className="post-info">
              <div className="post-date">{post.date}</div>
              {post.readTime && (
                <div className="read-time">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {post.readTime}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="blog-post-featured-image">
        <img src={post.imageUrl} alt={post.title} />
      </div>
      
      <div className="blog-post-content">
        <div className="container">
          <div className="blog-post-main">
            <article className="post-content" dangerouslySetInnerHTML={{ __html: post.content || '' }}></article>
            
            <div className="post-tags">
              <span className="tags-label">Tags:</span>
              <div className="tags-list">
                {post.tags && Array.isArray(post.tags) ? (
                  post.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))
                ) : (
                  <span className="tag">{post.category}</span>
                )}
              </div>
            </div>
            
            <div className="post-share">
              <span className="share-label">Share:</span>
              <div className="share-buttons">
                <button className="share-button twitter" aria-label="Share on Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </button>
                <button className="share-button linkedin" aria-label="Share on LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </button>
                <button className="share-button facebook" aria-label="Share on Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="author-bio">
              <img src={authorAvatar} alt={post.author.name} className="author-avatar" />
              <div className="author-details">
                <h3 className="author-name">{post.author.name}</h3>
                <p className="author-title">{authorTitle}</p>
                <p className="author-description">
                  {post.author.name} is a Salesforce expert with over 8 years of experience in {post.category} and related technologies. 
                  They specialize in helping organizations maximize their Salesforce investment.
                </p>
                <a href={`mailto:${post.author.email || 'blog@cloudseek.io'}`} className="text-gray-600 hover:text-blue-600">
                  Contact
                </a>
              </div>
            </div>
          </div>
          
          <aside className="blog-post-sidebar">
            <div className="related-posts">
              <h3>Related Posts</h3>
              <div className="related-post-list">
                {relatedPosts.map(relatedPost => (
                  <div key={relatedPost.id} className="related-post-card">
                    <img src={relatedPost.imageUrl} alt={relatedPost.title} className="related-post-image" />
                    <div className="related-post-content">
                      <div className="related-post-category">{relatedPost.category}</div>
                      <h4 className="related-post-title">
                        <Link to={`/blog/${relatedPost.slug}`}>{relatedPost.title}</Link>
                      </h4>
                      <div className="related-post-date">{relatedPost.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="newsletter-signup">
              <h3>Stay Updated</h3>
              <p>Get the latest Salesforce insights and tutorials delivered straight to your inbox.</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Your email address" required />
                <button type="submit" className="subscribe-button">Subscribe</button>
              </form>
              <div className="form-disclaimer">
                We respect your privacy. Unsubscribe at any time.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const BlogPostPage: React.FC = () => {
  return (
    <BlogErrorBoundary>
      <BlogPostContent />
    </BlogErrorBoundary>
  );
};

export default BlogPostPage; 