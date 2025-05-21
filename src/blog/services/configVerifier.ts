import logger from '../../utils/logger';

/**
 * Configuration verification error with details about missing or invalid variables
 */
export class ConfigVerificationError extends Error {
  constructor(
    message: string,
    public readonly missingVars: string[],
    public readonly invalidVars: { [key: string]: string }
  ) {
    super(message);
    this.name = 'ConfigVerificationError';
  }

  /**
   * Format the error details for logging
   */
  formatDetails(): string {
    const details: string[] = [];
    
    if (this.missingVars.length > 0) {
      details.push(`Missing required variables: ${this.missingVars.join(', ')}`);
    }
    
    const invalidVarEntries = Object.entries(this.invalidVars);
    if (invalidVarEntries.length > 0) {
      details.push('Invalid variables:');
      invalidVarEntries.forEach(([key, reason]) => {
        details.push(`  - ${key}: ${reason}`);
      });
    }
    
    return details.join('\n');
  }
}

/**
 * Required configuration for Contentful
 */
export interface ContentfulConfigRequirements {
  required: string[];
  optional: string[];
  conditionalRequired: {
    if: { [key: string]: boolean | string };
    then: string[];
  }[];
}

/**
 * Default Contentful configuration requirements
 */
const DEFAULT_CONTENTFUL_CONFIG: ContentfulConfigRequirements = {
  required: [
    'VITE_CONTENTFUL_SPACE_ID',
    'VITE_CONTENTFUL_ACCESS_TOKEN'
  ],
  optional: [
    'VITE_CONTENTFUL_ENVIRONMENT',
    'VITE_CONTENTFUL_CACHE_TTL',
    'VITE_CONTENTFUL_DEFAULT_LOCALE'
  ],
  conditionalRequired: [
    {
      if: { 'VITE_CONTENTFUL_PREVIEW_MODE': 'true' },
      then: ['VITE_CONTENTFUL_PREVIEW_TOKEN']
    }
  ]
};

/**
 * Verify Contentful configuration
 * @param config Optional custom configuration requirements
 * @throws ConfigVerificationError if verification fails
 */
export function verifyContentfulConfig(
  config: ContentfulConfigRequirements = DEFAULT_CONTENTFUL_CONFIG
): void {
  logger.debug('Verifying Contentful configuration...');
  
  const missingVars: string[] = [];
  const invalidVars: { [key: string]: string } = {};

  // Check required variables
  config.required.forEach(varName => {
    if (!import.meta.env[varName]) {
      missingVars.push(varName);
    }
  });

  // Check conditional requirements
  config.conditionalRequired.forEach(condition => {
    const conditionMet = Object.entries(condition.if).every(([key, value]) => {
      const envValue = import.meta.env[key];
      return envValue === value;
    });

    if (conditionMet) {
      condition.then.forEach(varName => {
        if (!import.meta.env[varName]) {
          missingVars.push(`${varName} (required when ${Object.entries(condition.if).map(([k, v]) => `${k}=${v}`).join(' and ')})`);
        }
      });
    }
  });

  // Validate values of existing variables
  const allVars = [...config.required, ...config.optional, ...config.conditionalRequired.flatMap(c => c.then)];
  allVars.forEach(varName => {
    const value = import.meta.env[varName];
    if (value) {
      // Validate space ID format (should be a string of alphanumeric characters)
      if (varName === 'VITE_CONTENTFUL_SPACE_ID' && !/^[a-zA-Z0-9]+$/.test(value)) {
        invalidVars[varName] = 'Invalid space ID format';
      }
      
      // Validate token format (should be a non-empty string)
      if ((varName === 'VITE_CONTENTFUL_ACCESS_TOKEN' || varName === 'VITE_CONTENTFUL_PREVIEW_TOKEN') 
          && value.length < 10) {
        invalidVars[varName] = 'Token appears to be too short';
      }
      
      // Validate cache TTL (should be a positive number)
      if (varName === 'VITE_CONTENTFUL_CACHE_TTL') {
        const ttl = parseInt(value);
        if (isNaN(ttl) || ttl <= 0) {
          invalidVars[varName] = 'Cache TTL must be a positive number';
        }
      }
    }
  });

  // If any issues were found, throw an error
  if (missingVars.length > 0 || Object.keys(invalidVars).length > 0) {
    const error = new ConfigVerificationError(
      'Contentful configuration verification failed',
      missingVars,
      invalidVars
    );
    
    logger.error('Configuration verification failed:', {
      details: error.formatDetails()
    });
    
    throw error;
  }

  logger.info('Contentful configuration verified successfully');
}

/**
 * Development-only configuration test
 * This function should only be called in development environment
 */
export function testContentfulConfig(): void {
  if (import.meta.env.DEV) {
    try {
      verifyContentfulConfig();
      logger.info('✅ Contentful configuration test passed');
    } catch (error) {
      if (error instanceof ConfigVerificationError) {
        logger.error('❌ Contentful configuration test failed:', {
          details: error.formatDetails()
        });
      } else {
        logger.error('❌ Unexpected error during configuration test:', error);
      }
    }
  }
} 