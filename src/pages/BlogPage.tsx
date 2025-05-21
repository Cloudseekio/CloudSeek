import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useBlog } from '../blog/hooks/useBlog';
import BlogErrorBoundary from '../blog/components/error/BlogErrorBoundary';
import { ErrorMessage } from '../blog/components/error/ErrorMessage';
import SEO from '../components/SEO';
import LoadingFallback from '../components/LoadingFallback';
import '../styles/blog-page.css';
import { BLOG_POSTS } from '../data/blogPosts';

// Define our unified post type to resolve type issues
interface UnifiedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  date: string;
  author: {
    name: string;
    avatar: string;
    title: string;
  };
  readTime: string;
}

// Define interfaces for our blog data
interface BlogCategory {
  id?: string;
  name: string;
  slug?: string;
  count: number;
}

// Updated categories to match blog posts
const CATEGORIES: BlogCategory[] = [
  { name: "Development", count: 12 },
  { name: "Admin", count: 18 },
  { name: "Analytics", count: 7 },
  { name: "Integration", count: 5 },
  { name: "Sales", count: 10 },
  { name: "Service Cloud", count: 8 },
  { name: "Marketing", count: 6 },
  { name: "User Experience", count: 4 },
  { name: "Mobile", count: 5 },
  { name: "Data Management", count: 5 }
];

// SEO metadata
const seoTitle = "Blog | CloudSeek - Salesforce Expertise & Insights";
const seoDescription = "Explore the latest Salesforce insights, best practices, implementation tips, and cloud technology trends from CloudSeek's team of experts.";

const BlogPage: React.FC = () => {
  return (
    <BlogErrorBoundary>
      <SEO title={seoTitle} description={seoDescription} />
      <BlogContent />
    </BlogErrorBoundary>
  );
};

// Define ContentfulBlogPost interface to fix type errors
interface ContentfulBlogPost {
  id: string | number;
  title: string;
  slug: string;
  excerpt?: string;
  imageUrl?: string;
  category: string | { name: string };
  date?: string;
  author?: {
    name: string;
    avatar: string;
    title: string;
  };
  readTime?: string;
}

