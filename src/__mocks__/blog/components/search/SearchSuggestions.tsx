import React from 'react';
import { BlogPost } from '../../../../blog/types/blog';

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
  if (!isVisible || !searchTerm) {
    return null;
  }

  // Simple implementation that filters posts based on the search term
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div data-testid="search-suggestions">
      {filteredPosts.length === 0 ? (
        <div>No suggestions found</div>
      ) : (
        <ul>
          {filteredPosts.map(post => (
            <li 
              key={post.id} 
              onClick={() => onSelect(post.title)}
              data-testid="search-suggestion-item"
            >
              {post.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchSuggestions; 