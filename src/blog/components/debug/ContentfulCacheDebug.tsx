import React, { useState, useEffect } from 'react';
import { getContentfulService } from '../../services/serviceFactory';
import logger from '../../../utils/logger';

interface CacheStats {
  totalItems: number;
  totalSize: number;
  oldestItem: number;
  newestItem: number;
  hitCount: number;
  missCount: number;
  invalidationCount: number;
}

interface CacheDebugInfo {
  key: string;
  size: number;
  timestamp: number;
  ttl: number;
  isExpired: boolean;
  type: string;
}

const ContentfulCacheDebug: React.FC = () => {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [debugInfo, setDebugInfo] = useState<CacheDebugInfo[]>([]);
  const [invalidationPattern, setInvalidationPattern] = useState('');
  const [lastOperation, setLastOperation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const refreshStats = async () => {
    try {
      setIsLoading(true);
      const service = getContentfulService();
      const newStats = service.getCacheStats();
      const newDebugInfo = service.getCacheDebugInfo();
      setStats(newStats);
      setDebugInfo(newDebugInfo);
      setLastOperation('Stats refreshed');
    } catch (error) {
      logger.error('Failed to refresh cache stats:', error);
      setLastOperation('Error refreshing stats');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const handleInvalidateCache = async () => {
    try {
      setIsLoading(true);
      const service = getContentfulService();
      let pattern: RegExp | undefined;
      
      if (invalidationPattern) {
        try {
          pattern = new RegExp(invalidationPattern);
        } catch (error) {
          logger.error('Invalid regex pattern:', error);
          setLastOperation('Invalid regex pattern');
          return;
        }
      }

      const count = service.invalidateCache(pattern);
      setLastOperation(`Invalidated ${count} cache entries`);
      await refreshStats();
    } catch (error) {
      logger.error('Failed to invalidate cache:', error);
      setLastOperation('Error invalidating cache');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanCache = async () => {
    try {
      setIsLoading(true);
      const service = getContentfulService();
      const count = service.cleanCache();
      setLastOperation(`Cleaned ${count} expired cache entries`);
      await refreshStats();
    } catch (error) {
      logger.error('Failed to clean cache:', error);
      setLastOperation('Error cleaning cache');
    } finally {
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Contentful Cache Debug
      </h2>

      {/* Cache Stats */}
      {stats && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Items</h3>
            <p className="mt-2 text-3xl font-semibold text-blue-700 dark:text-blue-300">
              {stats.totalItems}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="text-sm font-medium text-green-600 dark:text-green-400">Cache Size</h3>
            <p className="mt-2 text-3xl font-semibold text-green-700 dark:text-green-300">
              {formatBytes(stats.totalSize)}
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400">Hit Rate</h3>
            <p className="mt-2 text-3xl font-semibold text-purple-700 dark:text-purple-300">
              {stats.hitCount + stats.missCount > 0
                ? Math.round((stats.hitCount / (stats.hitCount + stats.missCount)) * 100)
                : 0}%
            </p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <h3 className="text-sm font-medium text-orange-600 dark:text-orange-400">Invalidations</h3>
            <p className="mt-2 text-3xl font-semibold text-orange-700 dark:text-orange-300">
              {stats.invalidationCount}
            </p>
          </div>
        </div>
      )}

      {/* Cache Operations */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={invalidationPattern}
            onChange={(e) => setInvalidationPattern(e.target.value)}
            placeholder="Invalidation pattern (regex)"
            className="flex-1 px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            onClick={handleInvalidateCache}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            Invalidate Cache
          </button>
          <button
            onClick={handleCleanCache}
            disabled={isLoading}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
          >
            Clean Expired
          </button>
          <button
            onClick={refreshStats}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Refresh Stats
          </button>
        </div>
        {lastOperation && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last operation: {lastOperation}
          </p>
        )}
      </div>

      {/* Cache Entries */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Key
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {debugInfo.map((item) => (
              <tr key={item.key}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.key}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {item.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatBytes(item.size)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(item.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.isExpired
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}
                  >
                    {item.isExpired ? 'Expired' : 'Valid'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentfulCacheDebug; 