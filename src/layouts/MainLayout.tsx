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
      
      <footer className="bg-[#0E1524] text-gray-300 relative">
        {/* Subtle Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/5"></div>
        
        <div className="container mx-auto px-6 relative z-10 py-16">

          {/* Main Footer Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Column 1: Company */}
            <div className="space-y-6">
              <div>
                <h3 className="text-white text-xl font-bold mb-6 pb-2 border-b border-blue-500/30">Company</h3>
                <ul className="space-y-3">
                  <li><a href="/company" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">About Us</a></li>
                  <li><a href="/careers" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Careers</a></li>
                  <li><a href="/blog" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Blog</a></li>
                  <li><a href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Contact</a></li>
                </ul>
              </div>
            </div>

            {/* Column 2: Services */}
            <div className="space-y-6">
              <div>
                <h3 className="text-white text-xl font-bold mb-6 pb-2 border-b border-blue-500/30">Services</h3>
                <ul className="space-y-3">
                  <li><a href="/services/salesforce-implementation" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Implementation</a></li>
                  <li><a href="/services/custom-salesforce-solutions" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Development</a></li>
                  <li><a href="/services/salesforce-consulting" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Consultancy</a></li>
                  <li><a href="/services/training" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Training</a></li>
                  <li><a href="/services/support" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Technical Support</a></li>
                </ul>
              </div>
            </div>

            {/* Column 3: Products */}
            <div className="space-y-6">
              <div>
                <h3 className="text-white text-xl font-bold mb-6 pb-2 border-b border-blue-500/30">Products</h3>
                <ul className="space-y-3">
                  <li><a href="/services/sales-cloud" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Sales Cloud</a></li>
                  <li><a href="/services/service-cloud" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Service Cloud</a></li>
                  <li><a href="/services/marketing-cloud" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Commerce Cloud</a></li>
                  <li><a href="/services/einstein-ai" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">AI Solutions</a></li>
                  <li><a href="/services/experience-cloud" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Experience Cloud</a></li>
                </ul>
              </div>
            </div>

            {/* Column 4: Resources */}
            <div className="space-y-6">
              <div>
                <h3 className="text-white text-xl font-bold mb-6 pb-2 border-b border-blue-500/30">Resources</h3>
                <ul className="space-y-3">
                  <li><a href="/services/support" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Support</a></li>
                  <li><a href="/case-studies" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Case Studies</a></li>
                  <li><a href="/customers" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Testimonials</a></li>
                  <li><a href="/faq" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">FAQ</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Premium Divider */}
          <div className="my-16 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-[#0E1524] px-6">
                <div className="w-8 h-[1px] bg-gradient-to-r from-blue-400 to-cyan-400"></div>
              </div>
            </div>
          </div>
          
          {/* Bottom Footer Section - Enterprise Style */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <svg
                    className="h-10 w-10 text-blue-400"
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
                  <div className="absolute -inset-1 bg-blue-400/20 rounded-full blur-sm"></div>
                </div>
                <span className="ml-3 text-2xl font-bold text-white">CloudSeek</span>
              </div>
              <p className="text-gray-300 text-base leading-relaxed mb-6">
                Your trusted Salesforce partner for implementation, development, and support services. 
                Empowering businesses with cloud solutions that drive growth and innovation.
              </p>
              
              {/* Certifications/Awards */}
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Salesforce Partner
                </div>
                <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Certified Experts
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h4 className="text-white text-xl font-bold mb-6 pb-2 border-b border-blue-500/30">Contact Information</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 mt-1 mr-4">
                    <svg className="w-full h-full text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-gray-300">
                    <div className="font-medium">75 Technology Drive, Suite 300</div>
                    <div className="text-gray-400">North Carolina, United States</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-5 h-5 mr-4">
                    <svg className="w-full h-full text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <a href="mailto:services@cloudseek.io" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                    services@cloudseek.io
                  </a>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-5 h-5 mr-4">
                    <svg className="w-full h-full text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <a href="tel:+1-555-0123" className="text-gray-300 hover:text-blue-400 transition-colors font-medium">
                    +1 (555) 012-3456
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media & Follow */}
            <div className="lg:col-span-1">
              <h4 className="text-white text-xl font-bold mb-6 pb-2 border-b border-blue-500/30">Connect With Us</h4>
              <p className="text-gray-300 mb-6">
                Follow us for the latest updates, insights, and Salesforce best practices.
              </p>
              <div className="flex space-x-3">
                <a href="https://linkedin.com/company/cloudseek" target="_blank" rel="noopener noreferrer" 
                   className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                  </svg>
                </a>
                <a href="https://facebook.com/cloudseek" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://twitter.com/cloudseek" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="https://github.com/cloudseek" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright and Legal Links */}
          <div className="mt-8 pt-6 border-t border-gray-700/30">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center">
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} CloudSeek. All rights reserved.
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-end items-center space-x-6 text-sm">
                <a href="/privacy-policy" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy Policy</a>
                <a href="/terms-of-service" className="text-gray-400 hover:text-blue-400 transition-colors">Terms of Service</a>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('openCookieSettings'))}
                  className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Cookie Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 