import React from 'react';
import { useSearchHistory } from '../../hooks/useSearchHistory';

interface SearchHistoryProps {
  onSelect: (term: string) => void;
  isVisible: boolean;
}

export const SearchHistory = ({ onSelect, isVisible }: SearchHistoryProps) => {
  const { history, clearHistory, removeFromHistory } = useSearchHistory();

  if (!isVisible || history.length === 0) {
    return null;
  }

  return (
    <div data-testid="search-history">
      <div className="header">
        <h3>Recent Searches</h3>
        <button onClick={clearHistory}>Clear All</button>
      </div>
      <ul>
        {history.map((term: string, index: number) => (
          <li key={`${term}-${index}`}>
            <div onClick={() => onSelect(term)}>{term}</div>
            <button 
              onClick={() => removeFromHistory(term)}
              aria-label={`Remove ${term} from search history`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHistory; 