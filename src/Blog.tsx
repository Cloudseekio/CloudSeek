import { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from './data/blogPosts';

// Helper function to encode form data for Netlify Forms
const encode = (data: Record<string, string>) => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [botField, setBotField] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'success' | 'error' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter posts based on search query
  const filteredPosts = searchQuery
    ? BLOG_POSTS.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : BLOG_POSTS;

  // Handle newsletter subscription
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsSubmitting(true);
    setSubscribeStatus(null);
    
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          'form-name': 'blog-newsletter',
          email,
          'bot-field': botField
        })
      });
      
      setSubscribeStatus('success');
      setEmail('');
      setBotField('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubscribeStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with CloudSeek styling */}
      <header className="py-7 border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="text-gray-500 text-sm font-normal hover:text-blue-600 transition-colors">
            Return to Homepage
          </Link>
          
          <Link to="/" className="flex-1 flex justify-center">
            <img src="/logo.svg" alt="CloudSeek" className="h-7" />
          </Link>
          
          <div className="w-[100px] flex justify-end">
            <button 
              className="text-gray-500 hover:text-blue-600 transition-colors"
              aria-label="Search articles"
              title="Search articles"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Centered Search Bar */}
      <div className="flex justify-center mt-8 mb-10">
        <div className="relative w-full max-w-2xl mx-8">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search posts, tags and authors"
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Blog Grid - 3 columns layout */}
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12">
          {filteredPosts.map((post) => (
            <article key={post.id}>
              <Link to={`/blog/${post.slug}`} className="block group">
                <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="text-sm text-blue-600 mb-1">{post.category}</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 text-sm leading-normal mb-3 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center text-sm text-gray-500">
                  <span>By {post.author.name}</span>
                  <span className="mx-2">—</span>
                  <span>{post.date}</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
        
        {/* See All Link */}
        <div className="mt-8 mb-20">
          <Link to="#" className="inline-flex items-center text-blue-600 font-medium text-sm hover:text-blue-700">
            See all <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </div>
        
        {/* Newsletter Section - Updated for Salesforce and CloudSeek */}
        <div className="border-t border-gray-200 pt-16 pb-20">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-[27px] font-bold text-gray-900 mb-3 leading-tight">
              The latest at the intersection of Salesforce and cloud technology
            </h2>
            <p className="text-gray-600 text-[15px] mb-6">
              Join 5000+ Salesforce professionals and cloud technology experts staying up-to-date with CloudSeek's newsletter.
            </p>
            
            <form 
              name="blog-newsletter"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              className="flex max-w-md mx-auto"
              onSubmit={handleSubscribe}
            >
              <input type="hidden" name="form-name" value="blog-newsletter" />
              
              {/* Honeypot field */}
              <div className="hidden">
                <label>
                  Don't fill this out if you're human: 
                  <input 
                    name="bot-field" 
                    value={botField} 
                    onChange={(e) => setBotField(e.target.value)} 
                  />
                </label>
              </div>
              
              <input 
                type="email" 
                name="email"
                placeholder="Your business email" 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-[15px]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-5 py-2 rounded-r-md font-medium text-[15px] hover:bg-blue-700 transition-colors disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            
            {subscribeStatus === 'success' && (
              <p className="mt-3 text-sm text-green-600">
                Thanks for subscribing! We'll keep you updated with the latest news.
              </p>
            )}
            
            {subscribeStatus === 'error' && (
              <p className="mt-3 text-sm text-red-600">
                Something went wrong. Please try again later.
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer - CloudSeek branded */}
      <footer className="border-t border-gray-200">
        <div className="max-w-screen-xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <img src="/logo.svg" alt="CloudSeek" className="h-6" />
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Blog; 