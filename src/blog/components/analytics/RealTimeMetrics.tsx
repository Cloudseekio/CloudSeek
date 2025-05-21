import React, { useState, useEffect } from 'react';
import { Activity, Users, Clock, Zap } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface RealTimeMetrics {
  activeUsers: number;
  pageViews: number;
  avgLoadTime: number;
  bounceRate: number;
  currentlyReading: {
    postId: string;
    title: string;
    readers: number;
  }[];
  recentEvents: {
    id: string;
    type: string;
    timestamp: string;
    data: Record<string, unknown>;
  }[];
}

interface RealTimeMetricsProps {
  className?: string;
}

const RealTimeMetrics: React.FC<RealTimeMetricsProps> = ({ className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [metrics, setMetrics] = useState<RealTimeMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialMetrics = async () => {
      try {
        // In production, replace with actual API call
        const mockMetrics: RealTimeMetrics = {
          activeUsers: Math.floor(Math.random() * 100) + 50,
          pageViews: Math.floor(Math.random() * 500) + 200,
          avgLoadTime: Math.random() * 2 + 0.5,
          bounceRate: Math.random() * 30 + 20,
          currentlyReading: Array.from({ length: 5 }, (_, i) => ({
            postId: `post-${i + 1}`,
            title: `Sample Blog Post ${i + 1}`,
            readers: Math.floor(Math.random() * 20) + 1
          })),
          recentEvents: Array.from({ length: 10 }, (_, i) => ({
            id: `event-${i}`,
            type: ['page_view', 'conversion', 'engagement'][Math.floor(Math.random() * 3)],
            timestamp: new Date(Date.now() - i * 60000).toISOString(),
            data: {
              path: '/blog/post-1',
              duration: Math.floor(Math.random() * 300)
            }
          }))
        };

        setMetrics(mockMetrics);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch real-time metrics:', error);
      }
    };

    fetchInitialMetrics();

    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => {
        if (!prev) return prev;

        return {
          ...prev,
          activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
          pageViews: prev.pageViews + Math.floor(Math.random() * 10),
          avgLoadTime: Math.max(0.5, prev.avgLoadTime + (Math.random() * 0.4 - 0.2)),
          bounceRate: Math.max(0, Math.min(100, prev.bounceRate + (Math.random() * 2 - 1))),
          currentlyReading: prev.currentlyReading.map(post => ({
            ...post,
            readers: Math.max(0, post.readers + Math.floor(Math.random() * 3) - 1)
          })),
          recentEvents: [
            {
              id: `event-${Date.now()}`,
              type: ['page_view', 'conversion', 'engagement'][Math.floor(Math.random() * 3)],
              timestamp: new Date().toISOString(),
              data: {
                path: '/blog/post-1',
                duration: Math.floor(Math.random() * 300)
              }
            },
            ...prev.recentEvents.slice(0, 9)
          ]
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading || !metrics) {
    return (
      <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Real-Time Analytics
        </h2>
        <div className={`flex items-center ${isDark ? 'text-green-400' : 'text-green-500'}`}>
          <Activity className="w-4 h-4 mr-2" />
          <span className="text-sm">Live</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Users"
          value={metrics.activeUsers.toString()}
          icon={<Users className="w-5 h-5" />}
          isDark={isDark}
        />
        <MetricCard
          title="Page Views"
          value={metrics.pageViews.toString()}
          icon={<Activity className="w-5 h-5" />}
          isDark={isDark}
        />
        <MetricCard
          title="Avg. Load Time"
          value={`${metrics.avgLoadTime.toFixed(2)}s`}
          icon={<Clock className="w-5 h-5" />}
          isDark={isDark}
        />
        <MetricCard
          title="Bounce Rate"
          value={`${metrics.bounceRate.toFixed(1)}%`}
          icon={<Zap className="w-5 h-5" />}
          isDark={isDark}
        />
      </div>

      {/* Currently Reading */}
      <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Currently Reading
        </h3>
        <div className="space-y-4">
          {metrics.currentlyReading.map(post => (
            <div
              key={post.postId}
              className={`flex items-center justify-between ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <span className="truncate flex-1">{post.title}</span>
              <span className="ml-4 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {post.readers}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Events */}
      <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Recent Events
        </h3>
        <div className="space-y-3">
          {metrics.recentEvents.map(event => (
            <div
              key={event.id}
              className={`flex items-center justify-between text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <div className="flex items-center">
                <span className={`capitalize ${getEventTypeColor(event.type, isDark)}`}>
                  {event.type.replace('_', ' ')}
                </span>
                <span className="mx-2">•</span>
                <span className="text-xs">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <span>{formatEventData(event.data)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  isDark: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, isDark }) => (
  <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}>
    <div className="flex items-center justify-between mb-2">
      <h3 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {title}
      </h3>
      <div className={isDark ? 'text-blue-400' : 'text-blue-500'}>{icon}</div>
    </div>
    <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {value}
    </p>
  </div>
);

const getEventTypeColor = (type: string, isDark: boolean): string => {
  switch (type) {
    case 'page_view':
      return isDark ? 'text-blue-400' : 'text-blue-600';
    case 'conversion':
      return isDark ? 'text-green-400' : 'text-green-600';
    case 'engagement':
      return isDark ? 'text-purple-400' : 'text-purple-600';
    default:
      return isDark ? 'text-gray-400' : 'text-gray-600';
  }
};

const formatEventData = (data: Record<string, unknown>): string => {
  if ('path' in data) {
    return data.path as string;
  }
  return JSON.stringify(data);
};

export default RealTimeMetrics; 