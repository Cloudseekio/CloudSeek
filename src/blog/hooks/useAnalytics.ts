import { useEffect, useCallback } from 'react';
import { blogAnalytics } from '../utils/blogAnalytics';
import { BlogPost } from '../../models/Blog';
import { getAnalytics } from '../utils/blogAnalytics';
import { useState } from 'react';

interface UseAnalyticsOptions {
  postId?: string;
  userId?: string;
  trackPerformance?: boolean;
}

interface AnalyticsActions {
  trackEvent: (eventType: string, data: Record<string, unknown>) => void;
  trackConversion: (type: string, data: Record<string, unknown>) => void;
  initABTest: (variants: Array<{
    id: string;
    postId: string;
    type: 'title' | 'image' | 'content' | 'cta';
    content: string;
    performance: {
      views: number;
      conversions: number;
      conversionRate: number;
    };
  }>) => {
    id: string;
    postId: string;
    type: 'title' | 'image' | 'content' | 'cta';
    content: string;
    performance: {
      views: number;
      conversions: number;
      conversionRate: number;
    };
  };
}

interface AnalyticsMetrics {
  timeLabels: string[];
  pageViews: number[];
  uniqueVisitors: number[];
  totalViews: number;
  totalUniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
}

export function useAnalytics({ 
  postId, 
  userId, 
  trackPerformance = true 
}: UseAnalyticsOptions = {}): AnalyticsActions {
  useEffect(() => {
    if (postId) {
      blogAnalytics.init(postId, userId);
      
      if (trackPerformance) {
        // Track initial performance metrics
        blogAnalytics.trackPerformanceMetrics();
        
        // Set up performance observer for monitoring
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              blogAnalytics.trackEvent('performance_entry', {
                name: entry.name,
                duration: entry.duration,
                entryType: entry.entryType,
                startTime: entry.startTime
              });
            });
          });

          // Observe paint timing
          observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
        }
      }

      return () => {
        blogAnalytics.destroy();
      };
    }
  }, [postId, userId, trackPerformance]);

  const trackEvent = useCallback((eventType: string, data: Record<string, unknown>) => {
    blogAnalytics.trackEvent(eventType, data);
  }, []);

  const trackConversion = useCallback((type: string, data: Record<string, unknown>) => {
    blogAnalytics.trackConversion(type, data);
  }, []);

  const initABTest = useCallback((variants: Array<{
    id: string;
    type: 'title' | 'image' | 'content' | 'cta';
    content: string;
  }>) => {
    if (!postId) {
      throw new Error('Post ID is required for A/B testing');
    }
    // Add required properties to each variant
    const completeVariants = variants.map(variant => ({
      ...variant,
      postId,
      performance: {
        views: 0,
        conversions: 0,
        conversionRate: 0
      }
    }));
    return blogAnalytics.initABTest(postId, completeVariants);
  }, [postId]);

  return {
    trackEvent,
    trackConversion,
    initABTest
  };
}

// Utility hook for tracking blog post views
export function usePostAnalytics(post: BlogPost | null, userId?: string) {
  const { trackEvent } = useAnalytics({
    postId: post?.id,
    userId,
    trackPerformance: true
  });

  useEffect(() => {
    if (post) {
      // Track post view
      trackEvent('post_view', {
        postId: post.id,
        title: post.title,
        category: post.category,
        tags: post.tags,
        authorIds: post.authors.map(author => author.id)
      });

      // Track post metadata
      trackEvent('post_metadata', {
        readTime: post.readTime,
        publishDate: post.publishDate,
        category: post.category,
        tags: post.tags,
        featured: post.featured
      });
    }
  }, [post, trackEvent]);

  return {
    trackEvent
  };
}

export function useAnalyticsMetrics(posts: BlogPost[], dateRange: 'day' | 'week' | 'month' | 'year') {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const analytics = await getAnalytics(posts, dateRange);
        
        // Process analytics data into metrics
        const timeLabels = analytics.map(data => data.timestamp);
        const pageViews = analytics.map(data => data.views);
        const uniqueVisitors = analytics.map(data => data.uniqueVisitors);
        
        const totalViews = pageViews.reduce((sum, views) => sum + views, 0);
        const totalUniqueVisitors = Math.max(...uniqueVisitors);
        const avgTimeOnPage = analytics.reduce((sum, data) => sum + data.avgTimeOnPage, 0) / analytics.length;
        const bounceRate = (analytics.reduce((sum, data) => sum + data.bounceRate, 0) / analytics.length) * 100;

        setMetrics({
          timeLabels,
          pageViews,
          uniqueVisitors,
          totalViews,
          totalUniqueVisitors,
          avgTimeOnPage,
          bounceRate
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch analytics'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [posts, dateRange]);

  return { metrics, isLoading, error };
} 