import { BlogPost } from '../../models/Blog';

export interface AnalyticsEvent {
  eventType: string;
  timestamp: string;
  userId?: string;
  sessionId: string;
  data: Record<string, unknown>;
}

export interface ReadingProgress {
  postId: string;
  userId?: string;
  sessionId: string;
  progress: number; // 0-100
  readTime: number; // seconds
  milestones: string[]; // completed milestones
  scrollDepth: number; // max scroll depth
  completionStatus: 'started' | 'in-progress' | 'completed';
}

export interface ContentPerformance {
  postId: string;
  views: number;
  uniqueViews: number;
  avgReadTime: number;
  completionRate: number;
  bounceRate: number;
  conversionRate: number;
  engagementScore: number;
}

export interface ABTestVariant {
  id: string;
  postId: string;
  type: 'title' | 'image' | 'content' | 'cta';
  content: string;
  performance: {
    views: number;
    conversions: number;
    conversionRate: number;
  };
}

interface AnalyticsData {
  timestamp: string;
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
}

class BlogAnalytics {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  private readingProgress: Map<string, ReadingProgress> = new Map();
  private startTime: number = 0;
  private lastScrollDepth: number = 0;
  private initialized: boolean = false;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  init(postId: string, userId?: string) {
    if (this.initialized) return;
    
    this.startTime = Date.now();
    this.lastScrollDepth = 0;
    this.initialized = true;

    // Initialize reading progress
    this.readingProgress.set(postId, {
      postId,
      userId,
      sessionId: this.sessionId,
      progress: 0,
      readTime: 0,
      milestones: [],
      scrollDepth: 0,
      completionStatus: 'started'
    });

    // Track initial page view
    this.trackEvent('page_view', { postId });

    // Set up scroll tracking
    this.initScrollTracking();

    // Set up visibility tracking
    this.initVisibilityTracking();
  }

  private initScrollTracking() {
    let ticking = false;

    document.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.updateScrollDepth();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  private initVisibilityTracking() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('content_hidden', {
          timeSpent: this.getTimeSpent()
        });
      } else {
        this.trackEvent('content_visible', {
          timeSpent: this.getTimeSpent()
        });
      }
    });
  }

  private updateScrollDepth() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;
    const scrollPercentage = (scrollPosition / scrollHeight) * 100;

    if (scrollPercentage > this.lastScrollDepth) {
      this.lastScrollDepth = scrollPercentage;
      this.trackMilestone(scrollPercentage);
    }
  }

  private trackMilestone(scrollPercentage: number) {
    const milestones = [25, 50, 75, 100];
    const currentProgress = this.readingProgress.get(this.sessionId);

    if (!currentProgress) return;

    milestones.forEach(milestone => {
      if (
        scrollPercentage >= milestone &&
        !currentProgress.milestones.includes(`scroll_${milestone}`)
      ) {
        currentProgress.milestones.push(`scroll_${milestone}`);
        this.trackEvent('milestone_reached', {
          milestone: `scroll_${milestone}`,
          timeSpent: this.getTimeSpent()
        });
      }
    });

    // Update completion status
    if (scrollPercentage >= 90 && currentProgress.completionStatus !== 'completed') {
      currentProgress.completionStatus = 'completed';
      this.trackEvent('content_completed', {
        timeSpent: this.getTimeSpent(),
        scrollDepth: scrollPercentage
      });
    }
  }

  trackEvent(eventType: string, data: Record<string, unknown>) {
    const event: AnalyticsEvent = {
      eventType,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      data: {
        ...data,
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent
      }
    };

    this.events.push(event);
    this.sendToAnalytics(event);
  }

  private getTimeSpent(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  private async sendToAnalytics(event: AnalyticsEvent) {
    try {
      // In production, replace with actual analytics endpoint
      console.log('Analytics event:', event);
      
      // Example implementation:
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  // A/B Testing methods
  initABTest(postId: string, variants: ABTestVariant[]) {
    const variant = this.selectVariant(variants);
    this.trackEvent('ab_test_impression', {
      postId,
      variantId: variant.id,
      type: variant.type
    });
    return variant;
  }

  private selectVariant(variants: ABTestVariant[]): ABTestVariant {
    // Simple random selection - could be enhanced with more sophisticated algorithms
    return variants[Math.floor(Math.random() * variants.length)];
  }

  trackConversion(type: string, data: Record<string, unknown>) {
    this.trackEvent('conversion', {
      type,
      ...data,
      timeToConversion: this.getTimeSpent()
    });
  }

  // Performance monitoring
  trackPerformanceMetrics() {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const metrics = {
        loadTime: timing.loadEventEnd - timing.navigationStart,
        domReadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,
        firstPaintTime: timing.responseEnd - timing.navigationStart,
        // Add more metrics as needed
      };

      this.trackEvent('performance_metrics', metrics);
    }
  }

  // Cleanup
  destroy() {
    this.initialized = false;
    this.events = [];
    this.readingProgress.clear();
  }
}

export const blogAnalytics = new BlogAnalytics();
export default BlogAnalytics;

export async function getAnalytics(posts: BlogPost[], dateRange: 'day' | 'week' | 'month' | 'year'): Promise<AnalyticsData[]> {
  // Simulate fetching analytics data
  const now = new Date();
  const data: AnalyticsData[] = [];
  
  let points = 24; // hours
  let interval = 60 * 60 * 1000; // 1 hour in milliseconds
  
  switch (dateRange) {
    case 'week':
      points = 7; // days
      interval = 24 * 60 * 60 * 1000;
      break;
    case 'month':
      points = 30; // days
      interval = 24 * 60 * 60 * 1000;
      break;
    case 'year':
      points = 12; // months
      interval = 30 * 24 * 60 * 60 * 1000;
      break;
  }
  
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * interval));
    const views = Math.floor(Math.random() * 1000) + 100;
    const uniqueVisitors = Math.floor(views * 0.7);
    const avgTimeOnPage = Math.random() * 5 + 1;
    const bounceRate = Math.random() * 0.4 + 0.2;
    
    data.push({
      timestamp: timestamp.toISOString(),
      views,
      uniqueVisitors,
      avgTimeOnPage,
      bounceRate
    });
  }
  
  return data;
}

export function trackPageView(postId: string): void {
  // Simulate tracking a page view
  console.log(`Tracked page view for post ${postId}`);
} 