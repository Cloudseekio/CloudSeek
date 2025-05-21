/**
 * Central configuration file for all external services
 * 
 * This file contains configurations for:
 * - Contentful CMS
 * - Pexels Image API
 * - Other external services
 * 
 * Environment variables are set in .env files and accessed via import.meta.env
 */

// Types for service configurations
export interface ContentfulConfig {
  spaceId: string;
  accessToken: string;
  environment: string;
  cacheTTL: number; // in seconds
  enablePreviewMode: boolean;
  defaultLocale: string;
}

export interface PexelsConfig {
  apiKey: string;
  cacheTTL: number; // in seconds
  defaultPerPage: number;
  categories: Record<string, string[]>;
  enabledForFallbackImages: boolean;
}

export interface ServicesConfig {
  contentful: ContentfulConfig;
  pexels: PexelsConfig;
  environment: 'development' | 'staging' | 'production';
  debug: boolean;
}

// Default image search categories for Pexels
const defaultImageCategories = {
  author: [
    'portrait professional', 
    'business headshot', 
    'professional profile',
    'creative professional',
    'studio portrait',
    'business person',
    'entrepreneur'
  ],
  blog: [
    'blog background', 
    'article header', 
    'minimal background',
    'concept illustration',
    'abstract background',
    'business concept',
    'digital marketing',
    'technology abstract',
    'creative workspace'
  ],
  category: [
    'concept graphic', 
    'symbolic representation', 
    'abstract category',
    'concept illustration',
    'topic symbol',
    'subject matter'
  ],
  technology: [
    'tech concept',
    'coding screen',
    'software development',
    'programming',
    'digital technology',
    'computer code',
    'technology innovation'
  ],
  business: [
    'business meeting',
    'corporate office',
    'business strategy',
    'team collaboration',
    'company culture',
    'workplace',
    'professional environment'
  ],
  marketing: [
    'digital marketing',
    'social media',
    'campaign strategy',
    'content creation',
    'marketing analytics',
    'brand building',
    'customer engagement'
  ]
};

// Helper function to get environment variables with fallbacks
const getEnvVar = (key: string, fallback: string = ''): string => {
  const value = import.meta.env[key];
  return value !== undefined ? String(value) : fallback;
};

// Helper function to get boolean environment variables
const getEnvBool = (key: string, fallback: boolean = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return fallback;
  return value === 'true' || value === '1';
};

// Helper function to get number environment variables
const getEnvNum = (key: string, fallback: number): number => {
  const value = import.meta.env[key];
  if (value === undefined) return fallback;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};

// Determine the current environment
const determineEnvironment = (): 'development' | 'staging' | 'production' => {
  const envMode = getEnvVar('VITE_APP_ENV', 'development');
  switch (envMode) {
    case 'production':
      return 'production';
    case 'staging':
      return 'staging';
    default:
      return 'development';
  }
};

// Create the configuration based on environment
const createConfig = (): ServicesConfig => {
  const environment = determineEnvironment();
  const debug = environment !== 'production';
  
  return {
    environment,
    debug,
    
    // Contentful configuration
    contentful: {
      spaceId: getEnvVar('VITE_CONTENTFUL_SPACE_ID', ''),
      accessToken: getEnvVar('VITE_CONTENTFUL_ACCESS_TOKEN', ''),
      environment: getEnvVar('VITE_CONTENTFUL_ENVIRONMENT', 'master'),
      cacheTTL: getEnvNum('VITE_CONTENTFUL_CACHE_TTL', 300), // Default: 5 minutes
      enablePreviewMode: getEnvBool('VITE_CONTENTFUL_PREVIEW_MODE', environment !== 'production'),
      defaultLocale: getEnvVar('VITE_CONTENTFUL_DEFAULT_LOCALE', 'en-US')
    },
    
    // Pexels configuration
    pexels: {
      apiKey: getEnvVar('VITE_PEXELS_API_KEY', ''),
      cacheTTL: getEnvNum('VITE_PEXELS_CACHE_TTL', 3600), // Default: 1 hour
      defaultPerPage: getEnvNum('VITE_PEXELS_DEFAULT_PER_PAGE', 15),
      categories: defaultImageCategories,
      enabledForFallbackImages: getEnvBool('VITE_PEXELS_ENABLE_FALLBACKS', true)
    }
  };
};

// Export the configuration
export const servicesConfig = createConfig();

// Export specialized config getters for specific use cases
export const getContentfulConfig = (): ContentfulConfig => servicesConfig.contentful;
export const getPexelsConfig = (): PexelsConfig => servicesConfig.pexels;

// Export the categories directly for convenience
export const imageCategories = servicesConfig.pexels.categories;

// Utility function to validate the configuration
export const validateConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check Contentful config
  if (!servicesConfig.contentful.spaceId) {
    errors.push('Missing Contentful Space ID');
  }
  
  if (!servicesConfig.contentful.accessToken) {
    errors.push('Missing Contentful Access Token');
  }
  
  // Check Pexels config
  if (!servicesConfig.pexels.apiKey) {
    errors.push('Missing Pexels API Key');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export default servicesConfig; 