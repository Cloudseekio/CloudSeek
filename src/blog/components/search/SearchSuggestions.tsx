import { useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { BlogPost } from '../../types/blog';
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions';

interface SearchSuggestionsProps {
  searchTerm: string;
  onSelect: (suggestion: string) => void;
  posts: BlogPost[];
  isVisible: boolean;
}

export const SearchSuggestions = ({
  searchTerm,
  onSelect,
  posts,
  isVisible
}: SearchSuggestionsProps) => {
  const { suggestions, loading } = useSearchSuggestions(searchTerm, posts);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        // Close suggestions panel (handled by parent)
        onSelect('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onSelect]);

  if (!isVisible || !searchTerm || suggestions.length === 0) {
    return null;
  }

  return (
    <div
      ref={suggestionsRef}
      className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto"
    >
      {loading ? (
        <div className="p-4 text-gray-500 dark:text-gray-400">Loading suggestions...</div>
      ) : (
        <ul className="py-2">
          {suggestions.map((suggestion: string, index: number) => (
            <li
              key={`${suggestion}-${index}`}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2"
              onClick={() => onSelect(suggestion)}
            >
              <Search className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{suggestion}</span>
            </li>
          ))}
        </ul>
      )}
      {suggestions.length === 0 && searchTerm && !loading && (
        <div className="p-4 text-gray-500 dark:text-gray-400">
          No suggestions found
        </div>
      )}
    </div>
  );
}; 