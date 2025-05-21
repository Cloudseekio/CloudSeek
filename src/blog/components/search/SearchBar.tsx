import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useFilters } from '../../context/FilterContext';
import { SearchSuggestions } from './SearchSuggestions';
import { SearchHistory } from './SearchHistory';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { BlogPost } from '../../types/blog';

interface SearchBarProps {
  posts: BlogPost[];
  className?: string;
}

export const SearchBar = ({ posts, className = '' }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setFilter } = useFilters();
  const { addToHistory } = useSearchHistory();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilter('search', term);
    if (term.trim()) {
      addToHistory(term.trim());
    }
    setShowSuggestions(false);
    setShowHistory(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilter('search', '');
    setShowSuggestions(false);
    setShowHistory(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (searchTerm) {
      setShowSuggestions(true);
      setShowHistory(false);
    } else {
      setShowHistory(true);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      setShowSuggestions(true);
      setShowHistory(false);
    } else if (isFocused) {
      setShowHistory(true);
      setShowSuggestions(false);
    }
  }, [searchTerm, isFocused]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleFocus}
          placeholder="Search posts..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        )}
      </div>

      <SearchSuggestions
        searchTerm={searchTerm}
        onSelect={handleSearch}
        posts={posts}
        isVisible={showSuggestions}
      />

      <SearchHistory
        onSelect={handleSearch}
        isVisible={showHistory}
      />
    </div>
  );
}; 