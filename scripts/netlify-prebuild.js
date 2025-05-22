#!/usr/bin/env node

/**
 * Enhanced prebuild script for Netlify environment
 * This script ensures that all necessary directories and assets are properly prepared
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting enhanced prebuild process for Netlify environment');

// Set the NODE_ENV to production to ensure proper builds
process.env.NODE_ENV = 'production';

try {
  // Create necessary directories
  const publicDir = path.resolve(__dirname, '../public');
  const assetsDir = path.join(publicDir, 'assets');
  const cssDir = path.join(assetsDir, 'css');
  const fontsDir = path.join(assetsDir, 'fonts');
  const imagesDir = path.join(assetsDir, 'images');

  // Ensure directories exist
  [assetsDir, cssDir, fontsDir, imagesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });

  // Copy any essential fonts from the src directory if needed
  const srcFontsDir = path.resolve(__dirname, '../src/assets/fonts');
  if (fs.existsSync(srcFontsDir)) {
    console.log('Copying fonts from src/assets/fonts to public/assets/fonts');
    try {
      execSync(`cp -r ${srcFontsDir}/* ${fontsDir}/`, { stdio: 'inherit' });
    } catch (error) {
      console.warn('Warning: Could not copy fonts:', error.message);
    }
  }

  // Log environment info for debugging
  console.log('Environment info:');
  console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`- NETLIFY: ${process.env.NETLIFY}`);

  console.log('✅ Prebuild completed successfully');
} catch (error) {
  console.error('❌ Error during prebuild:', error);
  // Don't exit with error to allow build to continue
  // process.exit(1);
} 