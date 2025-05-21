import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Cloud, Menu, X, ChevronDown } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);

  const serviceLinks = {
    salesforce: [
      {
        title: 'Salesforce Solutions',
        items: [
          { name: 'Salesforce Implementation', path: '/services/salesforce-implementation', description: 'End-to-end deployment and setup' },
          { name: 'Sales Cloud', path: '/services/sales-cloud', description: 'Streamline your sales process' },
          { name: 'Service Cloud', path: '/services/service-cloud', description: 'Enhance customer support' },
          { name: 'Marketing Cloud', path: '/services/marketing-cloud', description: 'Personalized marketing automation' },
        ]
      }
    ],
    digital: [
      {
        title: 'Digital Services',
        items: [
          { name: 'Digital Marketing', path: '/services/strategic-digital-marketing', description: 'Data-driven marketing strategies' },
          { name: 'Web Design', path: '/services/web-design', description: 'User-centric interface design' },
          { name: 'Mobile Development', path: '/services/mobile-development', description: 'iOS and Android solutions' },
        ]
      }
    ],
    featured: {
      title: 'Featured Service',
      name: 'Einstein AI',
      description: 'Integration: Unlock the power of AI for your business',
      path: '/services/einstein-ai',
      learnMore: true
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-[100]">
        <div className="w-[94%] mx-auto">
          <div className="flex items-center h-[70px]">
            {/* Logo and Navigation Links */}
            <div className="flex-1 flex items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2 mr-8">
                <Cloud className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-slate-900">CloudSeek</span>
              </Link>

              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center space-x-8">
                {/* Services Dropdown */}
                <div 
                  className="relative group"
                  onMouseEnter={() => setIsServicesDropdownOpen(true)}
                  onMouseLeave={() => setIsServicesDropdownOpen(false)}
                >
                  <button 
                    className="text-slate-700 hover:text-blue-600 font-normal text-base flex items-center"
                    onClick={() => window.location.href = '/services'}
                  >
                    Services
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>

                  {/* Dropdown Panel */}
                  <div 
                    className={`absolute top-full left-0 mt-1 w-[800px] bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-200 z-[101] ${
                      isServicesDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
                    }`}
                  >
                    <div className="flex p-6">
                      {/* Salesforce Solutions Column */}
                      <div className="flex-1">
                        <h3 className="text-gray-500 font-medium mb-4">
                          {serviceLinks.salesforce[0].title}
                        </h3>
                        <div className="space-y-4">
                          {serviceLinks.salesforce[0].items.map((item, index) => (
                            <Link 
                              key={index}
                              to={item.path}
                              className="flex flex-col hover:bg-gray-50 p-2 rounded-lg transition-colors"
                            >
                              <span className="text-gray-900">{item.name}</span>
                              <span className="text-sm text-gray-500">{item.description}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Digital Services Column */}
                      <div className="flex-1">
                        <h3 className="text-gray-500 font-medium mb-4">
                          {serviceLinks.digital[0].title}
                        </h3>
                        <div className="space-y-4">
                          {serviceLinks.digital[0].items.map((item, index) => (
                            <Link 
                              key={index}
                              to={item.path}
                              className="flex flex-col hover:bg-gray-50 p-2 rounded-lg transition-colors"
                            >
                              <span className="text-gray-900">{item.name}</span>
                              <span className="text-sm text-gray-500">{item.description}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Featured Service */}
                      <div className="flex-1 bg-gray-900 p-6 rounded-lg">
                        <h3 className="text-white font-medium mb-2">
                          {serviceLinks.featured.title}
                        </h3>
                        <h4 className="text-xl text-white font-semibold mb-2">
                          {serviceLinks.featured.name}
                        </h4>
                        <p className="text-gray-300 text-sm mb-4">
                          {serviceLinks.featured.description}
                        </p>
                        <Link 
                          to={serviceLinks.featured.path}
                          className="text-blue-400 hover:text-blue-300 flex items-center"
                        >
                          Learn more
                          <ChevronDown className="ml-1 h-4 w-4 rotate-[-90deg]" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <Link 
                  to="/customers" 
                  className="text-slate-700 hover:text-blue-600 font-normal text-base ml-3"
                >
                  Customers
                </Link>
                <Link 
                  to="/company" 
                  className="text-slate-700 hover:text-blue-600 font-normal text-base"
                >
                  Company
                </Link>
                <Link 
                  to="/careers" 
                  className="text-slate-700 hover:text-blue-600 font-normal text-base"
                >
                  Careers
                </Link>
              </div>
            </div>

            {/* Get In Touch Button */}
            <div className="hidden md:block ml-6">
              <Link to="/contact" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block">
                Get In Touch
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="w-[94%] mx-auto py-4 space-y-3">
              <Link to="/services" className="block text-gray-600 hover:text-blue-600 font-medium">Services</Link>
              <Link to="/customers" className="block text-gray-600 hover:text-blue-600 font-medium">Customers</Link>
              <Link to="/company" className="block text-gray-600 hover:text-blue-600 font-medium">Company</Link>
              <Link to="/careers" className="block text-gray-600 hover:text-blue-600 font-medium">Careers</Link>
              <Link to="/contact" className="block w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">
                Get In Touch
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-[70px] relative z-[1]">
        <Outlet />
      </main>
      
      <footer className="bg-[#0E1524] text-gray-300 py-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-x-6 gap-y-8">
            {/* Column 1: Logo and Description */}
            <div className="col-span-1">
              <div className="flex items-center">
                {/* CloudSeek Logo - Simple Blue Outlined Cloud */}
                <svg
                  className="h-7 w-7 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.5 19H9C6.239 19 4 16.761 4 14C4 11.239 6.239 9 9 9C9 6.239 11.239 4 14 4C16.761 4 19 6.239 19 9C21.761 9 24 11.239 24 14C24 16.761 21.761 19 19 19H17.5Z" />
                </svg>
                <span className="ml-2 text-lg font-bold text-white">CloudSeek</span>
              </div>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                Your trusted Salesforce partner for implementation, development, and support services. Empowering businesses with cloud solutions that drive growth and innovation.
              </p>
              
              {/* Social Media Icons */}
              <div className="flex space-x-4 mt-4">
                {/* Facebook */}
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-1">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                
                {/* LinkedIn */}
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-1">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                  </svg>
                </a>
                
                {/* Twitter */}
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-1">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Company */}
            <div className="col-span-1">
              <h3 className="text-white text-base font-semibold mb-3">Company</h3>
              <ul className="space-y-2">
                <li><a href="/company" className="text-gray-400 hover:text-white transition-colors inline-block py-0.5">About Us</a></li>
                <li><a href="/careers" className="text-gray-400 hover:text-white transition-colors inline-block py-0.5">Careers</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors inline-block py-0.5">Blog</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors inline-block py-0.5">Contact</a></li>
              </ul>
            </div>

            {/* Column 3: Services */}
            <div className="col-span-1">
              <h3 className="text-white text-base font-semibold mb-3">Services</h3>
              <ul className="space-y-2">
                <li><a href="/services/salesforce-implementation" className="text-gray-400 hover:text-white transition-colors inline-block py-0.5">Implementation</a></li>
                <li><a href="/services/custom-salesforce-solutions" className="text-gray-400 hover:text-white transition-colors inline-block py-0.5">Development</a></li>
                <li><a href="/services/salesforce-consulting" className="text-gray-400 hover:text-white transition-colors inline-block py-0.5">Consultancy</a></li>
                <li><a href="/services/training" className="text-gray-400 hover:text-white transition-colors inline-block py-0.5">Training</a></li>
                <li><a href="/services/support" className="text-gray-400 hover:text-white transition-colors inline-block py-0.5">Technical Support</a></li>
              </ul>
            </div>

            {/* Column 4: Products */}
            <div className="col-span-1">
              <h3 className="text-white text-base font-semibold mb-3">Products</h3>
              <ul className="space-y-2">
                <li><a href="/services/sales-cloud" className="text-gray-400 hover:text-white transition-colors inline-block py-0.5">Sales Cloud</a></li>
                <li><a href="/services/service-cloud" className="text-gray-400 hover:text-white transition-colors inline-block py-0.5">Service Cloud</a></li>
                <li><a href="/services/marketing-cloud" className="text-gray-400 hover:text-white transition-colors inline-block py-0.5">Commerce Cloud</a></li>
                <li><a href="/services/einstein-ai" className="text-gray-400 hover:text-white transition-colors inline-block py-0.5">AI Solutions</a></li>
                <li><a href="/services/experience-cloud" className="text-gray-400 hover:text-white transition-colors inline-block py-0.5">Experience Cloud</a></li>
              </ul>
            </div>

            {/* Column 5: Resources */}
            <div className="col-span-1">
              <h3 className="text-white text-base font-semibold mb-3">Resources</h3>
              <ul className="space-y-2">
                <li><a href="/services/support" className="text-gray-400 hover:text-white transition-colors inline-block py-0.5">Support</a></li>
                <li><a href="/case-studies" className="text-gray-400 hover:text-white transition-colors inline-block py-0.5">Case Studies</a></li>
                <li><a href="/customers" className="text-gray-400 hover:text-white transition-colors inline-block py-0.5">Testimonials</a></li>
                <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors inline-block py-0.5">FAQ</a></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-6 border-gray-700/50" />
          
          {/* Copyright and Legal Links */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="text-gray-400 flex flex-col md:flex-row items-center">
              <p className="text-xs">© {new Date().getFullYear()} CloudSeek. All rights reserved.</p>
              <div className="flex space-x-6 mt-2 md:mt-0 md:ml-6">
                <a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-xs">Privacy Policy</a>
                <a href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-xs">Terms of Service</a>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('openCookieSettings'))}
                  className="text-gray-400 hover:text-white transition-colors text-xs cursor-pointer"
                >
                  Cookie Settings
                </button>
              </div>
            </div>
            
            {/* Back to Top Button */}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-gray-400 hover:text-white transition-colors flex items-center px-3 py-1.5 rounded-full bg-gray-800/30 hover:bg-gray-800/60 text-xs"
            >
              Back to Top
              <svg 
                className="ml-1.5 h-3 w-3" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 