import { useState, useEffect } from 'react';
import { BlogPost } from '../types/blog';

interface UseSearchSuggestionsResult {
  suggestions: string[];
  loading: boolean;
}

export const useSearchSuggestions = (
  searchTerm: string,
  posts: BlogPost[]
): UseSearchSuggestionsResult => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    // Generate suggestions based on post titles and content
    const generateSuggestions = () => {
      const searchLower = searchTerm.toLowerCase();
      const uniqueSuggestions = new Set<string>();

      posts.forEach(post => {
        // Check title
        if (post.title.toLowerCase().includes(searchLower)) {
          uniqueSuggestions.add(post.title);
        }

        // Check categories
        post.categories?.forEach(category => {
          if (category.toLowerCase().includes(searchLower)) {
            uniqueSuggestions.add(category);
          }
        });

        // Check tags
        post.tags?.forEach(tag => {
          if (tag.toLowerCase().includes(searchLower)) {
            uniqueSuggestions.add(tag);
          }
        });

        // Check author
        if (post.author?.name.toLowerCase().includes(searchLower)) {
          uniqueSuggestions.add(post.author.name);
        }
      });

      return Array.from(uniqueSuggestions).slice(0, 5); // Limit to top 5 suggestions
    };

    // Simulate async operation for better UX
    const timeoutId = setTimeout(() => {
      const newSuggestions = generateSuggestions();
      setSuggestions(newSuggestions);
      setLoading(false);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, posts]);

  return { suggestions, loading };
}; 