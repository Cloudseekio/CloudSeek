import { useState, useEffect, useCallback } from 'react';
import { useAnalytics } from './useAnalytics';
import { BlogPost } from '../../models/Blog';

export interface ABTest {
  id: string;
  name: string;
  description?: string;
  variants: ABTestVariant[];
  startDate: string;
  endDate?: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  targetAudience?: {
    deviceTypes?: string[];
    countries?: string[];
    userTypes?: string[];
  };
  winningVariantId?: string;
}

export interface ABTestVariant {
  id: string;
  name: string;
  type: 'title' | 'image' | 'content' | 'cta';
  content: string;
  traffic: number; // Percentage of traffic to receive (0-100)
  metrics: {
    views: number;
    conversions: number;
    conversionRate: number;
    avgTimeOnPage: number;
    bounceRate: number;
  };
}

interface UseABTestingOptions {
  postId: string;
  userId?: string;
  testId?: string;
}

interface ABTestingResult {
  variant: ABTestVariant | null;
  isLoading: boolean;
  error: Error | null;
  trackConversion: (type: string) => void;
  trackEngagement: (type: string, data?: Record<string, unknown>) => void;
}

export function useABTesting({ 
  postId, 
  userId, 
  testId 
}: UseABTestingOptions): ABTestingResult {
  const [variant, setVariant] = useState<ABTestVariant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { trackEvent } = useAnalytics({ postId, userId });

  // Fetch and assign variant
  useEffect(() => {
    const fetchVariant = async () => {
      try {
        setIsLoading(true);
        // In production, replace with actual API call
        const mockVariant: ABTestVariant = {
          id: 'v1',
          name: 'Variant A',
          type: 'title',
          content: 'Test Content',
          traffic: 50,
          metrics: {
            views: 0,
            conversions: 0,
            conversionRate: 0,
            avgTimeOnPage: 0,
            bounceRate: 0
          }
        };

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setVariant(mockVariant);
        trackEvent('ab_test_assignment', {
          testId,
          variantId: mockVariant.id,
          type: mockVariant.type
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch variant'));
      } finally {
        setIsLoading(false);
      }
    };

    if (postId && testId) {
      fetchVariant();
    }
  }, [postId, testId, trackEvent]);

  // Track conversion
  const trackConversion = useCallback((type: string) => {
    if (!variant) return;

    trackEvent('ab_test_conversion', {
      testId,
      variantId: variant.id,
      type,
      timestamp: new Date().toISOString()
    });
  }, [variant, testId, trackEvent]);

  // Track engagement
  const trackEngagement = useCallback((type: string, data: Record<string, unknown> = {}) => {
    if (!variant) return;

    trackEvent('ab_test_engagement', {
      testId,
      variantId: variant.id,
      type,
      ...data,
      timestamp: new Date().toISOString()
    });
  }, [variant, testId, trackEvent]);

  return {
    variant,
    isLoading,
    error,
    trackConversion,
    trackEngagement
  };
}

// Utility hook for testing post variations
export function usePostVariation(post: BlogPost, testId: string) {
  const { variant, isLoading } = useABTesting({
    postId: post.id,
    testId
  });

  // Apply variant changes to post
  const modifiedPost = { ...post };
  if (!isLoading && variant) {
    switch (variant.type) {
      case 'title':
        modifiedPost.title = variant.content;
        break;
      case 'image':
        if (modifiedPost.coverImage) {
          modifiedPost.coverImage = {
            ...modifiedPost.coverImage,
            url: variant.content
          };
        }
        break;
      case 'content':
        // Only modify specific content sections based on variant
        // Implementation depends on content structure
        break;
      case 'cta':
        // Modify CTA in custom fields or specific content section
        if (modifiedPost.customFields) {
          modifiedPost.customFields.cta = variant.content;
        }
        break;
    }
  }

  return {
    post: modifiedPost,
    isLoading,
    variant
  };
} 