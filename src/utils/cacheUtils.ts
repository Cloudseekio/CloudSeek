/**
 * Cache item interface with value and metadata
 */
export interface CacheItem<T> {
  value: T;
  expiresAt: number | null; // Timestamp when the item expires (null = never expires)
  createdAt: number;        // Timestamp when the item was created
  lastAccessed: number;     // Timestamp when the item was last accessed
  accessCount: number;      // Number of times the item has been accessed
}

/**
 * Cache options for configuration
 */
export interface CacheOptions {
  ttl?: number | null;      // Time to live in milliseconds (default: no expiration)
  maxSize?: number;         // Maximum number of items in the cache (default: unlimited)
  storageType?: 'memory';   // Where to store the cache (only memory for now, could add localStorage, etc.)
}

/**
 * Cache statistics for monitoring
 */
export interface CacheStats {
  size: number;            // Current number of items in the cache
  hits: number;            // Number of cache hits
  misses: number;          // Number of cache misses
  createdAt: number;       // When the cache was created
  lastCleared: number | null; // When the cache was last cleared
}

/**
 * Generic cache utility class with TTL support
 */
export class Cache<T = unknown> {
  private cache: Map<string, CacheItem<T>> = new Map();
  private options: {
    ttl: number | null;
    maxSize: number;
    storageType: 'memory';
  };
  private stats: CacheStats;

  /**
   * Create a new cache instance with options
   */
  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl ?? null,
      maxSize: options.maxSize ?? Infinity,
      storageType: options.storageType ?? 'memory',
    };

    this.stats = {
      size: 0,
      hits: 0,
      misses: 0,
      createdAt: Date.now(),
      lastCleared: null,
    };
  }

  /**
   * Get an item from the cache
   * @param key The cache key
   * @returns The value or undefined if not found or expired
   */
  get(key: string): T | undefined {
    const item = this.cache.get(key);

    // Handle cache miss
    if (!item) {
      this.stats.misses++;
      return undefined;
    }

    // Check if the item has expired
    if (this.isExpired(item)) {
      this.delete(key);
      this.stats.misses++;
      return undefined;
    }

    // Update access metadata
    item.lastAccessed = Date.now();
    item.accessCount++;
    this.stats.hits++;

    return item.value;
  }

  /**
   * Set an item in the cache
   * @param key The cache key
   * @param value The value to store
   * @param ttl Optional TTL override for this specific item
   * @returns The cache instance for chaining
   */
  set(key: string, value: T, ttl?: number | null): this {
    // Calculate expiration time
    const now = Date.now();
    const expiresAt = ttl !== undefined
      ? (ttl === null ? null : now + ttl)
      : (this.options.ttl === null ? null : now + this.options.ttl);

    // Create the cache item
    const item: CacheItem<T> = {
      value,
      expiresAt,
      createdAt: now,
      lastAccessed: now,
      accessCount: 0,
    };

    // Add to cache
    this.cache.set(key, item);
    this.stats.size = this.cache.size;

    // Check if we need to evict items
    this.enforceMaxSize();

    return this;
  }

  /**
   * Check if an item exists in the cache
   * @param key The cache key
   * @returns True if the item exists and hasn't expired
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (this.isExpired(item)) {
      this.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Delete an item from the cache
   * @param key The cache key
   * @returns True if the item was deleted
   */
  delete(key: string): boolean {
    const result = this.cache.delete(key);
    this.stats.size = this.cache.size;
    return result;
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
    this.stats.size = 0;
    this.stats.lastCleared = Date.now();
  }

  /**
   * Get the current cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Get all cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get all cache entries
   * Useful for debugging, but use carefully with large caches
   */
  entries(): [string, CacheItem<T>][] {
    return Array.from(this.cache.entries());
  }

  /**
   * Check if a cache item has expired
   */
  private isExpired(item: CacheItem<T>): boolean {
    return item.expiresAt !== null && item.expiresAt <= Date.now();
  }

  /**
   * Enforce the maximum cache size by removing least recently used items
   */
  private enforceMaxSize(): void {
    if (this.cache.size <= this.options.maxSize) {
      return;
    }

    // Get items sorted by last accessed time (oldest first)
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);

    // Remove oldest items until we're under the limit
    const itemsToRemove = this.cache.size - this.options.maxSize;
    for (let i = 0; i < itemsToRemove; i++) {
      this.cache.delete(entries[i][0]);
    }

    this.stats.size = this.cache.size;
  }
}

/**
 * Create a new cache instance with the given options
 */
export function createCache<T>(options?: CacheOptions): Cache<T> {
  return new Cache<T>(options);
}

export default {
  Cache,
  createCache
}; 