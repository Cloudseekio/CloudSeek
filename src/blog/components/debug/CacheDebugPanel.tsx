import React, { useState } from 'react';
import { Trash2, RefreshCw, Search } from 'lucide-react';
import { useCacheMonitor } from '../../hooks/useCacheMonitor';
import { formatBytes, formatDate } from '../../../utils/formatters';

interface CacheDebugPanelProps {
  refreshInterval?: number;
}

export function CacheDebugPanel({ refreshInterval = 5000 }: CacheDebugPanelProps) {
  const {
    stats,
    debugInfo,
    clearCache,
    invalidatePattern,
    refreshStats,
    isStatsStale
  } = useCacheMonitor(refreshInterval);

  const [pattern, setPattern] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleInvalidate = () => {
    if (pattern) {
      const count = invalidatePattern(pattern);
      alert(`Invalidated ${count} cache items`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Cache Monitor</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshStats}
            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
            title="Refresh stats"
          >
            <RefreshCw className={`w-5 h-5 ${isStatsStale ? 'text-red-500' : ''}`} />
          </button>
          <button
            onClick={clearCache}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
            title="Clear cache"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Cache Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Size</div>
          <div className="text-lg font-semibold">{formatBytes(stats.size)}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Items</div>
          <div className="text-lg font-semibold">{stats.itemCount}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Hit Rate</div>
          <div className="text-lg font-semibold">
            {(stats.hitRate * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Hits/Misses</div>
          <div className="text-lg font-semibold">
            {stats.hits}/{stats.misses}
          </div>
        </div>
      </div>

      {/* Cache Invalidation */}
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern to invalidate"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleInvalidate}
          disabled={!pattern}
          className={`p-2 rounded-md ${
            pattern
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Cache Details */}
      <div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>

        {showDetails && (
          <div className="mt-4 space-y-4">
            <div className="text-sm text-gray-500">
              Oldest Item: {formatDate(stats.oldestItem)}
              <br />
              Newest Item: {formatDate(stats.newestItem)}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Key</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-right">Size</th>
                    <th className="px-4 py-2 text-right">Age</th>
                    <th className="px-4 py-2 text-right">Hits</th>
                    <th className="px-4 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {debugInfo.items.map((item) => (
                    <tr
                      key={item.key}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-2 font-mono text-xs">{item.key}</td>
                      <td className="px-4 py-2">{item.type}</td>
                      <td className="px-4 py-2 text-right">{formatBytes(item.size)}</td>
                      <td className="px-4 py-2 text-right">
                        {Math.round(item.age / 1000)}s
                      </td>
                      <td className="px-4 py-2 text-right">{item.hits}</td>
                      <td className="px-4 py-2 text-center">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            item.isExpired
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
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
        )}
      </div>
    </div>
  );
} 