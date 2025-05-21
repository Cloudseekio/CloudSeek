import logger from '../../utils/logger';

export interface CacheItem<T> {
  data: T;
  expiry: number;
  size: number;
  key: string;
  timestamp: number;
  hits: number;
  type: string;
}

export interface CacheConfig {
  maxSize: number;        // Maximum cache size in bytes
  maxAge: number;         // Maximum age of cache items in milliseconds
  maxItems: number;       // Maximum number of items in cache
  cleanupInterval: number; // Cleanup interval in milliseconds
}

export interface CacheStats {
  size: number;
  itemCount: number;
  hits: number;
  misses: number;
  hitRate: number;
  oldestItem: number;
  newestItem: number;
}

export interface CacheDebugInfo extends CacheStats {
  items: Array<{
    key: string;
    size: number;
    age: number;
    hits: number;
    type: string;
    isExpired: boolean;
  }>;
}

export class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem<unknown>>;
  private config: CacheConfig;
  private stats: {
    hits: number;
    misses: number;
    totalSize: number;
    cleanups: number;
  };
  private cleanupTimer: NodeJS.Timer | null;

  private constructor(config: Partial<CacheConfig> = {}) {
    this.cache = new Map();
    this.config = {
      maxSize: config.maxSize || 50 * 1024 * 1024, // 50MB
      maxAge: config.maxAge || 30 * 60 * 1000,     // 30 minutes
      maxItems: config.maxItems || 1000,
      cleanupInterval: config.cleanupInterval || 5 * 60 * 1000 // 5 minutes
    };
    this.stats = {
      hits: 0,
      misses: 0,
      totalSize: 0,
      cleanups: 0
    };
    this.cleanupTimer = null;
    this.startCleanupTimer();
  }

  static getInstance(config?: Partial<CacheConfig>): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService(config);
    }
    return CacheService.instance;
  }

  set<T>(key: string, data: T, options: {
    ttl?: number;
    type?: string;
  } = {}): void {
    const timestamp = Date.now();
    const size = this.calculateSize(data);
    
    // Check if adding this item would exceed maxSize
    if (size > this.config.maxSize) {
      logger.warn('Cache item too large:', {
        key,
        size,
        maxSize: this.config.maxSize
      });
      return;
    }

    // Remove oldest items if cache would exceed maxSize
    while (this.stats.totalSize + size > this.config.maxSize) {
      this.removeOldestItem();
    }

    // Remove oldest items if cache would exceed maxItems
    while (this.cache.size >= this.config.maxItems) {
      this.removeOldestItem();
    }

    const ttl = options.ttl || this.config.maxAge;
    const item: CacheItem<T> = {
      data,
      expiry: timestamp + ttl,
      size,
      key,
      timestamp,
      hits: 0,
      type: options.type || 'unknown'
    };

    this.cache.set(key, item);
    this.stats.totalSize += size;

    logger.debug('Cache item set:', {
      key,
      size,
      ttl,
      type: options.type
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key) as CacheItem<T> | undefined;

    if (!item) {
      this.stats.misses++;
      return null;
    }

    if (this.isExpired(item)) {
      this.remove(key);
      this.stats.misses++;
      return null;
    }

    item.hits++;
    this.stats.hits++;
    return item.data;
  }

  remove(key: string): void {
    const item = this.cache.get(key);
    if (item) {
      this.stats.totalSize -= item.size;
      this.cache.delete(key);
    }
  }

  clear(): void {
    this.cache.clear();
    this.stats.totalSize = 0;
    logger.info('Cache cleared');
  }

  getStats(): CacheStats {
    const now = Date.now();
    let oldestTimestamp = now;
    let newestTimestamp = 0;

    this.cache.forEach(item => {
      oldestTimestamp = Math.min(oldestTimestamp, item.timestamp);
      newestTimestamp = Math.max(newestTimestamp, item.timestamp);
    });

    return {
      size: this.stats.totalSize,
      itemCount: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
      oldestItem: oldestTimestamp,
      newestItem: newestTimestamp
    };
  }

  getDebugInfo(): CacheDebugInfo {
    const now = Date.now();
    const stats = this.getStats();
    const items = Array.from(this.cache.entries()).map(([key, item]) => ({
      key,
      size: item.size,
      age: now - item.timestamp,
      hits: item.hits,
      type: item.type,
      isExpired: this.isExpired(item)
    }));

    return {
      ...stats,
      items
    };
  }

  invalidate(pattern: RegExp): number {
    let count = 0;
    for (const [key] of this.cache) {
      if (pattern.test(key)) {
        this.remove(key);
        count++;
      }
    }
    logger.info(`Invalidated ${count} cache items matching pattern:`, pattern);
    return count;
  }

  private isExpired(item: CacheItem<unknown>): boolean {
    return Date.now() > item.expiry;
  }

  private removeOldestItem(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    for (const [key, item] of this.cache) {
      if (item.timestamp < oldestTimestamp) {
        oldestTimestamp = item.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.remove(oldestKey);
    }
  }

  private startCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  private cleanup(): void {
    const now = Date.now();
    let removedCount = 0;
    let removedSize = 0;

    for (const [key, item] of this.cache) {
      if (this.isExpired(item)) {
        removedSize += item.size;
        this.remove(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      this.stats.cleanups++;
      logger.debug('Cache cleanup completed:', {
        removedItems: removedCount,
        removedSize,
        remainingItems: this.cache.size,
        remainingSize: this.stats.totalSize
      });
    }
  }

  private calculateSize(data: unknown): number {
    try {
      const str = JSON.stringify(data);
      return str.length * 2; // Approximate size in bytes (UTF-16)
    } catch {
      return 1024; // Default size if can't calculate
    }
  }
} 