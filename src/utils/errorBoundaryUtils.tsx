import React, { ComponentType } from 'react';
import { AsyncErrorBoundary } from '../components/error/AsyncErrorBoundary';
import { ErrorDetails, formatError } from './errorUtils';
import logger from './logger';

export interface WithErrorBoundaryOptions {
  fallback?: React.ReactNode;
  onError?: (error: unknown) => void;
  onReset?: () => void;
  maxRetries?: number;
  retryDelay?: number;
  loadingFallback?: React.ReactNode;
}

/**
 * Higher-order component that wraps a component with an AsyncErrorBoundary.
 */
export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
): ComponentType<P> {
  const WithErrorBoundary = (props: P) => (
    <AsyncErrorBoundary {...options}>
      <Component {...props} />
    </AsyncErrorBoundary>
  );

  WithErrorBoundary.displayName = `WithErrorBoundary(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WithErrorBoundary;
}

/**
 * Creates an error handler function that formats and logs errors.
 */
export function createErrorHandler(options: {
  context?: string;
  onError?: (error: unknown) => void;
  shouldLog?: boolean;
} = {}) {
  const { context, onError, shouldLog = true } = options;

  return function handleError(error: unknown) {
    const errorDetails = formatError(error);

    if (shouldLog) {
      logger.error(
        `Error in ${context || 'application'}:`,
        {
          ...errorDetails,
          stack: error instanceof Error ? error.stack : undefined
        }
      );
    }

    onError?.(error);
    return errorDetails;
  };
}

/**
 * Wraps a promise-returning function with error handling.
 */
export function wrapWithErrorHandler<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  options: {
    context?: string;
    onError?: (error: unknown) => void;
    transformError?: (error: unknown) => ErrorDetails;
  } = {}
): (...args: Args) => Promise<Result> {
  const { context, onError, transformError } = options;
  const handleError = createErrorHandler({ context, onError });

  return async function wrapped(...args: Args) {
    try {
      return await fn(...args);
    } catch (error) {
      const errorDetails = transformError ? transformError(error) : handleError(error);
      throw errorDetails;
    }
  };
}

/**
 * Creates a function that safely executes a callback and handles any errors.
 */
export function createSafeExecutor(options: {
  context?: string;
  onError?: (error: unknown) => void;
  shouldRethrow?: boolean;
} = {}) {
  const { context, onError, shouldRethrow = false } = options;
  const handleError = createErrorHandler({ context, onError });

  return async function safeExecute<T>(callback: () => Promise<T> | T): Promise<T | undefined> {
    try {
      return await callback();
    } catch (error) {
      handleError(error);
      if (shouldRethrow) {
        throw error;
      }
      return undefined;
    }
  };
} 