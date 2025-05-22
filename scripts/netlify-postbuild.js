#!/usr/bin/env node

/**
 * Enhanced postbuild script for Netlify environment
 * This script handles post-build optimizations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module compatibility setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Wrap everything in a try/catch for better error reporting
try {
  console.log('🚀 Starting enhanced postbuild process for Netlify environment');

  // Paths
  const distDir = path.resolve(__dirname, '../dist');
  const indexHtmlPath = path.join(distDir, 'index.html');

  // Add jQuery fallback script
  const addJQueryFallback = () => {
    if (fs.existsSync(indexHtmlPath)) {
      let htmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');
      
      // Check if we need to add jQuery
      if (htmlContent.indexOf('jquery') !== -1 || htmlContent.indexOf('jQuery') !== -1) {
        // Add jQuery from CDN before the first script tag
        const jQueryScript = `<script src="https://code.jquery.com/jquery-3.6.4.min.js" integrity="sha256-oP6HI9z1XaZNBrJURtCoUT5SUnxFr8s3BzRl+cbzUq8=" crossorigin="anonymous"></script>`;
        
        // Insert before the first script
        htmlContent = htmlContent.replace(/<script/, `${jQueryScript}\n    <script`);
        
        // Write the updated content
        fs.writeFileSync(indexHtmlPath, htmlContent);
        console.log('✓ Added jQuery fallback to index.html');
      }
    } else {
      console.error('⚠️ Could not find index.html in dist directory');
    }
  };

  // Create necessary directories and files
  (async function main() {
    try {
      // Add extra headers file to ensure proper CSP
      const headersPath = path.join(distDir, '_headers');
      if (fs.existsSync(indexHtmlPath)) {
        console.log('✓ Found index.html in dist directory');
        
        // Create _headers file with relaxed CSP
        const headersContent = `
/*
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.google-analytics.com https://code.jquery.com; connect-src 'self' https://*.google-analytics.com https://api.cloudseek.io https://*.netlify.app; img-src 'self' data: https://*.google-analytics.com https://images.ctfassets.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; object-src 'none'; frame-src 'self'; manifest-src 'self';
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), geolocation=(), microphone=()

# Cache control for assets
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Cache control for images
/images/*
  Cache-Control: public, max-age=31536000, immutable

# Cache control for fonts
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *
`;
        
        fs.writeFileSync(headersPath, headersContent.trim());
        console.log('✓ Created _headers file with proper CSP');
        
        // Add jQuery fallback
        addJQueryFallback();
        
      } else {
        console.error('⚠️ Could not find index.html in dist directory');
      }

      // Create empty assets folder in dist if it doesn't exist
      const distAssetsDir = path.join(distDir, 'assets');
      const distCssDir = path.join(distAssetsDir, 'css');
      const distFontsDir = path.join(distAssetsDir, 'fonts');

      [distAssetsDir, distCssDir, distFontsDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
          console.log(`Created directory: ${dir}`);
        }
      });

      // Copy CSS and font files from public to dist if they don't exist
      const publicAssetsDir = path.join(__dirname, '../public/assets');
      const sourceCssDir = path.join(publicAssetsDir, 'css');
      const sourceFontsDir = path.join(publicAssetsDir, 'fonts');

      if (fs.existsSync(sourceCssDir)) {
        const cssFiles = fs.readdirSync(sourceCssDir);
        cssFiles.forEach(file => {
          const sourcePath = path.join(sourceCssDir, file);
          const destPath = path.join(distCssDir, file);
          fs.copyFileSync(sourcePath, destPath);
          console.log(`Copied ${sourcePath} to ${destPath}`);
        });
      }

      if (fs.existsSync(sourceFontsDir)) {
        const fontFiles = fs.readdirSync(sourceFontsDir);
        fontFiles.forEach(file => {
          const sourcePath = path.join(sourceFontsDir, file);
          const destPath = path.join(distFontsDir, file);
          fs.copyFileSync(sourcePath, destPath);
          console.log(`Copied ${sourcePath} to ${destPath}`);
        });
      }
      
      // Create a simple sitemap.xml if it doesn't exist in the dist directory
      const sitemapPath = path.join(distDir, 'sitemap.xml');
      if (!fs.existsSync(sitemapPath)) {
        const currentDate = new Date().toISOString().split('T')[0];
        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://cloudseek.io/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://cloudseek.io/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://cloudseek.io/services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://cloudseek.io/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
        
        fs.writeFileSync(sitemapPath, sitemapContent);
        console.log('✓ Created basic sitemap.xml');
      }

      console.log('✅ Postbuild completed successfully');
      process.exit(0); // Exit with success code
    } catch (error) {
      console.error('❌ Postbuild failed:', error);
      process.exit(1); // Exit with error code
    }
  })();
} catch (error) {
  console.error('❌ Unhandled error during postbuild:', error);
  process.exit(1); // Exit with error code
} 