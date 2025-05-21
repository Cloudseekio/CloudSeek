import { createAppError } from './errorUtils';

export interface TimeoutOptions {
  timeoutMs?: number;
  errorMessage?: string;
  signal?: AbortSignal;
}

/**
 * Creates a promise that rejects after a specified timeout.
 */
export function createTimeout(timeoutMs: number, message: string): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(createAppError(message, {
        title: 'Operation Timeout',
        code: 'TIMEOUT_ERROR',
        severity: 'error',
        retryable: true
      }));
    }, timeoutMs);
  });
}

/**
 * Wraps a promise with a timeout. If the promise doesn't resolve within the specified
 * time, it will reject with a timeout error.
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  options: TimeoutOptions = {}
): Promise<T> {
  const {
    timeoutMs = 30000,
    errorMessage = 'Operation timed out',
    signal
  } = options;

  if (signal?.aborted) {
    throw createAppError('Operation was cancelled', {
      title: 'Operation Cancelled',
      code: 'CANCELLED_ERROR',
      severity: 'info',
      retryable: true
    });
  }

  const timeoutPromise = createTimeout(timeoutMs, errorMessage);

  if (signal) {
    const abortPromise = new Promise<never>((_, reject) => {
      signal.addEventListener('abort', () => {
        reject(createAppError('Operation was cancelled', {
          title: 'Operation Cancelled',
          code: 'CANCELLED_ERROR',
          severity: 'info',
          retryable: true
        }));
      });
    });

    return Promise.race([promise, timeoutPromise, abortPromise]);
  }

  return Promise.race([promise, timeoutPromise]);
}

/**
 * Creates a deferred promise that can be resolved or rejected from outside.
 */
export function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

/**
 * Creates a promise that resolves after a specified delay.
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retries a promise-returning function with exponential backoff.
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    shouldRetry?: (error: unknown) => boolean;
    onRetry?: (attempt: number, error: unknown) => void;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelayMs = 1000,
    maxDelayMs = 30000,
    shouldRetry = () => true,
    onRetry
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      onRetry?.(attempt, error);

      const delayMs = Math.min(
        initialDelayMs * Math.pow(2, attempt - 1),
        maxDelayMs
      );
      await delay(delayMs);
    }
  }

  throw lastError;
}

/**
 * Creates a promise that can be cancelled.
 */
export function createCancellablePromise<T>(
  promise: Promise<T>,
  onCancel?: () => void
): { promise: Promise<T>; cancel: () => void } {
  const controller = new AbortController();

  const wrappedPromise = withTimeout(promise, { signal: controller.signal });

  return {
    promise: wrappedPromise,
    cancel: () => {
      controller.abort();
      onCancel?.();
    }
  };
} 

export interface TimeoutOptions {
  timeoutMs?: number;
  errorMessage?: string;
  signal?: AbortSignal;
}

/**
 * Creates a promise that rejects after a specified timeout.
 */
export function createTimeout(timeoutMs: number, message: string): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(createAppError(message, {
        title: 'Operation Timeout',
        code: 'TIMEOUT_ERROR',
        severity: 'error',
        retryable: true
      }));
    }, timeoutMs);
  });
}

/**
 * Wraps a promise with a timeout. If the promise doesn't resolve within the specified
 * time, it will reject with a timeout error.
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  options: TimeoutOptions = {}
): Promise<T> {
  const {
    timeoutMs = 30000,
    errorMessage = 'Operation timed out',
    signal
  } = options;

  if (signal?.aborted) {
    throw createAppError('Operation was cancelled', {
      title: 'Operation Cancelled',
      code: 'CANCELLED_ERROR',
      severity: 'info',
      retryable: true
    });
  }

  const timeoutPromise = createTimeout(timeoutMs, errorMessage);

  if (signal) {
    const abortPromise = new Promise<never>((_, reject) => {
      signal.addEventListener('abort', () => {
        reject(createAppError('Operation was cancelled', {
          title: 'Operation Cancelled',
          code: 'CANCELLED_ERROR',
          severity: 'info',
          retryable: true
        }));
      });
    });

    return Promise.race([promise, timeoutPromise, abortPromise]);
  }

  return Promise.race([promise, timeoutPromise]);
}

/**
 * Creates a deferred promise that can be resolved or rejected from outside.
 */
export function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

/**
 * Creates a promise that resolves after a specified delay.
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retries a promise-returning function with exponential backoff.
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    shouldRetry?: (error: unknown) => boolean;
    onRetry?: (attempt: number, error: unknown) => void;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelayMs = 1000,
    maxDelayMs = 30000,
    shouldRetry = () => true,
    onRetry
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      onRetry?.(attempt, error);

      const delayMs = Math.min(
        initialDelayMs * Math.pow(2, attempt - 1),
        maxDelayMs
      );
      await delay(delayMs);
    }
  }

  throw lastError;
}

/**
 * Creates a promise that can be cancelled.
 */
export function createCancellablePromise<T>(
  promise: Promise<T>,
  onCancel?: () => void
): { promise: Promise<T>; cancel: () => void } {
  const controller = new AbortController();

  const wrappedPromise = withTimeout(promise, { signal: controller.signal });

  return {
    promise: wrappedPromise,
    cancel: () => {
      controller.abort();
      onCancel?.();
    }
  };
} 