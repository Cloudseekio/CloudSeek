import ContentfulService from './contentfulService';
import { ImageService } from './imageService';
import { getContentfulConfig } from '../../config/services';
import logger from '../../utils/logger';
import { initializeValidator, DEFAULT_VALIDATOR_CONFIG } from '../utils/contentTypeValidator';
import { verifyContentfulConfig, ConfigVerificationError } from './configVerifier';
import { ContentfulBlogAdapter } from './adapters/ContentfulBlogAdapter';
import { BlogServiceInterface } from './interfaces/BlogServiceInterface';

/**
 * Service initialization status
 */
export interface ServiceStatus {
  initialized: boolean;
  error?: Error;
  services: {
    contentful: boolean;
    image: boolean;
  };
}

// Singleton instances
let contentfulServiceInstance: ContentfulService | null = null;
let blogServiceInstance: BlogServiceInterface | null = null;
let imageServiceInstance: ImageService | null = null;
let initializationStatus: ServiceStatus | null = null;

/**
 * Initialize all required services
 * @returns Promise<ServiceStatus> indicating initialization success/failure
 */
export const initializeServices = async (): Promise<ServiceStatus> => {
  logger.info('Starting service initialization...', {
    env: {
      spaceId: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
      hasAccessToken: !!import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
      hasPreviewToken: !!import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN,
      environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT,
      mode: import.meta.env.MODE,
      isDev: import.meta.env.DEV,
      nodeEnv: process.env.NODE_ENV
    }
  });
  
  const status: ServiceStatus = {
    initialized: false,
    services: {
      contentful: false,
      image: false
    }
  };

  try {
    // Verify configuration first
    logger.debug('Verifying Contentful configuration...');
    verifyContentfulConfig();
    logger.debug('Configuration verification successful');
    
    // Initialize ContentfulService
    logger.debug('Creating ContentfulService instance...');
    const contentfulService = getContentfulService();
    
    // Explicitly ensure Contentful service is initialized
    logger.debug('Ensuring ContentfulService is initialized...');
    const contentfulInitialized = await contentfulService.ensureInitialized();
    
    if (!contentfulInitialized) {
      throw new Error('Failed to initialize ContentfulService: Connection check failed');
    }
    
    logger.info('ContentfulService initialized successfully');
    status.services.contentful = true;
    
    // Now initialize BlogService
    logger.debug('Initializing BlogService...');
    const blogService = getBlogService();
    await blogService.initialize();
    logger.info('BlogService initialized successfully');
    
    // Initialize ImageService
    logger.debug('Initializing ImageService...');
    getImageService();
    logger.info('ImageService initialized successfully');
    status.services.image = true;

    status.initialized = true;
    initializationStatus = status;
    
    logger.info('Service initialization completed successfully');
    
    return status;

  } catch (error) {
    let errorMessage = 'Service initialization failed';
    
    if (error instanceof ConfigVerificationError) {
      errorMessage = `Configuration verification failed: ${error.message}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    status.error = new Error(errorMessage);
    initializationStatus = status;

    logger.error('Service initialization failed:', {
      error: errorMessage,
      status: {
        contentful: status.services.contentful,
        image: status.services.image
      }
    });

    throw status.error;
  }
};

/**
 * Get the current initialization status
 */
export const getInitializationStatus = (): ServiceStatus => {
  if (!initializationStatus) {
    return {
      initialized: false,
      services: {
        contentful: false,
        image: false
      }
    };
  }
  return initializationStatus;
};

/**
 * Returns a singleton instance of the BlogService
 * 
 * This ensures that only one instance of the BlogService exists,
 * which is important for efficient caching and connection pooling.
 */
export const getBlogService = (): BlogServiceInterface => {
  if (!blogServiceInstance) {
    try {
      logger.info('Creating new BlogService instance');
      const contentfulService = getContentfulService();
      logger.debug('Creating ContentfulBlogAdapter with ContentfulService...', {
        contentfulStatus: contentfulService.getConnectionStatus(),
        isReady: contentfulService.isReady()
      });
      blogServiceInstance = new ContentfulBlogAdapter(contentfulService);
      logger.debug('BlogService instance created successfully');
    } catch (error) {
      logger.error('Failed to create BlogService instance:', {
        error,
        stack: error instanceof Error ? error.stack : undefined,
        contentfulStatus: contentfulServiceInstance?.getConnectionStatus()
      });
      throw error;
    }
  }
  return blogServiceInstance;
};

/**
 * Returns a singleton instance of the ContentfulService
 * 
 * This ensures that only one instance of the ContentfulService exists,
 * which is important for efficient caching and connection pooling.
 */
export const getContentfulService = (): ContentfulService => {
  if (!contentfulServiceInstance) {
    try {
      logger.info('Creating new ContentfulService instance');
      logger.debug('Getting Contentful configuration...');
      const config = getContentfulConfig();
      logger.debug('Creating ContentfulService with config...', {
        spaceId: config.spaceId,
        environment: config.environment,
        cacheTTL: config.cacheTTL,
        hasAccessToken: !!config.accessToken,
        previewMode: config.enablePreviewMode
      });
      
      contentfulServiceInstance = new ContentfulService({
        spaceId: config.spaceId,
        accessToken: config.accessToken,
        environment: config.environment,
        cacheTTL: config.cacheTTL,
        enablePreviewMode: config.enablePreviewMode
      });
      
      // Initialize content type validation in development mode
      const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
      if (isDev) {
        logger.debug('Initializing content type validator in development mode...');
        // We need to make this async/await pattern safe with a type assertion for the client
        contentfulServiceInstance.getClient()
          .then(client => {
            logger.debug('Got Contentful client, initializing validator...');
            // @ts-expect-error - ContentfulClientApi type mismatch between different versions
            return initializeValidator(client, {
              ...DEFAULT_VALIDATOR_CONFIG,
              validateOnStartup: true,
              logLevel: 'warn'
            });
          })
          .then(() => {
            logger.debug('Content type validator initialized successfully');
          })
          .catch(error => {
            logger.warn('Failed to initialize content type validator:', {
              error,
              stack: error instanceof Error ? error.stack : undefined,
              contentfulStatus: contentfulServiceInstance?.getConnectionStatus()
            });
          });
      }
    } catch (error) {
      logger.error('Failed to create ContentfulService instance:', {
        error,
        stack: error instanceof Error ? error.stack : undefined,
        config: {
          spaceId: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
          environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT,
          hasAccessToken: !!import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
          previewMode: import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN
        }
      });
      throw error;
    }
  }
  return contentfulServiceInstance;
};

/**
 * Returns a singleton instance of the ImageService
 * 
 * This ensures that only one instance of the ImageService exists,
 * which helps manage API rate limits and caching for image requests.
 */
export const getImageService = (): ImageService => {
  if (!imageServiceInstance) {
    try {
      logger.info('Creating new ImageService instance');
      
      // Get API URL from environment or use default
      const apiUrl = 'https://api.pexels.com/v1';
      imageServiceInstance = new ImageService(apiUrl);
    } catch (error) {
      logger.error('Failed to create ImageService instance:', error);
      // Create a fallback instance with default URL
      imageServiceInstance = new ImageService('/api');
    }
  }
  return imageServiceInstance;
};

/**
 * Resets service instances (primarily used for testing)
 * 
 * This forces new instances to be created the next time getContentfulService
 * or getImageService is called.
 */
export const resetServices = (): void => {
  logger.info('Resetting service instances');
  contentfulServiceInstance = null;
  imageServiceInstance = null;
};

/**
 * Helper to determine if a service is initialized
 */
export const isServiceInitialized = (serviceName: 'contentful' | 'image'): boolean => {
  switch (serviceName) {
    case 'contentful':
      return contentfulServiceInstance !== null;
    case 'image':
      return imageServiceInstance !== null;
    default:
      return false;
  }
}; 