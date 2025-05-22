import { createContext, useCallback, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import { ErrorNotification, ErrorNotificationProps } from '../components/error/ErrorNotification';
import { ErrorDetails, formatError } from '../utils/errorUtils';

interface ErrorNotificationState extends ErrorDetails {
  id: string;
  timestamp: number;
  autoHideDuration?: number;
}

type ErrorAction =
  | { type: 'ADD_ERROR'; payload: ErrorNotificationState }
  | { type: 'REMOVE_ERROR'; payload: string }
  | { type: 'CLEAR_ALL' };

interface ErrorContextValue {
  errors: ErrorNotificationState[];
  addError: (error: unknown, options?: Partial<ErrorNotificationProps>) => void;
  removeError: (id: string) => void;
  clearAllErrors: () => void;
}

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

function errorReducer(state: ErrorNotificationState[], action: ErrorAction): ErrorNotificationState[] {
  switch (action.type) {
    case 'ADD_ERROR':
      return [...state, action.payload];
    case 'REMOVE_ERROR':
      return state.filter(error => error.id !== action.payload);
    case 'CLEAR_ALL':
      return [];
    default:
      return state;
  }
}

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [errors, dispatch] = useReducer(errorReducer, []);

  const addError = useCallback((error: unknown, options: Partial<ErrorNotificationProps> = {}) => {
    const errorDetails = formatError(error);
    const id = Math.random().toString(36).substring(2, 9);
    
    dispatch({
      type: 'ADD_ERROR',
      payload: {
        ...errorDetails,
        id,
        timestamp: Date.now(),
        autoHideDuration: options.autoHideDuration
      }
    });
  }, []);

  const removeError = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ERROR', payload: id });
  }, []);

  const clearAllErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError, clearAllErrors }}>
      {children}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full"
      >
        {errors.map(error => (
          <ErrorNotification
            key={error.id}
            title={error.title}
            message={error.message}
            severity={error.severity}
            autoHideDuration={error.autoHideDuration}
            onClose={() => removeError(error.id)}
          />
        ))}
      </div>
    </ErrorContext.Provider>
  );
};

export function useError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
} 