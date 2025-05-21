import { Author, BlogPost } from './Blog';

export type SubscriptionStatus = 'active' | 'pending' | 'unsubscribed' | 'bounced';
export type NotificationChannel = 'email' | 'browser' | 'in-app';
export type NewsletterFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';
export type SubscriberSegment = 'all' | 'new' | 'engaged' | 'inactive' | 'custom';

export interface NewsletterPreferences {
  frequency: NewsletterFrequency;
  channels: NotificationChannel[];
  topics: string[];
  customFrequency?: {
    days: number[];
    time: string;
  };
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: SubscriptionStatus;
  preferences: NewsletterPreferences;
  metadata: {
    signupDate: string;
    lastEngagement?: string;
    source?: string;
    utm?: {
      source?: string;
      medium?: string;
      campaign?: string;
    };
  };
  segments: string[];
  engagementScore: number;
}

export interface NewsletterTemplate {
  id: string;
  name: string;
  description?: string;
  subject: string;
  content: string;
  variables: string[];
  previewText?: string;
  createdAt: string;
  updatedAt: string;
  author: Author;
  type: 'welcome' | 'regular' | 'digest' | 'reengagement';
}

export interface NewsletterCampaign {
  id: string;
  name: string;
  template: NewsletterTemplate;
  segment: SubscriberSegment;
  customSegment?: {
    filters: Record<string, unknown>;
  };
  schedule: {
    sendDate: string;
    timezone: string;
  };
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  metrics: NewsletterMetrics;
  posts?: BlogPost[];
}

export interface NewsletterMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribeRate: number;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description?: string;
  trigger: {
    type: 'signup' | 'engagement' | 'inactivity' | 'custom';
    conditions?: Record<string, unknown>;
  };
  steps: AutomationStep[];
  status: 'active' | 'paused' | 'draft';
  metrics: {
    started: number;
    completed: number;
    converted: number;
    conversionRate: number;
  };
}

export interface AutomationStep {
  id: string;
  type: 'email' | 'notification' | 'delay' | 'condition' | 'action';
  config: {
    template?: NewsletterTemplate;
    delay?: {
      duration: number;
      unit: 'minutes' | 'hours' | 'days';
    };
    condition?: {
      field: string;
      operator: string;
      value: unknown;
    };
    action?: {
      type: string;
      params: Record<string, unknown>;
    };
  };
  metrics: {
    reached: number;
    completed: number;
    failed: number;
  };
} 