import { useCallback, useEffect, useRef } from 'react';

// Cache entry structure
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: string;
  expiresAt: number;
  metadata?: Record<string, unknown>;
}

// Cache configuration options
export interface CacheOptions {
  // Storage strategy
  storage: 'memory' | 'localStorage' | 'indexedDB';
  // Cache name/prefix
  namespace?: string;
  // Time-to-live in milliseconds
  ttl?: number;
  // Maximum cache size (in items)
  maxItems?: number;
  // Version for cache invalidation
  version?: string;
  // Compression (for large data)
  compression?: boolean;
  // Encryption key (optional)
  encryptionKey?: string;
  // Offline support options
  offline?: {
    enabled: boolean;
    syncInterval?: number;
    priorityItems?: string[];
  };
  // Invalidation strategy
  invalidation?: {
    strategy: 'time' | 'version' | 'manual' | 'lru';
    maxAge?: number;
    dependencies?: string[];
  };
  // Event callbacks
  onError?: (error: Error) => void;
  onCacheHit?: (key: string) => void;
  onCacheMiss?: (key: string) => void;
}

// Default cache options
const defaultOptions: CacheOptions = {
  storage: 'memory',
  namespace: 'app-cache',
  ttl: 30 * 60 * 1000, // 30 minutes
  maxItems: 1000,
  version: '1.0',
  compression: false,
  offline: {
    enabled: false,
    syncInterval: 5 * 60 * 1000, // 5 minutes
  },
  invalidation: {
    strategy: 'time',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// Memory storage implementation
class MemoryStorage {
  private cache = new Map<string, CacheEntry<unknown>>();
  private lruOrder: string[] = [];

  set<T>(key: string, entry: CacheEntry<T>): void {
    this.cache.set(key, entry);
    this.updateLRU(key);
  }

  get<T>(key: string): CacheEntry<T> | undefined {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (entry) {
      this.updateLRU(key);
    }
    return entry;
  }

  delete(key: string): void {
    this.cache.delete(key);
    this.lruOrder = this.lruOrder.filter(k => k !== key);
  }

  clear(): void {
    this.cache.clear();
    this.lruOrder = [];
  }

  private updateLRU(key: string): void {
    this.lruOrder = [key, ...this.lruOrder.filter(k => k !== key)];
  }

  getLRU(): string | undefined {
    return this.lruOrder[this.lruOrder.length - 1];
  }

  size(): number {
    return this.cache.size;
  }
}

// LocalStorage implementation
class LocalStorageCache {
  private prefix: string;

  constructor(namespace: string) {
    this.prefix = `${namespace}:`;
  }

  set<T>(key: string, entry: CacheEntry<T>): void {
    try {
      localStorage.setItem(
        this.prefix + key,
        JSON.stringify(entry)
      );
    } catch (error) {
      // Handle quota exceeded
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        this.evictOldest();
        // Retry setting the item
        localStorage.setItem(
          this.prefix + key,
          JSON.stringify(entry)
        );
      } else {
        throw error;
      }
    }
  }

  get<T>(key: string): CacheEntry<T> | undefined {
    const item = localStorage.getItem(this.prefix + key);
    return item ? JSON.parse(item) : undefined;
  }

  delete(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }

  private evictOldest(): void {
    const keys = Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix));
    
    if (keys.length > 0) {
      const oldestKey = keys.reduce((oldest, key) => {
        const entry = JSON.parse(localStorage.getItem(key) || '{}');
        const oldestEntry = JSON.parse(localStorage.getItem(oldest) || '{}');
        return entry.timestamp < oldestEntry.timestamp ? key : oldest;
      });
      localStorage.removeItem(oldestKey);
    }
  }

  size(): number {
    return Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .length;
  }
}

// IndexedDB implementation
class IndexedDBCache {
  private dbName: string;
  private storeName: string;
  private db: IDBDatabase | null = null;

