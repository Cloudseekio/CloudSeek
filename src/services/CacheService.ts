import { formatBytes, formatDate, formatNumber, formatPercent } from '../utils/formatters';

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  itemCount: number;
  oldestItem: number;
  hitRate: number;
}

export interface CacheOptions {
  maxAge?: number;        // Maximum age in milliseconds
  staleWhileRevalidate?: number;  // Time to serve stale content while revalidating
}

export interface CacheItem<T> {
  value: T;
  timestamp: number;
  lastAccessed: number;
  size: number;
  maxAge?: number;
}

export class CacheService {
  private cache: Map<string, CacheItem<unknown>> = new Map();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    itemCount: 0,
    oldestItem: 0,
    hitRate: 0
  };
  
  private maxSize: number = 50 * 1024 * 1024; // 50MB default max size
  private defaultMaxAge: number = 5 * 60 * 1000; // 5 minutes default TTL
  
  constructor(maxSize?: number) {
    if (maxSize) this.maxSize = maxSize;
    this.startMaintenanceInterval();
  }
  
  /**
   * Set a value in the cache
   */
  set<T>(key: string, value: T, options: CacheOptions = {}): void {
    const timestamp = Date.now();
    const size = this.calculateSize(value);
    
    const item: CacheItem<T> = {
      value,
      timestamp,
      lastAccessed: timestamp,
      size,
      maxAge: options.maxAge || this.defaultMaxAge
    };
    
    // Check if we need to make space
    if (this.stats.size + size > this.maxSize) {
      this.evictItems(size);
    }
    
    this.cache.set(key, item);
    this.stats.size += size;
    this.stats.itemCount = this.cache.size;
    
    if (!this.stats.oldestItem || timestamp < this.stats.oldestItem) {
      this.stats.oldestItem = timestamp;
    }
  }
  
  /**
   * Get a value from the cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }
    
    // Check if item is expired
    if (this.isExpired(item)) {
      this.delete(key);
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }
    
    item.lastAccessed = Date.now();
    this.stats.hits++;
    this.updateHitRate();
    return item.value as T;
  }
  
  /**
   * Delete an item from the cache
   */
  delete(key: string): void {
    const item = this.cache.get(key);
    if (item) {
      this.stats.size -= item.size;
      this.cache.delete(key);
      this.stats.itemCount = this.cache.size;
    }
  }
  
  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache.clear();
    this.resetStats();
  }
  
  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }
  
  /**
   * Get formatted cache statistics
   */
  getFormattedStats(): Record<string, string> {
    return {
      size: formatBytes(this.stats.size),
      itemCount: this.stats.itemCount.toString(),
      hits: formatNumber(this.stats.hits),
      misses: formatNumber(this.stats.misses),
      hitRate: formatPercent(this.stats.hitRate),
      oldestItem: formatDate(this.stats.oldestItem)
    };
  }
  
  private calculateSize(value: unknown): number {
    try {
      const str = JSON.stringify(value);
      return str.length * 2; // Approximate size in bytes (2 bytes per character)
    } catch {
      return 0;
    }
  }
  
  private isExpired(item: CacheItem<unknown>): boolean {
    const age = Date.now() - item.timestamp;
    return age > (item.maxAge || this.defaultMaxAge);
  }
  
  private evictItems(requiredSpace: number): void {
    // Sort items by last accessed time
    const items = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);
    
    let freedSpace = 0;
    
    for (const [key, item] of items) {
      this.delete(key);
      freedSpace += item.size;
      
      if (freedSpace >= requiredSpace) {
        break;
      }
    }
  }
  
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }
  
  private resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      itemCount: 0,
      oldestItem: 0,
      hitRate: 0
    };
  }
  
  private startMaintenanceInterval(): void {
    // Run maintenance every minute
    setInterval(() => {
      for (const [key, item] of this.cache.entries()) {
        if (this.isExpired(item)) {
          this.delete(key);
        }
      }
    }, 60 * 1000);
  }
} 