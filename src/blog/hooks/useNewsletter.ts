import { useState, useCallback } from 'react';
import { 
  NewsletterPreferences, 
  Subscriber, 
  NewsletterTemplate, 
  NewsletterCampaign 
} from '../../models/Newsletter';
import { newsletterService } from '../services/newsletterService';

interface UseNewsletterReturn {
  isLoading: boolean;
  error: Error | null;
  subscriber: Subscriber | null;
  subscribe: (email: string, name: string, preferences: NewsletterPreferences) => Promise<void>;
  unsubscribe: (email: string) => Promise<void>;
  updatePreferences: (preferences: Partial<NewsletterPreferences>) => Promise<void>;
  createTemplate: (template: Omit<NewsletterTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  createCampaign: (campaign: Omit<NewsletterCampaign, 'id' | 'metrics'>) => Promise<NewsletterCampaign>;
  scheduleCampaign: (campaignId: string, date: string) => Promise<void>;
  refreshAnalytics: () => Promise<void>;
  analytics: {
    total: number;
    active: number;
    unsubscribed: number;
    bounced: number;
    engagementRate: number;
  } | null;
}

export function useNewsletter(): UseNewsletterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [analytics, setAnalytics] = useState<UseNewsletterReturn['analytics']>(null);

  const subscribe = useCallback(async (
    email: string,
    name: string,
    preferences: NewsletterPreferences
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const newSubscriber = await newsletterService.subscribe(email, name, preferences);
      setSubscriber(newSubscriber);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to subscribe'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await newsletterService.unsubscribe(email);
      setSubscriber(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to unsubscribe'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePreferences = useCallback(async (
    preferences: Partial<NewsletterPreferences>
  ) => {
    if (!subscriber) {
      throw new Error('No active subscription');
    }

    try {
      setIsLoading(true);
      setError(null);
      const updatedSubscriber = await newsletterService.updatePreferences(
        subscriber.id,
        preferences
      );
      setSubscriber(updatedSubscriber);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update preferences'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [subscriber]);

  const createTemplate = useCallback(async (
    template: Omit<NewsletterTemplate, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      await newsletterService.createTemplate(template);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create template'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCampaign = useCallback(async (
    campaign: Omit<NewsletterCampaign, 'id' | 'metrics'>
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const createdCampaign = await newsletterService.createCampaign(campaign);
      return createdCampaign;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create campaign'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const scheduleCampaign = useCallback(async (
    campaignId: string,
    date: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      await newsletterService.scheduleCampaign(campaignId, date);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to schedule campaign'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshAnalytics = useCallback(async () => {
    try {
      const stats = await newsletterService.getSubscriberAnalytics();
      setAnalytics(stats);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  }, []);

  return {
    isLoading,
    error,
    subscriber,
    subscribe,
    unsubscribe,
    updatePreferences,
    createTemplate,
    createCampaign,
    scheduleCampaign,
    refreshAnalytics,
    analytics
  };
} 