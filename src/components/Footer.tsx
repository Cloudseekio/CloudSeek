import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#0E1524] text-gray-300 py-12" role="contentinfo">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Logo and Description */}
          <div className="col-span-1">
            <div className="flex items-center">
              <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 4L8 8H2v8h6l4 4V4z"/>
              </svg>
              <span className="ml-2 text-xl font-bold text-white">CloudSeek</span>
            </div>
            <p className="mt-4 text-gray-400">
              Enterprise cloud solutions for modern businesses.
            </p>
          </div>

          {/* Column 2: Company */}
          <nav className="col-span-1" aria-labelledby="company-heading">
            <h2 id="company-heading" className="text-white text-lg font-semibold mb-4">Company</h2>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-400 hover:text-blue-400 transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-blue-400 transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </nav>

          {/* Column 3: Resources */}
          <nav className="col-span-1" aria-labelledby="resources-heading">
            <h2 id="resources-heading" className="text-white text-lg font-semibold mb-4">Resources</h2>
            <ul className="space-y-3">
              <li><Link to="/support" className="text-gray-400 hover:text-blue-400 transition-colors">Support</Link></li>
              <li><Link to="/case-studies" className="text-gray-400 hover:text-blue-400 transition-colors">Case Studies</Link></li>
              <li><Link to="/testimonials" className="text-gray-400 hover:text-blue-400 transition-colors">Testimonials</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-blue-400 transition-colors">FAQ</Link></li>
            </ul>
          </nav>

          {/* Column 4: Legal */}
          <nav className="col-span-1" aria-labelledby="legal-heading">
            <h2 id="legal-heading" className="text-white text-lg font-semibold mb-4">Legal</h2>
            <ul className="space-y-3">
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-400 hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <hr className="my-10 border-gray-700" aria-hidden="true" />
        
        {/* Copyright */}
        <div className="text-center text-gray-400">
          <p>
            <small>© {currentYear} CloudSeek. All rights reserved.</small>
          </p>
        </div>
      </div>
      
      {/* Chat/Support Button with rounded avatar image */}
      <div className="fixed bottom-6 right-6">
        <a 
          href="/contact" 
          className="block rounded-full overflow-hidden w-14 h-14 shadow-lg"
          aria-label="Contact support"
          role="button"
        >
          <img 
            src="/path/to/support-avatar.png" 
            alt="Support assistant" 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.style.backgroundColor = '#4CAF50';
              target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>';
            }}
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer; 