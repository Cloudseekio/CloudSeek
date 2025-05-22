#!/usr/bin/env node

/**
 * Simplified postbuild script for Netlify environment
 * This script bypasses the regular postbuild operations to avoid dependency issues
 */

console.log('🚀 Starting simplified postbuild process for Netlify environment');
console.log('ℹ️ Skipping critical CSS extraction to avoid dependency issues');
console.log('ℹ️ Skipping sitemap generation to avoid dependency issues');
console.log('✅ Postbuild completed successfully');

// Exit with success code
process.exit(0); 