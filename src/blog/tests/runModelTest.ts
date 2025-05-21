/**
 * Blog System Data Model Test Runner
 * 
 * This file executes the data model validation tests to ensure
 * your unified blog data model is working correctly.
 */

import { validateDataModel } from './dataModelTest';

console.log('🔍 Starting Blog Data Model Tests...');

// Run the data model validation
validateDataModel()
  .then(() => {
    console.log('✅ Data model validation completed successfully');
  })
  .catch((error) => {
    console.error('❌ Data model validation failed:', error);
    process.exit(1);
  }); 