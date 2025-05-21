import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useBlog } from '../../hooks/useBlog';
import AuthorCard from '../components/authors/AuthorCard';
import { Author } from '../../models/Blog';

interface UseBlogReturn {
  authors: Author[];
  isLoading: boolean;
  error: Error | null;
}

const AuthorsDirectory: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  
  const { authors, isLoading, error } = useBlog() as unknown as UseBlogReturn;

  // Filter authors based on search query
  const filteredAuthors = authors.filter(author => {
    const query = searchQuery.toLowerCase();
    return (
      author.name.toLowerCase().includes(query) ||
      author.title?.toLowerCase().includes(query) ||
      author.bio?.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-8" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Error loading authors
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          Meet Our Authors
        </h1>
        <p className={`mt-4 text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Get to know the talented writers and experts behind our content
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-12">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search authors..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
              isDark
                ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <Search 
            size={20} 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} 
          />
        </div>
      </div>

      {/* Authors Grid */}
      {filteredAuthors.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAuthors.map(author => (
            <AuthorCard
              key={author.id}
              author={author}
              variant="default"
              showStats={true}
              showFollow={true}
            />
          ))}
        </div>
      ) : (
        <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          No authors found matching your search
        </div>
      )}
    </div>
  );
};

export default AuthorsDirectory; 