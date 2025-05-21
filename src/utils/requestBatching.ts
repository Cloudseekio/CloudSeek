import { useCallback, useEffect, useRef } from 'react';

interface BatchOptions {
  // Maximum batch size
  maxBatchSize?: number;
  // Maximum wait time before processing a batch (ms)
  maxWaitTime?: number;
  // Cache TTL (ms)
  cacheTTL?: number;
  // Whether to deduplicate identical requests
  deduplicate?: boolean;
  // Priority levels for requests
  priorityLevels?: {
    high: number;
    medium: number;
    low: number;
  };
}

interface BatchRequest<T, R> {
  id: string;
  params: T;
  priority: 'high' | 'medium' | 'low';
  timestamp: number;
  resolve: (value: R) => void;
  reject: (error: Error) => void;
}

interface BatchProcessor<T, R> {
  // Function to process a batch of requests
  process: (requests: T[]) => Promise<R[]>;
  // Optional function to generate cache key for a request
  getCacheKey?: (params: T) => string;
  // Optional function to transform response for a specific request
  transformResponse?: (response: R, request: T) => R;
}

const defaultOptions: Required<BatchOptions> = {
  maxBatchSize: 50,
  maxWaitTime: 50,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  deduplicate: true,
  priorityLevels: {
    high: 3,
    medium: 2,
    low: 1,
  },
};

/**
 * Cache for storing request results
 */
class RequestCache<R> {
  private cache = new Map<string, { data: R; timestamp: number }>();

  set(key: string, data: R, ttl: number) {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + ttl,
    });
  }

  get(key: string): R | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.timestamp) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.data;
  }

  clear() {
    this.cache.clear();
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Hook for batching requests
 */
export function useBatchRequests<T, R>(
  processor: BatchProcessor<T, R>,
  options: BatchOptions = {}
) {
  // Merge options with defaults
  const {
    maxBatchSize,
    maxWaitTime,
    cacheTTL,
    deduplicate,
    priorityLevels,
  } = { ...defaultOptions, ...options };

  // Refs for managing batches and timeouts
  const pendingBatch = useRef<BatchRequest<T, R>[]>([]);
  const processingBatch = useRef<BatchRequest<T, R>[]>([]);
  const batchTimeout = useRef<NodeJS.Timeout | null>(null);
  const cache = useRef<RequestCache<R>>(new RequestCache());

  // Process current batch
  const processBatch = useCallback(async () => {
    if (processingBatch.current.length > 0 || pendingBatch.current.length === 0) {
      return;
    }

    // Sort by priority and timestamp
    const sortedBatch = [...pendingBatch.current].sort((a, b) => {
      const priorityDiff = priorityLevels[b.priority] - priorityLevels[a.priority];
      return priorityDiff === 0 ? a.timestamp - b.timestamp : priorityDiff;
    });

    // Take up to maxBatchSize requests
    processingBatch.current = sortedBatch.slice(0, maxBatchSize);
    pendingBatch.current = sortedBatch.slice(maxBatchSize);

    try {
      // Process the batch
      const params = processingBatch.current.map(req => req.params);
      const results = await processor.process(params);

      // Resolve individual requests
      processingBatch.current.forEach((request, index) => {
        const result = results[index];
        const transformedResult = processor.transformResponse?.(result, request.params) ?? result;

        // Cache the result if cache key is provided
        if (processor.getCacheKey) {
          const cacheKey = processor.getCacheKey(request.params);
          cache.current.set(cacheKey, transformedResult, cacheTTL);
        }

        request.resolve(transformedResult);
      });
    } catch (error) {
      // Reject all requests in the batch
      processingBatch.current.forEach(request => {
        request.reject(error as Error);
      });
    } finally {
      processingBatch.current = [];

      // Process next batch if there are pending requests
      if (pendingBatch.current.length > 0) {
        void processBatch();
      }
    }
  }, [processor, maxBatchSize, cacheTTL, priorityLevels]);

  // Schedule batch processing
  const scheduleBatch = useCallback(() => {
    if (batchTimeout.current) {
      clearTimeout(batchTimeout.current);
    }

    batchTimeout.current = setTimeout(() => {
      void processBatch();
    }, maxWaitTime);
  }, [maxWaitTime, processBatch]);

  // Add request to batch
  const addRequest = useCallback(async (
    params: T,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): Promise<R> => {
    // Check cache first
    if (processor.getCacheKey) {
      const cacheKey = processor.getCacheKey(params);
      const cached = cache.current.get(cacheKey);
      if (cached !== undefined) {
        return cached;
      }
    }

    // Check for duplicate request if deduplication is enabled
    if (deduplicate && processor.getCacheKey) {
      const cacheKey = processor.getCacheKey(params);
      const duplicateRequest = [...pendingBatch.current, ...processingBatch.current]
        .find(req => processor.getCacheKey!(req.params) === cacheKey);

      if (duplicateRequest) {
        return new Promise((resolve, reject) => {
          duplicateRequest.resolve = resolve;
          duplicateRequest.reject = reject;
        });
      }
    }

    return new Promise((resolve, reject) => {
      pendingBatch.current.push({
        id: Math.random().toString(36).substr(2, 9),
        params,
        priority,
        timestamp: Date.now(),
        resolve,
        reject,
      });

      scheduleBatch();
    });
  }, [processor, deduplicate, scheduleBatch]);

  // Cleanup on unmount
  useEffect(() => {
    const interval = setInterval(() => {
      cache.current.cleanup();
    }, cacheTTL);

    return () => {
      if (batchTimeout.current) {
        clearTimeout(batchTimeout.current);
      }
      clearInterval(interval);
      cache.current.clear();
    };
  }, [cacheTTL]);

  return {
    addRequest,
    clearCache: () => cache.current.clear(),
  };
} 