import { useState, useEffect } from 'react';

const STORAGE_KEY = 'blog-search-history';
const MAX_HISTORY_ITEMS = 10;

interface UseSearchHistoryResult {
  history: string[];
  addToHistory: (term: string) => void;
  removeFromHistory: (term: string) => void;
  clearHistory: () => void;
}

export const useSearchHistory = (): UseSearchHistoryResult => {
  const [history, setHistory] = useState<string[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          setHistory(parsedHistory);
        }
      } catch (error) {
        console.error('Failed to parse search history:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = (term: string) => {
    if (!term.trim()) return;

    setHistory(prevHistory => {
      const newHistory = [
        term,
        ...prevHistory.filter(item => item !== term)
      ].slice(0, MAX_HISTORY_ITEMS);
      return newHistory;
    });
  };

  const removeFromHistory = (term: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item !== term));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}; 