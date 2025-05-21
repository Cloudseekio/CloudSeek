import { ContentfulClientApi, EntrySkeletonType } from 'contentful';
import logger from '../../utils/logger';

/**
 * Configuration for content type validation
 */
export interface ValidatorConfig {
  expectedTypes: {
    blogPost: string[];
    author: string[];
    category: string[];
    tag: string[];
    [key: string]: string[];
  };
  validateOnStartup?: boolean;
  logLevel?: 'error' | 'warn' | 'info' | 'debug';
}

/**
 * Default configuration with all known content types
 */
export const DEFAULT_VALIDATOR_CONFIG: ValidatorConfig = {
  expectedTypes: {
    blogPost: ['blogPost', 'cloudSeekBlogPost', 'clousdSeekBlogPost'],
    author: ['author', 'person', 'contributor'],
    category: ['category', 'blogCategory'],
    tag: ['tag', 'blogTag'],
  },
  validateOnStartup: false,
  logLevel: 'warn',
};

/**
 * Error specific to content type validation failures
 */
export class ContentTypeValidationError extends Error {
  constructor(
    message: string,
    public readonly contentType: string,
    public readonly expected: string[],
    public readonly found?: string[]
  ) {
    super(message);
    this.name = 'ContentTypeValidationError';

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ContentTypeValidationError);
    }
  }
}

/**
 * Result of a content type validation
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ContentTypeValidationError[];
  missingTypes: string[];
  unexpectedTypes: string[];
  validContentTypes: Record<string, string[]>;
}

/**
 * In-memory cache for validation results
 */
let validationCache: ValidationResult | null = null;

/**
 * Gets a list of valid content types for a given category
 * @param category The category of content types to get (e.g., 'blogPost', 'author')
 * @param config Custom validator configuration
 * @returns Array of valid content type IDs for the specified category
 */
export function getValidContentTypes(
  category: string,
  config: ValidatorConfig = DEFAULT_VALIDATOR_CONFIG
): string[] {
  // If we have cached validation results and they include this category, use those
  if (validationCache?.validContentTypes[category]) {
    return validationCache.validContentTypes[category];
  }

  // Otherwise return the expected types from config
  return config.expectedTypes[category] || [];
}

/**
 * Validates that all required content types exist in Contentful
 * @param client Contentful client instance
 * @param config Custom validator configuration
 * @returns Promise resolving to the validation result
 */
export async function validateContentTypes(
  client: ContentfulClientApi<EntrySkeletonType>,
  config: ValidatorConfig = DEFAULT_VALIDATOR_CONFIG
): Promise<ValidationResult> {
  // Return cached result if available
  if (validationCache) {
    return validationCache;
  }

  const result: ValidationResult = {
    isValid: true,
    errors: [],
    missingTypes: [],
    unexpectedTypes: [],
    validContentTypes: {},
  };

  try {
    // Log validation start
    logger.debug('Starting content type validation');

    // Get all content types from Contentful
    const response = await client.getContentTypes();
    const contentTypes = response.items;

    // Map of content type IDs
    const contentTypeIds = new Set<string>();
    contentTypes.forEach(type => {
      if (type.sys && type.sys.id) {
        contentTypeIds.add(type.sys.id);
      }
    });
    
    // Check if all expected types exist
    Object.entries(config.expectedTypes).forEach(([category, expectedIds]) => {
      // Initialize the valid content types array for this category
      result.validContentTypes[category] = [];
      
      // Check each expected ID
      expectedIds.forEach(expectedId => {
        if (contentTypeIds.has(expectedId)) {
          // Valid content type, add to the list
          result.validContentTypes[category].push(expectedId);
        } else {
          // Missing content type
          result.missingTypes.push(expectedId);
          result.isValid = false;
          
          // Create specific error for this missing type
          const error = new ContentTypeValidationError(
            `Expected content type "${expectedId}" not found in Contentful space`,
            category,
            expectedIds,
            Array.from(contentTypeIds)
          );
          
          result.errors.push(error);
          
          // Log the error at the configured level
          const logMessage = `Content type validation failed: ${error.message}`;
          switch (config.logLevel) {
            case 'error':
              logger.error(logMessage, error);
              break;
            case 'warn':
              logger.warn(logMessage);
              break;
            case 'info':
              logger.info(logMessage);
              break;
            case 'debug':
              logger.debug(logMessage);
              break;
            default:
              logger.warn(logMessage);
          }
        }
      });
    });

    // Look for unexpected content types (optional, just for information)
    contentTypes.forEach(type => {
      if (type.sys && type.sys.id) {
        const id = type.sys.id;
        const found = Object.values(config.expectedTypes).some(expectedIds => 
          expectedIds.includes(id)
        );
        
        if (!found) {
          result.unexpectedTypes.push(id);
          logger.debug(`Found unexpected content type: ${id}`);
        }
      }
    });

    // Cache the validation result
    validationCache = result;
    
    // Log validation completion
    logger.debug('Content type validation completed', {
      isValid: result.isValid,
      missingTypes: result.missingTypes.length,
      unexpectedTypes: result.unexpectedTypes.length
    });

    return result;
  } catch (error) {
    // Handle API errors without crashing
    logger.error('Failed to validate content types', error);
    
    // Return a fallback result that assumes validation passed
    // This prevents the application from being blocked by validation failures
    return {
      isValid: true, // Assume valid for fallback
      errors: [new ContentTypeValidationError(
        'Content type validation failed due to API error',
        'unknown',
        [],
        []
      )],
      missingTypes: [],
      unexpectedTypes: [],
      validContentTypes: { ...config.expectedTypes }, // Use expected types as valid
    };
  }
}

/**
 * Utility function to initialize validation on application startup
 * @param client Contentful client instance
 * @param config Custom validator configuration
 */
export async function initializeValidator(
  client: ContentfulClientApi<EntrySkeletonType>,
  config: ValidatorConfig = DEFAULT_VALIDATOR_CONFIG
): Promise<void> {
  if (config.validateOnStartup) {
    try {
      // Run validation but don't await it to avoid blocking
      validateContentTypes(client, config).then(result => {
        if (!result.isValid) {
          logger.warn(`Content type validation found ${result.errors.length} issues`);
        } else {
          logger.info('Content type validation successful');
        }
      });
    } catch (error) {
      // Log but don't block startup
      logger.error('Error during content type validation initialization', error);
    }
  }
}

/**
 * Clears the validation cache
 */
export function clearValidationCache(): void {
  validationCache = null;
  logger.debug('Content type validation cache cleared');
}

/**
 * Helper function to check if a content type ID belongs to a specific category
 * @param contentTypeId The content type ID to check
 * @param category The category to check against
 * @param config Custom validator configuration
 * @returns Boolean indicating if the content type ID belongs to the category
 */
export function isContentTypeInCategory(
  contentTypeId: string,
  category: string,
  config: ValidatorConfig = DEFAULT_VALIDATOR_CONFIG
): boolean {
  const validTypes = getValidContentTypes(category, config);
  return validTypes.includes(contentTypeId);
} 