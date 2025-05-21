import React, { createContext, useContext, useReducer, useCallback, useState, useEffect } from 'react';

interface LoadingState {
  isLoading: boolean;
  loadingKeys: Set<string>;
  messages: Map<string, string>;
  loadingProgress: number;
}

type LoadingAction =
  | { type: 'START_LOADING'; key: string; message?: string }
  | { type: 'STOP_LOADING'; key: string }
  | { type: 'SET_PROGRESS'; progress: number }
  | { type: 'RESET_LOADING' };

interface LoadingContextValue extends LoadingState {
  startLoading: (key: string, message?: string) => void;
  stopLoading: (key: string) => void;
  resetLoading: () => void;
  getMessage: (key: string) => string | undefined;
  setProgress: (progress: number) => void;
}

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);

const initialState: LoadingState = {
  isLoading: false,
  loadingKeys: new Set(),
  messages: new Map(),
  loadingProgress: 0
};

function loadingReducer(state: LoadingState, action: LoadingAction): LoadingState {
  switch (action.type) {
    case 'START_LOADING': {
      const newLoadingKeys = new Set(state.loadingKeys);
      newLoadingKeys.add(action.key);
      const newMessages = new Map(state.messages);
      if (action.message) {
        newMessages.set(action.key, action.message);
      }
      return {
        ...state,
        isLoading: true,
        loadingKeys: newLoadingKeys,
        messages: newMessages
      };
    }
    case 'STOP_LOADING': {
      const newLoadingKeys = new Set(state.loadingKeys);
      newLoadingKeys.delete(action.key);
      const newMessages = new Map(state.messages);
      newMessages.delete(action.key);
      return {
        ...state,
        isLoading: newLoadingKeys.size > 0,
        loadingKeys: newLoadingKeys,
        messages: newMessages
      };
    }
    case 'SET_PROGRESS': {
      return {
        ...state,
        loadingProgress: action.progress
      };
    }
    case 'RESET_LOADING':
      return initialState;
    default:
      return state;
  }
}

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(loadingReducer, initialState);
  const [autoProgressActive, setAutoProgressActive] = useState(false);

  // Auto-increment progress when loading
  useEffect(() => {
    if (state.isLoading && autoProgressActive && state.loadingProgress < 90) {
      const intervalId = setInterval(() => {
        const nextProgress = Math.min(state.loadingProgress + (Math.random() * 5), 90);
        dispatch({ type: 'SET_PROGRESS', progress: nextProgress });
      }, 300);
      
      return () => clearInterval(intervalId);
    }
    
    // Reset progress when done loading
    if (!state.isLoading && state.loadingProgress > 0) {
      dispatch({ type: 'SET_PROGRESS', progress: 0 });
      setAutoProgressActive(false);
    }
  }, [state.isLoading, state.loadingProgress, autoProgressActive]);

  const startLoading = useCallback((key: string, message?: string) => {
    dispatch({ type: 'START_LOADING', key, message });
    // Start auto progress on first load
    if (!autoProgressActive) {
      setAutoProgressActive(true);
      dispatch({ type: 'SET_PROGRESS', progress: 10 });
    }
  }, [autoProgressActive]);

  const stopLoading = useCallback((key: string) => {
    dispatch({ type: 'STOP_LOADING', key });
  }, []);

  const resetLoading = useCallback(() => {
    dispatch({ type: 'RESET_LOADING' });
    setAutoProgressActive(false);
  }, []);

  const getMessage = useCallback((key: string) => {
    return state.messages.get(key);
  }, [state.messages]);
  
  const setProgress = useCallback((progress: number) => {
    dispatch({ type: 'SET_PROGRESS', progress });
    // Disable auto progress if manually setting
    if (autoProgressActive) {
      setAutoProgressActive(false);
    }
  }, [autoProgressActive]);

  const value = {
    ...state,
    startLoading,
    stopLoading,
    resetLoading,
    getMessage,
    setProgress
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
} 