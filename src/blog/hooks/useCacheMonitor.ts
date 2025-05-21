import { useState, useEffect, useCallback } from 'react';
import { CacheService, CacheStats, CacheDebugInfo } from '../services/cacheService';
import logger from '../../utils/logger';

interface UseCacheMonitorReturn {
  stats: CacheStats;
  debugInfo: CacheDebugInfo;
  clearCache: () => void;
  invalidatePattern: (pattern: string) => number;
  refreshStats: () => void;
  isStatsStale: boolean;
}

export function useCacheMonitor(refreshInterval = 5000): UseCacheMonitorReturn {
  const [stats, setStats] = useState<CacheStats>({
    size: 0,
    itemCount: 0,
    hits: 0,
    misses: 0,
    hitRate: 0,
    oldestItem: 0,
    newestItem: 0
  });
  
  const [debugInfo, setDebugInfo] = useState<CacheDebugInfo>({
    ...stats,
    items: []
  });
  
  const [isStatsStale, setIsStatsStale] = useState(false);
  const cacheService = CacheService.getInstance();

  const refreshStats = useCallback(() => {
    try {
      const newStats = cacheService.getStats();
      const newDebugInfo = cacheService.getDebugInfo();
      
      setStats(newStats);
      setDebugInfo(newDebugInfo);
      setIsStatsStale(false);

      logger.debug('Cache stats refreshed:', {
        itemCount: newStats.itemCount,
        hitRate: newStats.hitRate.toFixed(2),
        size: (newStats.size / 1024 / 1024).toFixed(2) + 'MB'
      });
    } catch (error) {
      logger.error('Failed to refresh cache stats:', error);
      setIsStatsStale(true);
    }
  }, []);

  const clearCache = useCallback(() => {
    try {
      cacheService.clear();
      refreshStats();
      logger.info('Cache cleared successfully');
    } catch (error) {
      logger.error('Failed to clear cache:', error);
    }
  }, [refreshStats]);

  const invalidatePattern = useCallback((pattern: string): number => {
    try {
      const regex = new RegExp(pattern);
      const count = cacheService.invalidate(regex);
      refreshStats();
      return count;
    } catch (error) {
      logger.error('Failed to invalidate cache pattern:', error);
      return 0;
    }
  }, [refreshStats]);

  useEffect(() => {
    refreshStats();
    
    const intervalId = setInterval(() => {
      refreshStats();
    }, refreshInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [refreshInterval, refreshStats]);

  return {
    stats,
    debugInfo,
    clearCache,
    invalidatePattern,
    refreshStats,
    isStatsStale
  };
} 