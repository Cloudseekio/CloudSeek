import { Clock, X } from 'lucide-react';
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
    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Searches</h3>
        <button
          onClick={clearHistory}
          className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Clear All
        </button>
      </div>
      <ul className="py-2">
        {history.map((term: string, index: number) => (
          <li
            key={`${term}-${index}`}
            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-2 flex-1"
                onClick={() => onSelect(term)}
              >
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{term}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromHistory(term);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                aria-label={`Remove ${term} from search history`}
              >
                <X className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}; 