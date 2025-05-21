import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Home, Folder, Search, Tag } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTopicClusters } from '../hooks/useTopicClusters';
import TopicClusters from '../components/TopicClusters';

const TopicsPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedView, setSelectedView] = useState<'grid' | 'cards' | 'list'>('grid');
  
  // Fetch all topic clusters
  const { clusters, isLoading, error } = useTopicClusters({
    includePosts: true
  });
  
  // Filter clusters based on search query
  const filteredClusters = searchQuery.trim() === '' 
    ? clusters 
    : clusters?.filter(cluster => 
        cluster.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cluster.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link 
              to="/" 
              className={`flex items-center ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Home size={14} className="mr-1" />
              Home
            </Link>
          </li>
          <li className={isDark ? 'text-gray-500' : 'text-gray-400'}>
            <ChevronLeft size={14} className="transform rotate-180" />
          </li>
          <li>
            <Link 
              to="/blog" 
              className={`${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Blog
            </Link>
          </li>
          <li className={isDark ? 'text-gray-500' : 'text-gray-400'}>
            <ChevronLeft size={14} className="transform rotate-180" />
          </li>
          <li className={isDark ? 'text-white' : 'text-gray-900'}>
            Topics
          </li>
        </ol>
      </nav>
      
      {/* Header */}
      <header className="mb-12">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Browse Topics
        </h1>
        <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Explore our content by topic to find exactly what you're looking for
        </p>
      </header>
      
      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
          </div>
          <input
            type="text"
            placeholder="Search topics..."
            className={`pl-10 pr-10 py-2 w-full rounded-lg ${
              isDark 
                ? 'bg-gray-800 text-white border-gray-700 focus:border-blue-500' 
                : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'
            } border focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label="Clear search"
            >
              <span className={`text-2xl ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>×</span>
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>View:</span>
          <button
            onClick={() => setSelectedView('grid')}
            className={`p-2 rounded ${
              selectedView === 'grid' 
                ? isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800' 
                : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
            }`}
            aria-label="Grid view"
            aria-pressed={selectedView === 'grid' ? 'true' : 'false'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <button
            onClick={() => setSelectedView('cards')}
            className={`p-2 rounded ${
              selectedView === 'cards' 
                ? isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800' 
                : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
            }`}
            aria-label="Cards view"
            aria-pressed={selectedView === 'cards' ? 'true' : 'false'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="3" y="14" width="18" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <button
            onClick={() => setSelectedView('list')}
            className={`p-2 rounded ${
              selectedView === 'list' 
                ? isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800' 
                : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
            }`}
            aria-label="List view"
            aria-pressed={selectedView === 'list' ? 'true' : 'false'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 6H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 12H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="mb-16">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 w-1/4 mb-6 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg h-48"></div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400">
            <p>Error loading topics: {error.message}</p>
          </div>
        ) : filteredClusters && filteredClusters.length > 0 ? (
          <>
            <TopicClusters 
              variant={selectedView} 
              showHeading={false}
              topicSlug=""
              limit={100}
            />
            
            {searchQuery && (
              <p className="mt-4 text-sm text-center">
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  Found {filteredClusters.length} {filteredClusters.length === 1 ? 'topic' : 'topics'} matching "{searchQuery}"
                </span>
                <button 
                  onClick={clearSearch}
                  className={`ml-2 underline ${
                    isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  Clear search
                </button>
              </p>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Folder size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {searchQuery ? 'No matching topics found' : 'No topics available'}
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {searchQuery ? (
                <>
                  We couldn't find any topics matching "{searchQuery}".
                  <button 
                    onClick={clearSearch}
                    className={`ml-2 underline ${
                      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    Clear search
                  </button>
                </>
              ) : (
                'Topics will be available soon. Check back later.'
              )}
            </p>
          </div>
        )}
      </div>
      
      {/* Related sections */}
      <div className="mb-12">
        <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Discover More
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/blog/categories"
            className={`p-6 rounded-lg transition-colors ${
              isDark 
                ? 'bg-gray-800 hover:bg-gray-750 text-white' 
                : 'bg-white hover:bg-gray-50 text-gray-900 shadow-sm'
            }`}
          >
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-600'
              }`}>
                <Folder size={24} />
              </div>
              <h3 className="text-xl font-semibold">Categories</h3>
            </div>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              Browse all blog posts by category
            </p>
          </Link>
          
          <Link
            to="/blog/tags"
            className={`p-6 rounded-lg transition-colors ${
              isDark 
                ? 'bg-gray-800 hover:bg-gray-750 text-white' 
                : 'bg-white hover:bg-gray-50 text-gray-900 shadow-sm'
            }`}
          >
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-600'
              }`}>
                <Tag size={24} />
              </div>
              <h3 className="text-xl font-semibold">Tags</h3>
            </div>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              Explore posts by specific tags
            </p>
          </Link>
          
          <Link
            to="/blog/learning-paths"
            className={`p-6 rounded-lg transition-colors ${
              isDark 
                ? 'bg-gray-800 hover:bg-gray-750 text-white' 
                : 'bg-white hover:bg-gray-50 text-gray-900 shadow-sm'
            }`}
          >
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                isDark ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-600'
              }`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
                  <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 22V12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 12L20 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 12L4 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Learning Paths</h3>
            </div>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              Follow guided journeys through related content
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopicsPage; 