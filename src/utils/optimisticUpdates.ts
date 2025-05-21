import { useState, useCallback, useRef } from 'react';

export interface OptimisticUpdate<T> {
  // Unique identifier for the update
  id: string;
  // Timestamp when the update was initiated
  timestamp: number;
  // The optimistic data
  data: T;
  // Original data for rollback
  originalData: T;
  // Status of the update
  status: 'pending' | 'success' | 'error';
  // Error information if status is 'error'
  error?: Error;
}

export interface OptimisticOptions<T> {
  // Function to generate unique IDs for updates
  generateId?: () => string;
  // Timeout for pending updates (in ms)
  timeout?: number;
  // Callbacks
  onSuccess?: (data: T) => void;
  onError?: (error: Error, originalData: T) => void;
  onTimeout?: (update: OptimisticUpdate<T>) => void;
}

export interface OptimisticState<T> {
  // Current data state
  data: T;
  // Whether any updates are pending
  isPending: boolean;
  // Whether any updates have failed
  hasError: boolean;
  // Latest error if any
  error: Error | null;
  // Pending updates
  pendingUpdates: OptimisticUpdate<T>[];
  // Failed updates
  failedUpdates: OptimisticUpdate<T>[];
}

export function useOptimisticUpdates<T>(
  initialData: T,
  options: OptimisticOptions<T> = {}
) {
  const {
    generateId = () => Math.random().toString(36).substr(2, 9),
    timeout = 5000,
    onSuccess,
    onError,
    onTimeout,
  } = options;

  // State management
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    isPending: false,
    hasError: false,
    error: null,
    pendingUpdates: [],
    failedUpdates: [],
  });

  // Refs for cleanup
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Clear timeout for an update
  const clearUpdateTimeout = useCallback((updateId: string) => {
    const timeoutRef = timeoutRefs.current.get(updateId);
    if (timeoutRef) {
      clearTimeout(timeoutRef);
      timeoutRefs.current.delete(updateId);
    }
  }, []);

  // Handle update timeout
  const handleTimeout = useCallback((update: OptimisticUpdate<T>) => {
    setState(prev => ({
      ...prev,
      data: update.originalData,
      isPending: prev.pendingUpdates.length > 1,
      pendingUpdates: prev.pendingUpdates.filter(u => u.id !== update.id),
      failedUpdates: [...prev.failedUpdates, { ...update, status: 'error', error: new Error('Update timeout') }],
      hasError: true,
      error: new Error('Update timeout'),
    }));

    clearUpdateTimeout(update.id);
    onTimeout?.(update);
  }, [clearUpdateTimeout, onTimeout]);

  // Apply optimistic update
  const applyUpdate = useCallback(async (
    newData: T,
    mutation: () => Promise<T>
  ) => {
    const updateId = generateId();
    const update: OptimisticUpdate<T> = {
      id: updateId,
      timestamp: Date.now(),
      data: newData,
      originalData: state.data,
      status: 'pending',
    };

    // Set timeout for the update
    const timeoutRef = setTimeout(() => {
      handleTimeout(update);
    }, timeout);
    timeoutRefs.current.set(updateId, timeoutRef);

    // Apply optimistic update
    setState(prev => ({
      ...prev,
      data: newData,
      isPending: true,
      pendingUpdates: [...prev.pendingUpdates, update],
    }));

    try {
      // Execute actual mutation
      const result = await mutation();

      // Update succeeded
      setState(prev => ({
        ...prev,
        data: result,
        isPending: prev.pendingUpdates.length > 1,
        pendingUpdates: prev.pendingUpdates.filter(u => u.id !== updateId),
        hasError: false,
        error: null,
      }));

      clearUpdateTimeout(updateId);
      onSuccess?.(result);

      return result;
    } catch (error) {
      // Update failed
      setState(prev => ({
        ...prev,
        data: update.originalData,
        isPending: prev.pendingUpdates.length > 1,
        pendingUpdates: prev.pendingUpdates.filter(u => u.id !== updateId),
        failedUpdates: [...prev.failedUpdates, { ...update, status: 'error', error: error as Error }],
        hasError: true,
        error: error as Error,
      }));

      clearUpdateTimeout(updateId);
      onError?.(error as Error, update.originalData);

      throw error;
    }
  }, [state.data, generateId, timeout, handleTimeout, clearUpdateTimeout, onSuccess, onError]);

  // Retry failed update
  const retryUpdate = useCallback(async (updateId: string) => {
    const failedUpdate = state.failedUpdates.find(u => u.id === updateId);
    if (!failedUpdate) return;

    setState(prev => ({
      ...prev,
      failedUpdates: prev.failedUpdates.filter(u => u.id !== updateId),
      hasError: prev.failedUpdates.length > 1,
      error: prev.failedUpdates.length > 1 ? prev.error : null,
    }));

    return applyUpdate(failedUpdate.data, async () => failedUpdate.data);
  }, [state.failedUpdates, applyUpdate]);

  // Rollback failed update
  const rollbackUpdate = useCallback((updateId: string) => {
    const failedUpdate = state.failedUpdates.find(u => u.id === updateId);
    if (!failedUpdate) return;

    setState(prev => ({
      ...prev,
      failedUpdates: prev.failedUpdates.filter(u => u.id !== updateId),
      hasError: prev.failedUpdates.length > 1,
      error: prev.failedUpdates.length > 1 ? prev.error : null,
    }));
  }, [state.failedUpdates]);

  // Reset state
  const reset = useCallback(() => {
    // Clear all timeouts
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current.clear();

    setState({
      data: initialData,
      isPending: false,
      hasError: false,
      error: null,
      pendingUpdates: [],
      failedUpdates: [],
    });
  }, [initialData]);

  return {
    // Current state
    data: state.data,
    isPending: state.isPending,
    hasError: state.hasError,
    error: state.error,
    pendingUpdates: state.pendingUpdates,
    failedUpdates: state.failedUpdates,
    // Actions
    applyUpdate,
    retryUpdate,
    rollbackUpdate,
    reset,
  };
} 