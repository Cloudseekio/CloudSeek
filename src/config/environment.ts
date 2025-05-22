import logger from '../utils/logger';

/**
 * Environment variable configuration and validation
 */

// Environment types
export type Environment = 'development' | 'staging' | 'production';

// Required environment variables that must be present
const REQUIRED_VARS = {
  // Contentful
  CONTENTFUL_SPACE_ID: 'VITE_CONTENTFUL_SPACE_ID',
  CONTENTFUL_ACCESS_TOKEN: 'VITE_CONTENTFUL_ACCESS_TOKEN',
  CONTENTFUL_ENVIRONMENT: 'VITE_CONTENTFUL_ENVIRONMENT',
} as const;

// Optional environment variables with default values
const OPTIONAL_VARS = {
  // Application
  APP_ENV: 'VITE_APP_ENV',
  DEBUG: 'VITE_DEBUG',

  // Contentful
  CONTENTFUL_CACHE_TTL: 'VITE_CONTENTFUL_CACHE_TTL',
  CONTENTFUL_PREVIEW_MODE: 'VITE_CONTENTFUL_PREVIEW_MODE',
  CONTENTFUL_DEFAULT_LOCALE: 'VITE_CONTENTFUL_DEFAULT_LOCALE',
} as const;

// Default values for optional variables
const DEFAULT_VALUES = {
  APP_ENV: 'development' as Environment,
  DEBUG: false,
  CONTENTFUL_CACHE_TTL: 300, // 5 minutes
  CONTENTFUL_PREVIEW_MODE: false,
  CONTENTFUL_DEFAULT_LOCALE: 'en-US',
} as const;

// Environment variable validation error
class EnvVarError extends Error {
  constructor(message: string, public readonly variables: string[]) {
    super(message);
    this.name = 'EnvVarError';
  }
}

/**
 * Get environment variable with validation and logging
 */
function getEnvVar(key: string, required = false): string | undefined {
  const value = import.meta.env[key];
  
  if (required && !value) {
    logger.error(`Missing required environment variable: ${key}`);
    throw new EnvVarError(`Missing required environment variable: ${key}`, [key]);
  }
  
  if (value) {
    logger.debug(`Environment variable loaded: ${key}`, { hasValue: true });
  } else {
    logger.debug(`Environment variable not found: ${key}`, { hasValue: false });
  }
  
  return value;
}

/**
 * Convert string to boolean with validation
 */
function toBool(value: string | undefined): boolean {
  if (!value) return false;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Convert string to number with validation
 */
function toNumber(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const num = parseInt(value, 10);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Validate all required environment variables
 */
function validateEnvironment(): void {
  const missingVars: string[] = [];

    // Check required variables  Object.entries(REQUIRED_VARS).forEach(([, envVar]) => {    if (!import.meta.env[envVar]) {      missingVars.push(envVar);    }  });

  if (missingVars.length > 0) {
    logger.warn('Missing required environment variables', { missingVars });
    logger.warn('Using default/fallback values for missing variables');
    // Don't throw in production build
    return;
  }

  logger.info('Environment validation successful');
}

/**
 * Get environment configuration with validation
 */
export const environmentConfig = {
  // Application
  environment: getEnvVar(OPTIONAL_VARS.APP_ENV) as Environment || DEFAULT_VALUES.APP_ENV,
  debug: toBool(getEnvVar(OPTIONAL_VARS.DEBUG)) || DEFAULT_VALUES.DEBUG,

  // Contentful Configuration
  contentful: {
    spaceId: getEnvVar(REQUIRED_VARS.CONTENTFUL_SPACE_ID, false) || 'default_space_id',
    accessToken: getEnvVar(REQUIRED_VARS.CONTENTFUL_ACCESS_TOKEN, false) || 'default_access_token',
    environment: getEnvVar(REQUIRED_VARS.CONTENTFUL_ENVIRONMENT) || 'master',
    cacheTTL: toNumber(
      getEnvVar(OPTIONAL_VARS.CONTENTFUL_CACHE_TTL),
      DEFAULT_VALUES.CONTENTFUL_CACHE_TTL
    ),
    usePreview: toBool(getEnvVar(OPTIONAL_VARS.CONTENTFUL_PREVIEW_MODE)) || DEFAULT_VALUES.CONTENTFUL_PREVIEW_MODE,
    defaultLocale: getEnvVar(OPTIONAL_VARS.CONTENTFUL_DEFAULT_LOCALE) || DEFAULT_VALUES.CONTENTFUL_DEFAULT_LOCALE,
  }
} as const;

/**
 * Initialize environment configuration
 */
export function initializeEnvironment(): void {
  try {
    validateEnvironment();
    
    logger.debug('Environment configuration loaded:', {
      environment: environmentConfig.environment,
      debug: environmentConfig.debug,
      contentful: {
        spaceId: environmentConfig.contentful.spaceId,
        environment: environmentConfig.contentful.environment,
        hasAccessToken: !!environmentConfig.contentful.accessToken,
        cacheTTL: environmentConfig.contentful.cacheTTL,
        usePreview: environmentConfig.contentful.usePreview,
        defaultLocale: environmentConfig.contentful.defaultLocale
      }
    });
  } catch (error) {
    if (error instanceof EnvVarError) {
      logger.error('Environment configuration error:', error.message, {
        missingVariables: error.variables,
      });
    } else {
      logger.error('Unexpected error during environment initialization:', error);
    }
    throw error;
  }
}