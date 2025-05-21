import { Cache, createCache } from '../../utils/cacheUtils';

describe('Cache Utility', () => {
  // Helper to advance time in tests
  const advanceTime = (ms: number) => {
    jest.advanceTimersByTime(ms);
  };

  beforeEach(() => {
    // Use fake timers for testing TTL
    jest.useFakeTimers();
    // Set initial time to a known value
    jest.setSystemTime(new Date('2023-01-01T00:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic operations', () => {
    it('should store and retrieve items', () => {
      const cache = new Cache<string>();
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('should check if items exist', () => {
      const cache = new Cache<string>();
      cache.set('key1', 'value1');
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('key2')).toBe(false);
    });

    it('should delete items', () => {
      const cache = new Cache<string>();
      cache.set('key1', 'value1');
      expect(cache.has('key1')).toBe(true);
      
      cache.delete('key1');
      expect(cache.has('key1')).toBe(false);
      expect(cache.get('key1')).toBeUndefined();
    });

    it('should clear all items', () => {
      const cache = new Cache<string>();
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      cache.clear();
      expect(cache.has('key1')).toBe(false);
      expect(cache.has('key2')).toBe(false);
    });

    it('should provide cache keys', () => {
      const cache = new Cache<string>();
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      expect(cache.keys()).toEqual(['key1', 'key2']);
    });

    it('should provide cache entries for debugging', () => {
      const cache = new Cache<string>();
      cache.set('key1', 'value1');
      
      const entries = cache.entries();
      expect(entries.length).toBe(1);
      expect(entries[0][0]).toBe('key1');
      expect(entries[0][1].value).toBe('value1');
    });
  });

  describe('TTL behavior', () => {
    it('should expire items based on TTL', () => {
      const cache = new Cache<string>({ ttl: 1000 }); // 1 second TTL
      cache.set('key1', 'value1');
      
      expect(cache.get('key1')).toBe('value1');
      
      // Advance time by 500ms (half the TTL)
      advanceTime(500);
      expect(cache.get('key1')).toBe('value1');
      
      // Advance time beyond TTL
      advanceTime(501);
      expect(cache.get('key1')).toBeUndefined();
      expect(cache.has('key1')).toBe(false);
    });

    it('should allow setting TTL per item', () => {
      const cache = new Cache<string>({ ttl: 5000 }); // Default 5 second TTL
      
      cache.set('key1', 'value1');                  // Uses default TTL
      cache.set('key2', 'value2', 1000);            // 1 second TTL
      cache.set('key3', 'value3', null);            // Never expires

      // After 1.5 seconds, key2 should expire
      advanceTime(1500);
      expect(cache.get('key1')).toBe('value1');
      expect(cache.get('key2')).toBeUndefined();
      expect(cache.get('key3')).toBe('value3');

      // After 5.5 seconds total, key1 should expire
      advanceTime(4000);
      expect(cache.get('key1')).toBeUndefined();
      expect(cache.get('key3')).toBe('value3');      // Never expires
    });
  });

  describe('LRU eviction', () => {
    it('should enforce maximum size by removing least recently used items', () => {
      const cache = new Cache<string>({ maxSize: 2 });
      
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      // Both keys should be in the cache
      expect(cache.get('key1')).toBe('value1');
      expect(cache.get('key2')).toBe('value2');
      
      // Adding a third key should evict the least recently used (key1)
      cache.set('key3', 'value3');
      expect(cache.has('key1')).toBe(false);
      expect(cache.has('key2')).toBe(true);
      expect(cache.has('key3')).toBe(true);
    });

    it('should update last accessed time when items are retrieved', () => {
      const cache = new Cache<string>({ maxSize: 2 });
      
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      // Access key1 to update its last accessed time
      cache.get('key1');
      
      // Adding a third key should now evict key2 instead of key1
      cache.set('key3', 'value3');
      expect(cache.has('key1')).toBe(true);
      expect(cache.has('key2')).toBe(false);
      expect(cache.has('key3')).toBe(true);
    });
  });

  describe('Cache statistics', () => {
    it('should track hits and misses', () => {
      const cache = new Cache<string>();
      
      // Add an item
      cache.set('key1', 'value1');
      
      // Hit
      cache.get('key1');
      
      // Miss
      cache.get('key2');
      
      const stats = cache.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
    });

    it('should track cache size', () => {
      const cache = new Cache<string>();
      
      expect(cache.getStats().size).toBe(0);
      
      cache.set('key1', 'value1');
      expect(cache.getStats().size).toBe(1);
      
      cache.set('key2', 'value2');
      expect(cache.getStats().size).toBe(2);
      
      cache.delete('key1');
      expect(cache.getStats().size).toBe(1);
      
      cache.clear();
      expect(cache.getStats().size).toBe(0);
    });

    it('should track last cleared time', () => {
      const cache = new Cache<string>();
      
      // Initially null
      expect(cache.getStats().lastCleared).toBeNull();
      
      // Clear and check time
      cache.clear();
      const firstClearTime = cache.getStats().lastCleared;
      expect(firstClearTime).not.toBeNull();
      
      // Advance time and clear again
      advanceTime(1000);
      cache.clear();
      
      // Should have a new time
      const secondClearTime = cache.getStats().lastCleared;
      expect(secondClearTime).not.toEqual(firstClearTime);
    });
  });

  describe('Factory function', () => {
    it('should create a cache instance with options', () => {
      const cache = createCache<number>({ ttl: 2000, maxSize: 10 });
      
      cache.set('key1', 1);
      expect(cache.get('key1')).toBe(1);
      
      // Advance beyond TTL
      advanceTime(2500);
      expect(cache.get('key1')).toBeUndefined();
    });
  });
}); 