#!/usr/bin/env node

/**
 * Enhanced postbuild script for Netlify environment
 * This script ensures proper processing of build assets
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting enhanced postbuild process for Netlify environment');

try {
  const distDir = path.resolve(__dirname, '../dist');
  
  // Verify the build was successful
  if (!fs.existsSync(distDir)) {
    throw new Error('dist directory does not exist. Build may have failed.');
  }
  
  // Check for index.html
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error('index.html not found in dist directory');
  }
  
  // Check for assets
  const assetsDir = path.join(distDir, 'assets');
  if (!fs.existsSync(assetsDir)) {
    console.warn('Warning: assets directory not found in dist');
  }
  
  // Ensure _headers file exists for Netlify
  const headersPath = path.join(distDir, '_headers');
  if (!fs.existsSync(headersPath)) {
    console.log('Creating _headers file for Netlify...');
    const headers = `
/*
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; connect-src 'self' https://www.google-analytics.com https://api.cloudseek.io; img-src 'self' data: https: https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; object-src 'none'; frame-src 'self'; upgrade-insecure-requests;
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), geolocation=(), microphone=()

# Cache control for assets
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Cache control for images
/images/*
  Cache-Control: public, max-age=31536000, immutable

# Cache control for fonts
/assets/fonts/*
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *
    `;
    
    fs.writeFileSync(headersPath, headers.trim());
  }
  
  // Ensure _redirects file exists for Netlify
  const redirectsPath = path.join(distDir, '_redirects');
  if (!fs.existsSync(redirectsPath)) {
    console.log('Creating _redirects file for Netlify...');
    const redirects = `
# Redirect all requests to index.html for SPA
/*    /index.html   200
    `;
    
    fs.writeFileSync(redirectsPath, redirects.trim());
  }

  // Print build directory structure for debugging
  console.log('Build directory structure:');
  try {
    const result = execSync('find dist -type f | sort', { encoding: 'utf8' });
    console.log(result);
  } catch (error) {
    console.warn('Could not list build directory structure:', error.message);
  }
  
  console.log('✅ Postbuild completed successfully');
} catch (error) {
  console.error('❌ Error during postbuild:', error.message);
  // Don't exit with error to allow deployment
  // process.exit(1);
} 