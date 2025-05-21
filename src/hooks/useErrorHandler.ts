import { useCallback, useState } from 'react';
import { useError } from '../contexts/ErrorContext';
import { isRetryableError } from '../utils/errorUtils';
import logger from '../utils/logger';

export interface UseErrorHandlerOptions {
  maxRetries?: number;
  onError?: (error: unknown) => void;
  onRetry?: (retryCount: number) => void | Promise<void>;
  onMaxRetriesReached?: (error: unknown) => void;
  showNotification?: boolean;
  notificationDuration?: number;
}

interface ErrorState {
  error: unknown | null;
  timestamp: number | null;
  retryCount: number;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const {
    maxRetries = 3,
    onError,
    onRetry,
    onMaxRetriesReached,
    showNotification = true,
    notificationDuration = 5000
  } = options;

  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    timestamp: null,
    retryCount: 0
  });

  const { addError } = useError();

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      timestamp: null,
      retryCount: 0
    });
  }, []);

  const handleError = useCallback(
    async (error: unknown) => {
      logger.error('Error caught by useErrorHandler:', error);
      
      const nextRetryCount = errorState.retryCount + 1;
      const canRetry = isRetryableError(error) && nextRetryCount <= maxRetries;

      setErrorState({
        error,
        timestamp: Date.now(),
        retryCount: nextRetryCount
      });

      if (showNotification) {
        addError(error, { autoHideDuration: notificationDuration });
      }

      onError?.(error);

      if (!canRetry) {
        onMaxRetriesReached?.(error);
        return;
      }

      try {
        await onRetry?.(nextRetryCount);
      } catch (retryError) {
        logger.error('Error during retry:', retryError);
      }
    },
    [
      errorState.retryCount,
      maxRetries,
      onError,
      onRetry,
      onMaxRetriesReached,
      showNotification,
      notificationDuration,
      addError
    ]
  );

  const wrapPromise = useCallback(
    <T>(promise: Promise<T>): Promise<T> => {
      return promise.catch(async error => {
        await handleError(error);
        throw error;
      });
    },
    [handleError]
  );

  return {
    error: errorState.error,
    timestamp: errorState.timestamp,
    retryCount: errorState.retryCount,
    handleError,
    clearError,
    wrapPromise
  };
} 