  constructor(namespace: string) {
    this.dbName = namespace;
    this.storeName = 'cache-store';
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore(this.storeName);
      };
    });
  }

  async set<T>(key: string, entry: CacheEntry<T>): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(entry, key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async get<T>(key: string): Promise<CacheEntry<T> | undefined> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async delete(key: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async size(): Promise<number> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.count();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
}

// Cache manager class
export class CacheManager {
  private options: CacheOptions;
  private storage: MemoryStorage | LocalStorageCache | IndexedDBCache;
  public syncInterval?: NodeJS.Timeout;
  private offlineQueue: Array<{ key: string; data: unknown }> = [];

  constructor(options: Partial<CacheOptions> = {}) {
    this.options = { ...defaultOptions, ...options };
    
    switch (this.options.storage) {
      case 'localStorage':
        this.storage = new LocalStorageCache(this.options.namespace!);
        break;
      case 'indexedDB':
        this.storage = new IndexedDBCache(this.options.namespace!);
        break;
      default:
        this.storage = new MemoryStorage();
    }

    if (this.options.offline?.enabled) {
      this.setupOfflineSync();
    }
  }

  async set<T>(key: string, data: T, metadata?: Record<string, unknown>): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      version: this.options.version!,
      expiresAt: Date.now() + (this.options.ttl || 0),
      metadata,
    };

    // Handle max items limit
    if (this.options.maxItems) {
      const size = await this.getSize();
      if (size >= this.options.maxItems) {
        await this.evictItems();
      }
    }

    // Compress if enabled
    if (this.options.compression) {
      entry.data = await this.compress(data);
    }

    // Encrypt if key provided
    if (this.options.encryptionKey) {
      entry.data = await this.encrypt(data);
    }

    await this.storage.set(key, entry);

    // Handle offline queue
    if (!navigator.onLine && this.options.offline?.enabled) {
      this.offlineQueue.push({ key, data });
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    const entry = await this.storage.get<T>(key);
    
    if (!entry) {
      this.options.onCacheMiss?.(key);
      return undefined;
    }

    // Check invalidation
    if (this.isInvalid(entry)) {
      await this.storage.delete(key);
      return undefined;
    }

    // Decrypt if needed
    let data = entry.data;
    if (this.options.encryptionKey) {
      data = await this.decrypt(data);
    }

    // Decompress if needed
    if (this.options.compression) {
      data = await this.decompress(data);
    }

    this.options.onCacheHit?.(key);
    return data as T;
  }

  async delete(key: string): Promise<void> {
    await this.storage.delete(key);
  }

  async clear(): Promise<void> {
    await this.storage.clear();
  }

  private isInvalid(entry: CacheEntry<unknown>): boolean {
    const { invalidation } = this.options;
    
    if (!invalidation) return false;

    switch (invalidation.strategy) {
      case 'time':
        return Date.now() > entry.expiresAt;
      case 'version':
        return entry.version !== this.options.version;
      case 'lru':
        return false; // Handled by eviction
      default:
        return false;
    }
  }

  private async evictItems(): Promise<void> {
    if (this.storage instanceof MemoryStorage) {
      const lru = this.storage.getLRU();
      if (lru) await this.storage.delete(lru);
    } else {
      // For other storage types, remove oldest item
      const key = await this.getOldestKey();
      if (key) await this.storage.delete(key);
    }
  }

  private async getOldestKey(): Promise<string | undefined> {
    // Implementation depends on storage type
    // This is a simplified version
    return undefined;
  }

  private async getSize(): Promise<number> {
    if (this.storage instanceof MemoryStorage) {
      return this.storage.size();
    } else if (this.storage instanceof LocalStorageCache) {
      return this.storage.size();
    } else {
      return await (this.storage as IndexedDBCache).size();
    }
  }

  private setupOfflineSync(): void {
    // Set up offline detection
    window.addEventListener('online', this.syncOfflineQueue.bind(this));
    window.addEventListener('offline', () => {
      // Pause sync interval when offline
      if (this.syncInterval) {
        clearInterval(this.syncInterval);
      }
    });

    // Set up sync interval
    if (this.options.offline?.syncInterval) {
      this.syncInterval = setInterval(
        this.syncOfflineQueue.bind(this),
        this.options.offline.syncInterval
      );
    }
  }

  private async syncOfflineQueue(): Promise<void> {
    if (!navigator.onLine) return;

    // Process offline queue
    while (this.offlineQueue.length > 0) {
      const item = this.offlineQueue.shift();
      if (item) {
        try {
          await this.set(item.key, item.data);
        } catch (error) {
          this.options.onError?.(error as Error);
          // Put item back in queue
          this.offlineQueue.unshift(item);
          break;
        }
      }
    }
  }

  // Compression utilities
  private async compress<T>(data: T): Promise<T> {
    // Implement compression logic here
    // This is a placeholder
    return data;
  }

  private async decompress<T>(data: T): Promise<T> {
    // Implement decompression logic here
    // This is a placeholder
    return data;
  }

  // Encryption utilities
  private async encrypt<T>(data: T): Promise<T> {
    // Implement encryption logic here
    // This is a placeholder
    return data;
  }

  private async decrypt<T>(data: T): Promise<T> {
    // Implement decryption logic here
    // This is a placeholder
    return data;
  }
}

// React hook for using cache manager
export function useCache(options: Partial<CacheOptions> = {}) {
  const cacheRef = useRef<CacheManager | null>(null);

  // Initialize cache manager
  useEffect(() => {
    cacheRef.current = new CacheManager(options);
    return () => {
      // Cleanup
      if (cacheRef.current) {
        clearInterval(cacheRef.current.syncInterval);
      }
    };
  }, [options]);

  // Cache operations wrapped in callbacks
  const set = useCallback(async <T>(
    key: string,
    data: T,
    metadata?: Record<string, unknown>
  ) => {
    if (!cacheRef.current) return;
    await cacheRef.current.set(key, data, metadata);
  }, []);

  const get = useCallback(async <T>(
    key: string
  ): Promise<T | undefined> => {
    if (!cacheRef.current) return undefined;
    return await cacheRef.current.get<T>(key);
  }, []);

  const remove = useCallback(async (key: string) => {
    if (!cacheRef.current) return;
    await cacheRef.current.delete(key);
  }, []);

  const clear = useCallback(async () => {
    if (!cacheRef.current) return;
    await cacheRef.current.clear();
  }, []);

  return {
    set,
    get,
    remove,
    clear,
  };
} 