/**
 * BrowserCache: A lightweight browser-compatible replacement for node-cache
 * 
 * This implementation mirrors the API of node-cache that's used in the application
 * to ensure compatibility while fixing browser-based issues.
 */

interface CacheItem<T> {
  value: T;
  expires: number | null; // timestamp when item expires, null means no expiration
}

class BrowserCache {
  private cache: Map<string, CacheItem<unknown>> = new Map();
  private defaultTTL: number;
  private checkPeriod: number;
  private checkInterval: number | null = null;

  /**
   * Create a new browser cache
   * @param options Optional configuration options
   */
  constructor(options: { stdTTL?: number; checkperiod?: number } = {}) {
    this.defaultTTL = options.stdTTL || 0; // Default TTL in seconds (0 = no expiration)
    this.checkPeriod = options.checkperiod || 600; // Default check period is 10 minutes
    
    // Start automatic cleanup if checkperiod is set
    if (this.checkPeriod > 0) {
      this.checkInterval = window.setInterval(() => {
        this.checkExpiration();
      }, this.checkPeriod * 1000);
    }
  }

  /**
   * Set a value in the cache
   * @param key The cache key
   * @param value The value to store
   * @param ttl Optional TTL in seconds
   * @returns Success status
   */
  set<T>(key: string, value: T, ttl?: number): boolean {
    try {
      const expires = ttl ? Date.now() + (ttl * 1000) : 
                    this.defaultTTL ? Date.now() + (this.defaultTTL * 1000) : null;
      
      this.cache.set(key, {
        value,
        expires
      });
      
      return true;
    } catch (e) {
      console.error('Cache set error:', e);
      return false;
    }
  }

  /**
   * Get a value from the cache
   * @param key The cache key
   * @returns The cached value or undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    
    if (!item) {
      return undefined;
    }
    
    // Check if item is expired
    if (item.expires !== null && item.expires < Date.now()) {
      this.del(key);
      return undefined;
    }
    
    return item.value as T;
  }

  /**
   * Delete a value from the cache
   * @param key The cache key to delete
   * @returns Success status
   */
  del(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Check if a key exists in the cache and isn't expired
   * @param key The cache key
   * @returns True if the key exists and is not expired
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }
    
    // Check if item is expired
    if (item.expires !== null && item.expires < Date.now()) {
      this.del(key);
      return false;
    }
    
    return true;
  }

  /**
   * Clear all items from the cache
   */
  flushAll(): void {
    this.cache.clear();
  }

  /**
   * Get all cache keys
   * @returns Array of all cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get stats about the cache
   * @returns Object with cache statistics
   */
  getStats(): { keys: number; hits: number; misses: number; ksize: number; vsize: number } {
    return {
      keys: this.cache.size,
      hits: 0, // Not tracking this in the simple implementation
      misses: 0, // Not tracking this in the simple implementation
      ksize: 0, // Not tracking this in the simple implementation
      vsize: 0 // Not tracking this in the simple implementation
    };
  }

  /**
   * Check all keys for expiration
   */
  private checkExpiration(): void {
    const now = Date.now();
    this.cache.forEach((item, key) => {
      if (item.expires !== null && item.expires < now) {
        this.cache.delete(key);
      }
    });
  }

  /**
   * Clean up resources when the cache is no longer needed
   */
  close(): void {
    if (this.checkInterval !== null) {
      window.clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

export default BrowserCache; 