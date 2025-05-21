import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Home, ChevronRight, BookOpen, Search, Filter, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLearningPaths, LearningPath } from '../hooks/useTopicClusters';

const LearningPathsPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch learning paths
  const { paths, isLoading, error } = useLearningPaths({
    includePosts: true
  });
  
  // Filter paths based on search query and filters
  const filteredPaths = paths?.filter(path => {
    // Filter by search query
    const matchesSearch = searchQuery.trim() === '' ||
      path.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by level
    const matchesLevel = levelFilter === 'all' || path.level === levelFilter;
    
    // Filter by tag
    const matchesTag = selectedTag === '' || path.tags?.includes(selectedTag);
    
    return matchesSearch && matchesLevel && matchesTag;
  });
  
  // Get unique tags from all paths
  const allTags = paths?.reduce((tags: string[], path) => {
    if (path.tags) {
      path.tags.forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    }
    return tags;
  }, []) || [];
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  const resetFilters = () => {
    setLevelFilter('all');
    setSelectedTag('');
  };
  
  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours} hr ${remainingMinutes} min` 
      : `${hours} hr`;
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
            Learning Paths
          </li>
        </ol>
      </nav>
      
      {/* Header */}
      <header className="mb-12">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Learning Paths
        </h1>
        <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Follow guided journeys through related content to master topics step by step
        </p>
      </header>
      
      {/* Search and Filter Controls */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-4 sm:space-y-0">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            </div>
            <input
              type="text"
              placeholder="Search learning paths..."
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
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-3 py-2 rounded-lg ${
              isDark 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-expanded={showFilters}
          >
            <Filter size={18} className="mr-2" />
            Filters
            {(levelFilter !== 'all' || selectedTag !== '') && (
              <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
              }`}>
                {(levelFilter !== 'all' ? 1 : 0) + (selectedTag !== '' ? 1 : 0)}
              </span>
            )}
          </button>
        </div>
        
        {/* Filters panel */}
        {showFilters && (
          <div className={`p-4 rounded-lg mb-4 ${
            isDark ? 'bg-gray-800' : 'bg-white shadow-sm'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Filter Learning Paths
              </h3>
              {(levelFilter !== 'all' || selectedTag !== '') && (
                <button
                  onClick={resetFilters}
                  className={`text-sm ${
                    isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  Reset all
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Level filters */}
              <div>
                <h4 className={`font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Difficulty Level
                </h4>
                <div className="space-y-2">
                  {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
                    <label key={level} className="flex items-center">
                      <input
                        type="radio"
                        name="level"
                        checked={levelFilter === level}
                        onChange={() => setLevelFilter(level)}
                        className={`mr-2 ${
                          isDark ? 'text-blue-500 bg-gray-700' : 'text-blue-600 bg-gray-100'
                        }`}
                      />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        {level === 'all' ? 'All levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Tag filters */}
              <div>
                <h4 className={`font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTag('')}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedTag === '' 
                        ? isDark 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-100 text-blue-800' 
                        : isDark 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1 text-sm rounded-full ${
                        selectedTag === tag 
                          ? isDark 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-100 text-blue-800' 
                          : isDark 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Search results info */}
        {searchQuery && filteredPaths && (
          <p className="text-sm mt-2">
            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              Found {filteredPaths.length} {filteredPaths.length === 1 ? 'path' : 'paths'} matching "{searchQuery}"
            </span>
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className={`ml-2 underline ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                Clear search
              </button>
            )}
          </p>
        )}
      </div>
      
      {/* Content */}
      <div className="mb-16">
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="h-7 bg-gray-200 dark:bg-gray-700 w-1/3 mb-4 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 w-3/4 mb-6 rounded"></div>
                <div className="flex justify-between mb-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 w-1/4 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 w-1/6 rounded"></div>
                </div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 mr-3"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 w-full rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400">
            <p>Error loading learning paths: {error.message}</p>
          </div>
        ) : filteredPaths?.length ? (
          <div className="space-y-6">
            {filteredPaths.map(path => (
              <LearningPathCard 
                key={path.id} 
                path={path} 
                isDark={isDark}
                formatTime={formatTime}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {searchQuery || levelFilter !== 'all' || selectedTag 
                ? 'No matching learning paths found' 
                : 'No learning paths available'}
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {searchQuery || levelFilter !== 'all' || selectedTag ? (
                <>
                  We couldn't find any learning paths matching your criteria.
                  <button 
                    onClick={resetFilters}
                    className={`ml-2 underline ${
                      isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    Reset filters
                  </button>
                </>
              ) : (
                'Learning paths will be available soon. Check back later.'
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface LearningPathCardProps {
  path: LearningPath;
  isDark: boolean;
  formatTime: (minutes: number) => string;
}

const LearningPathCard: React.FC<LearningPathCardProps> = ({ path, isDark, formatTime }) => {
  const completedStepsCount = path.completedSteps?.length || 0;
  const progress = path.steps.length > 0 
    ? (completedStepsCount / path.steps.length) * 100 
    : 0;
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700';
      case 'intermediate':
        return isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700';
      case 'advanced':
        return isDark ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700';
      default:
        return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700';
    }
  };
  
  return (
    <div className={`rounded-xl overflow-hidden transition-all ${
      isDark 
        ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700' 
        : 'bg-white hover:bg-gray-50 shadow-sm'
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className={`text-xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Link 
                to={`/blog/learning-paths/${path.slug}`}
                className={isDark ? 'hover:text-blue-300' : 'hover:text-blue-600'}
              >
                {path.name}
              </Link>
            </h2>
            {path.description && (
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {path.description}
              </p>
            )}
          </div>
          <div className={`rounded-full px-3 py-1 text-xs font-medium ${getLevelColor(path.level)}`}>
            {path.level.charAt(0).toUpperCase() + path.level.slice(1)}
          </div>
        </div>
        
        <div className="flex items-center mb-4 text-sm">
          <div className="flex items-center mr-4">
            <Clock size={16} className={isDark ? 'text-gray-400 mr-1' : 'text-gray-500 mr-1'} />
            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              {formatTime(path.estimatedTimeMinutes)}
            </span>
          </div>
          <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            {path.steps.length} {path.steps.length === 1 ? 'step' : 'steps'}
          </div>
          {path.tags && path.tags.length > 0 && (
            <div className="flex ml-auto">
              {path.tags.slice(0, 2).map(tag => (
                <Link 
                  key={tag}
                  to={`/blog/tags/${tag}`}
                  className={`ml-2 px-2 py-0.5 rounded text-xs ${
                    isDark 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </Link>
              ))}
              {path.tags.length > 2 && (
                <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                  isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                }`}>
                  +{path.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        {completedStepsCount > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Progress</span>
              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                {completedStepsCount}/{path.steps.length} steps
              </span>
            </div>
            <div className={`h-1.5 w-full rounded-full overflow-hidden ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div 
                className="h-full bg-blue-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Steps preview */}
        <div className="space-y-2">
          {path.steps.slice(0, 3).map((step, index) => (
            <div 
              key={step.id} 
              className={`flex items-start ${
                path.completedSteps?.includes(step.id)
                  ? isDark ? 'text-gray-400' : 'text-gray-500'
                  : isDark ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-xs ${
                path.completedSteps?.includes(step.id)
                  ? isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-600'
                  : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                {index + 1}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center">
                  <span className="line-clamp-1">{step.title}</span>
                  {path.completedSteps?.includes(step.id) && (
                    <svg className="ml-2 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                {step.estimatedTimeMinutes && (
                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {formatTime(step.estimatedTimeMinutes)}
                  </span>
                )}
              </div>
            </div>
          ))}
          
          {path.steps.length > 3 && (
            <div className={`text-sm mt-2 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              + {path.steps.length - 3} more steps
            </div>
          )}
        </div>
      </div>
      <div className={`px-6 py-3 border-t ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <Link 
          to={`/blog/learning-paths/${path.slug}`}
          className={`flex items-center text-sm font-medium ${
            isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
          }`}
        >
          {completedStepsCount > 0 && completedStepsCount < path.steps.length
            ? 'Continue learning'
            : completedStepsCount === path.steps.length
              ? 'Review again'
              : 'Start learning'
          }
          <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default LearningPathsPage; 