const BlogContent: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [, setSelectedTag] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [,] = useState(1);
  const [filteredPosts, setFilteredPosts] = useState<UnifiedPost[]>([]);
  const [allPosts, setAllPosts] = useState<UnifiedPost[]>([]);
  
  const {
    posts = [],
    loading,
    error
  } = useBlog();
  
  useEffect(() => {
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    
    if (category) {
      setSelectedCategory(category);
    }
    
    if (tag) {
      setSelectedTag(tag);
    }
  }, [searchParams]);

  // Load and merge posts from both sources
  useEffect(() => {
    // First load all posts from our centralized store
    const centralizedPosts = BLOG_POSTS.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      imageUrl: post.imageUrl,
      category: post.category,
      date: post.date,
      author: post.author,
      readTime: post.readTime
    }));
    
    // If we have posts from Contentful, add them as well
    if (posts && posts.length > 0) {
      // Convert Contentful posts to our unified format with proper typing
      const contentfulPosts = posts.map((post) => {
        const typedPost = post as unknown as ContentfulBlogPost;
        return {
          id: typeof typedPost.id === 'string' ? parseInt(typedPost.id, 10) : typedPost.id,
          title: typedPost.title,
          slug: typedPost.slug,
          excerpt: typedPost.excerpt || "",
          imageUrl: typedPost.imageUrl || "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg",
          category: typeof typedPost.category === 'object' 
            ? typedPost.category.name 
            : (typedPost.category as string || "Uncategorized"),
          date: typedPost.date || new Date().toLocaleDateString(),
          author: typedPost.author || {
            name: "CloudSeek Team",
            avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
            title: "Salesforce Experts"
          },
          readTime: typedPost.readTime || "5 min read"
        };
      });
      
      // Deduplicate based on slug
      const existingSlugs = centralizedPosts.map(post => post.slug);
      const uniqueContentfulPosts = contentfulPosts.filter(post => 
        !existingSlugs.includes(post.slug)
      );
      
      // Combine both sources
      const combinedPosts = [...centralizedPosts, ...uniqueContentfulPosts];
      setAllPosts(combinedPosts);
      setFilteredPosts(combinedPosts);
    } else {
      setAllPosts(centralizedPosts);
      setFilteredPosts(centralizedPosts);
    }
  }, [posts]);
  
  // Handle category selection
  const handleCategorySelect = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug);
    
    // Update URL with category parameter
    if (categorySlug) {
      setSearchParams({ category: categorySlug });
    } else {
      setSearchParams({});
    }
    
    // Filter posts based on selected category
    if (categorySlug) {
      const categorySlugLower = categorySlug.toLowerCase();
      const filtered = allPosts.filter(post => 
        post.category.toLowerCase().replace(/\s+/g, '-') === categorySlugLower
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(allPosts);
    }
  };
  
  // Filter posts by search query
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      const searchResults = allPosts.filter(post => 
        post.title.toLowerCase().includes(lowerQuery) || 
        post.excerpt.toLowerCase().includes(lowerQuery)
      );
      setFilteredPosts(searchResults);
    } else if (selectedCategory) {
      // If search is empty but category is selected, apply just the category filter
      const categorySlugLower = selectedCategory.toLowerCase();
      const filtered = allPosts.filter(post => 
        post.category.toLowerCase().replace(/\s+/g, '-') === categorySlugLower
      );
      setFilteredPosts(filtered);
    } else {
      // If no search or category, show all posts
      setFilteredPosts(allPosts);
    }
  }, [searchQuery, allPosts, selectedCategory]);
  
  // Initial loading state
  if (loading && filteredPosts.length === 0) {
    return <LoadingFallback message="Loading blog posts..." />;
  }

  if (error) {
    return <ErrorMessage title="Error" message={error.toString()} />;
  }

  return (
    <div className="blog-page">
      <SEO title={seoTitle} />

      {/* Blog Header */}
      <header className="blog-header">
        <div className="container">
          <h1>Blog</h1>
          <p>Expert insights, strategies, and best practices for Salesforce and cloud technology.</p>
          
          <div className="search-container">
            <svg 
              className="search-icon" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search blog posts"
            />
          </div>
        </div>
      </header>

      <div className="blog-body container">
        <div className="filter-bar">
          <div className="filter-label">
            <svg className="filter-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Filters:
            <span className="active-filter">{selectedCategory || 'None active'}</span>
          </div>
          <div className="post-count">{filteredPosts.length} posts found</div>
        </div>

        <div className="blog-content">
          <main className="blog-main">
            {/* Featured Posts Section */}
            <section className="featured-posts">
              <h2>Featured Posts</h2>
              <div className="post-list">
                {filteredPosts.slice(0, 2).map(post => (
                  <article key={post.id} className="post-card featured">
                    <div className="post-image">
                      <Link to={`/blog/${post.slug}`}>
                        <img src={post.imageUrl} alt={post.title} />
                      </Link>
                    </div>
                    <div className="post-content">
                      <div className="post-meta">
                        <span className="post-category">{post.category}</span>
                        <span className="post-date">{post.date}</span>
                      </div>
                      <Link to={`/blog/${post.slug}`} className="post-title-link">
                        <h3 className="post-title">{post.title}</h3>
                      </Link>
                      <p className="post-excerpt">{post.excerpt}</p>
                      <div className="post-footer">
                        <div className="post-author">
                          <img 
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="author-avatar"
                          />
                          <span className="author-name">{post.author.name}</span>
                        </div>
                        <span className="post-read-time">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            
            {/* Recent Posts Section */}
            <section className="recent-posts">
              <h2>Recent Posts</h2>
              <div className="post-grid">
                {filteredPosts.slice(2).map(post => (
                  <article key={post.id} className="post-card">
                    <div className="post-image">
                      <Link to={`/blog/${post.slug}`}>
                        <img src={post.imageUrl} alt={post.title} />
                      </Link>
                    </div>
                    <div className="post-content">
                      <div className="post-meta">
                        <span className="post-category">{post.category}</span>
                        <span className="post-date">{post.date}</span>
                      </div>
                      <Link to={`/blog/${post.slug}`} className="post-title-link">
                        <h3 className="post-title">{post.title}</h3>
                      </Link>
                      <p className="post-excerpt">{post.excerpt}</p>
                      <div className="post-footer">
                        <div className="post-author">
                          <img 
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="author-avatar"
                          />
                          <span className="author-name">{post.author.name}</span>
                        </div>
                        <span className="post-read-time">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </main>

          <aside className="blog-sidebar">
            <div className="sidebar-section categories">
              <h3>Categories</h3>
              <ul className="category-list">
                <li 
                  className={selectedCategory === null ? 'active' : ''}
                  onClick={() => handleCategorySelect(null)}
                >
                  All Categories
                  <span className="count">{BLOG_POSTS.length}</span>
                </li>
                {CATEGORIES.map((category, idx) => {
                  const categoryName = category.name;
                  const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
                  
                  return (
                    <li 
                      key={idx}
                      className={selectedCategory === categorySlug ? 'active' : ''}
                      onClick={() => handleCategorySelect(categorySlug)}
                    >
                      {categoryName}
                      <span className="count">
                        {BLOG_POSTS.filter(post => 
                          post.category.toLowerCase() === categoryName.toLowerCase()
                        ).length}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <div className="sidebar-section newsletter">
              <h3>Newsletter</h3>
              <p>Subscribe to get the latest Salesforce insights directly to your inbox.</p>
              <form className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  required 
                  aria-label="Email address for newsletter"
                />
                <button type="submit" className="btn-subscribe">Subscribe</button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogPage; 