import { NotificationSeverity } from '../components/error/ErrorNotification';
import { AxiosError } from 'axios';

export interface ErrorDetails {
  title: string;
  message: string;
  severity: NotificationSeverity;
  code?: string;
  retryable?: boolean;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly isRetryable: boolean;
  public readonly originalError?: Error;

  constructor(message: string, code: string, isRetryable = false, originalError?: Error) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.isRetryable = isRetryable;
    this.originalError = originalError;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function formatError(error: unknown): ErrorDetails {
  if (isAppError(error)) {
    return {
      title: error.name,
      message: error.message,
      severity: 'error',
      code: error.code,
      retryable: error.isRetryable
    };
  }

  if (error instanceof Error) {
    return {
      title: error.name,
      message: error.message,
      severity: 'error',
      retryable: true
    };
  }

  // Handle network errors
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return {
      title: 'Network Error',
      message: 'Unable to connect to the server. Please check your internet connection.',
      severity: 'error',
      code: 'NETWORK_ERROR',
      retryable: true
    };
  }

  // Handle unknown errors
  return {
    title: 'Unexpected Error',
    message: String(error),
    severity: 'critical',
    code: 'UNKNOWN_ERROR',
    retryable: false
  };
}

export function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError)?.isAxiosError === true;
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.isRetryable;
  }

  if (isAxiosError(error)) {
    // Network errors and server errors (except 4xx) are retryable
    return !error.response || error.response.status >= 500;
  }

  return false;
}

export function createAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'Network error';

    if (status === 404) {
      return new AppError(message, 'NOT_FOUND', false, error);
    }

    if (status === 401) {
      return new AppError(message, 'UNAUTHORIZED', false, error);
    }

    if (status === 403) {
      return new AppError(message, 'FORBIDDEN', false, error);
    }

    if (status === 400) {
      return new AppError(message, 'BAD_REQUEST', false, error);
    }

    if (status && status >= 500) {
      return new AppError(message, 'SERVER_ERROR', true, error);
    }

    return new AppError(message, 'NETWORK_ERROR', true, error);
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR', false, error);
  }

  return new AppError(
    'An unexpected error occurred',
    'UNKNOWN_ERROR',
    false
  );
}

export function getErrorCode(error: unknown): string | undefined {
  if (isAppError(error)) {
    return error.code;
  }
  return undefined;
}

export function createNetworkError(message = 'Network request failed'): AppError {
  return new AppError(message, 'NETWORK_ERROR', true);
}

export function createValidationError(message: string): AppError {
  return new AppError(message, 'VALIDATION_ERROR', false);
}

export function createAuthenticationError(message = 'Authentication failed'): AppError {
  return new AppError(message, 'AUTH_ERROR', false);
} 