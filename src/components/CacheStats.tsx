import React, { useEffect, useState } from 'react';
import { CacheService } from '../services/CacheService';

interface CacheStatsProps {
  cacheService: CacheService;
  refreshInterval?: number;
}

export const CacheStats: React.FC<CacheStatsProps> = ({ 
  cacheService, 
  refreshInterval = 5000 // Default to 5 seconds
}) => {
  const [stats, setStats] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Initial stats
    setStats(cacheService.getFormattedStats());
    
    // Set up interval to refresh stats
    const interval = setInterval(() => {
      setStats(cacheService.getFormattedStats());
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [cacheService, refreshInterval]);
  
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Cache Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Size</p>
          <p className="text-lg font-medium">{stats.size}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Items</p>
          <p className="text-lg font-medium">{stats.itemCount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Hit Rate</p>
          <p className="text-lg font-medium">{stats.hitRate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Hits/Misses</p>
          <p className="text-lg font-medium">{stats.hits}/{stats.misses}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-gray-600">Oldest Item</p>
          <p className="text-lg font-medium">{stats.oldestItem}</p>
        </div>
      </div>
      <button
        onClick={() => {
          cacheService.clear();
          setStats(cacheService.getFormattedStats());
        }}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Clear Cache
      </button>
    </div>
  );
}; 