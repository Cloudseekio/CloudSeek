import React, { useEffect } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { usePrefetch } from '../hooks/usePrefetch';

/**
 * Example of using the usePrefetch hook
 */
const PrefetchExample: React.FC = () => {
  const {
    networkQuality,
    prefetch,
    getPrefetchedRoutes,
    clearPrefetchCache,
    currentPath
  } = usePrefetch({
    // Enable all prefetching methods
    enableHover: true,
    enableViewport: true,
    enablePrediction: true,
    
    // Adjust network thresholds
    networkThresholds: {
      prediction: 'slow',   // Predictive prefetching even on slow connections
      viewport: 'medium',   // Viewport prefetching on medium or better connections
      hover: 'fast',        // Hover prefetching only on fast connections
    },
    
    // Debug for development only
    debug: process.env.NODE_ENV !== 'production',
    
    // Events to track prefetching
    onPrefetchStart: (path, method) => {
      console.log(`Started prefetching ${path} via ${method}`);
    },
    onPrefetchSuccess: (path) => {
      console.log(`Successfully prefetched ${path}`);
    },
    onPrefetchError: (path, error) => {
      console.error(`Failed to prefetch ${path}:`, error);
    }
  });

  // Manually prefetch important routes on component mount
  useEffect(() => {
    prefetch('/about');
    prefetch('/contact');
  }, [prefetch]);

  // Get the list of all prefetched routes
  const prefetchedRoutes = getPrefetchedRoutes();

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Prefetch Demo</h1>
        
        <div className="mb-4 flex items-center">
          <span className="font-medium mr-2">Network quality:</span>
          <NetworkQualityIndicator quality={networkQuality} />
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Currently prefetched routes:</h2>
          {prefetchedRoutes.length > 0 ? (
            <ul className="list-disc pl-6">
              {prefetchedRoutes.map(route => (
                <li key={route} className="text-blue-600">{route}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No routes prefetched yet</p>
          )}
          <button
            onClick={clearPrefetchCache}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Clear prefetch cache
          </button>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Navigation links:</h2>
          <p className="text-sm text-gray-600 mb-3">
            These links use hover and viewport prefetching. Check the console or network tab
            to see prefetching in action when you hover or scroll to make them visible.
          </p>
          
          <nav className="flex flex-wrap gap-4">
            <NavLink to="/" currentPath={currentPath}>Home</NavLink>
            <NavLink to="/about" currentPath={currentPath}>About</NavLink>
            <NavLink to="/services" currentPath={currentPath}>Services</NavLink>
            <NavLink to="/blog" currentPath={currentPath}>Blog</NavLink>
            <NavLink to="/contact" currentPath={currentPath}>Contact</NavLink>
            <NavLink to="/pricing" currentPath={currentPath}>Pricing</NavLink>
            <NavLink to="/team" currentPath={currentPath}>Team</NavLink>
            <NavLink to="/testimonials" currentPath={currentPath}>Testimonials</NavLink>
          </nav>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Manual prefetching:</h2>
          <p className="text-sm text-gray-600 mb-3">
            Click these buttons to manually prefetch routes
          </p>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => prefetch('/faq')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Prefetch FAQ
            </button>
            <button
              onClick={() => prefetch('/privacy')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Prefetch Privacy
            </button>
            <button
              onClick={() => prefetch('/terms')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Prefetch Terms
            </button>
          </div>
        </div>
      </div>
      
      {/* Content section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
};

// NavLink component that highlights current route
interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  currentPath: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, currentPath }) => {
  const isActive = currentPath === to || (to !== '/' && currentPath.startsWith(to));
  
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }`}
    >
      {children}
    </Link>
  );
};

// Network quality indicator component
interface NetworkQualityIndicatorProps {
  quality: 'fast' | 'medium' | 'slow' | 'offline';
}

const NetworkQualityIndicator: React.FC<NetworkQualityIndicatorProps> = ({ quality }) => {
  const getColor = () => {
    switch (quality) {
      case 'fast':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'slow':
        return 'bg-orange-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getLabel = () => {
    switch (quality) {
      case 'fast':
        return 'Fast';
      case 'medium':
        return 'Medium';
      case 'slow':
        return 'Slow';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };
  
  return (
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full ${getColor()} mr-2`} />
      <span>{getLabel()}</span>
    </div>
  );
};

// Placeholder page components
const HomePage = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Home</h2>
    <p>Welcome to the prefetch demo! Hover over links or scroll to see prefetching in action.</p>
  </div>
);

const AboutPage = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">About</h2>
    <p>This is the about page. It demonstrates smart prefetching of likely navigation destinations.</p>
  </div>
);

const ServicesPage = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Services</h2>
    <p>Our services include intelligent prefetching based on user behavior and network conditions.</p>
  </div>
);

const BlogPage = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Blog</h2>
    <p>Read our latest articles on performance optimization and prefetching strategies.</p>
  </div>
);

const ContactPage = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Contact</h2>
    <p>Get in touch with us to learn more about implementing prefetching in your projects.</p>
  </div>
);

const PricingPage = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Pricing</h2>
    <p>Our pricing plans are designed to meet your performance optimization needs.</p>
  </div>
);

const TeamPage = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Team</h2>
    <p>Meet our team of performance optimization experts.</p>
  </div>
);

const TestimonialsPage = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Testimonials</h2>
    <p>See what our clients say about our prefetching solutions.</p>
  </div>
);

const FAQPage = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">FAQ</h2>
    <p>Frequently asked questions about prefetching and performance optimization.</p>
  </div>
);

const PrivacyPage = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Privacy Policy</h2>
    <p>Our privacy policy details how we handle your data.</p>
  </div>
);

const TermsPage = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Terms of Service</h2>
    <p>Our terms of service outline the rules for using our platform.</p>
  </div>
);

const NotFoundPage = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
  </div>
);

export default PrefetchExample; 