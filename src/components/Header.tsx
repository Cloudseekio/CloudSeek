import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { theme } = useTheme();
  const menuId = 'main-navigation';

  return (
    <header className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 shadow-sm'} transition-colors`} role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" aria-label="CloudSeek homepage">
              <span className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} text-2xl font-bold`}>CloudSeek</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10" aria-label="Main navigation">
            <Link to="/" className={`${theme === 'dark' ? 'text-white hover:text-blue-300' : 'text-gray-800 hover:text-blue-600'} transition-colors`}>
              Home
            </Link>
            <Link to="/services" className={`${theme === 'dark' ? 'text-white hover:text-blue-300' : 'text-gray-800 hover:text-blue-600'} transition-colors`}>
              Services
            </Link>
            <Link to="/case-studies" className={`${theme === 'dark' ? 'text-white hover:text-blue-300' : 'text-gray-800 hover:text-blue-600'} transition-colors font-medium`}>
              Case Studies
            </Link>
            <Link to="/blog" className={`${theme === 'dark' ? 'text-white hover:text-blue-300' : 'text-gray-800 hover:text-blue-600'} transition-colors`}>
              Blog
            </Link>
            <Link to="/contact" className={`${theme === 'dark' ? 'text-white hover:text-blue-300' : 'text-gray-800 hover:text-blue-600'} transition-colors`}>
              Contact
            </Link>
          </nav>
          
          {/* Theme Toggle and CTA Button */}
          <div className="hidden md:flex items-center space-x-4" role="group" aria-label="User actions">
            <ThemeToggle />
            <Link
              to="/contact"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              role="button"
              aria-label="Get in touch with our team"
            >
              Get In Touch
            </Link>
          </div>
          
          {/* Mobile Menu Button and Theme Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle size={18} />
            <button
              type="button"
              className={theme === 'dark' ? 'text-white' : 'text-gray-800'}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls={menuId}
              aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
            >
              {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav 
            id={menuId}
            className="md:hidden pb-4"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col space-y-4">
              <li>
                <Link 
                  to="/" 
                  className={`${theme === 'dark' ? 'text-white hover:text-blue-300' : 'text-gray-800 hover:text-blue-600'} transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  className={`${theme === 'dark' ? 'text-white hover:text-blue-300' : 'text-gray-800 hover:text-blue-600'} transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  to="/case-studies" 
                  className={`${theme === 'dark' ? 'text-white hover:text-blue-300' : 'text-gray-800 hover:text-blue-600'} transition-colors font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Case Studies
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className={`${theme === 'dark' ? 'text-white hover:text-blue-300' : 'text-gray-800 hover:text-blue-600'} transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className={`${theme === 'dark' ? 'text-white hover:text-blue-300' : 'text-gray-800 hover:text-blue-600'} transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="bg-blue-600 text-white px-4 py-2 text-center rounded hover:bg-blue-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                  role="button"
                  aria-label="Get in touch with our team"
                >
                  Get In Touch
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header; 