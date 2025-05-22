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
  const publicDir = path.resolve(__dirname, '../public');
  const indexHtmlPath = path.join(distDir, 'index.html');

  // Create a CSS file with basic styles to prevent blank page
  const createMainCss = () => {
    const distAssetsDir = path.join(distDir, 'assets');
    const distCssDir = path.join(distAssetsDir, 'css');
    
    // Create directories if they don't exist
    [distAssetsDir, distCssDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    });
    
    // Create main.css with basic styles
    const cssContent = `
      /* Base styles to prevent blank page */
      body {
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        margin: 0;
        padding: 0;
        color: #333;
        background-color: #fff;
      }

      /* Font face declarations */
      @font-face {
        font-family: 'SF Pro Display';
        src: url('/assets/fonts/SF-Pro-Display-Regular.woff2') format('woff2');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'SF Pro Display';
        src: url('/assets/fonts/SF-Pro-Display-Medium.woff2') format('woff2');
        font-weight: 500;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'SF Pro Display';
        src: url('/assets/fonts/SF-Pro-Display-Bold.woff2') format('woff2');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }
    `;
    
    const cssPath = path.join(distCssDir, 'main.css');
    fs.writeFileSync(cssPath, cssContent);
    console.log('✓ Created main.css with basic styles');
    
    return cssPath;
  };

  // Add CSS link to head if needed  const addCssLinks = () => {    if (fs.existsSync(indexHtmlPath)) {      let htmlContent = fs.readFileSync(indexHtmlPath, 'utf-8');            // Make sure the main.css is properly linked in the head      if (!htmlContent.includes('main.css')) {        htmlContent = htmlContent.replace('</head>', `  <link rel="stylesheet" href="/assets/css/main.css">\n  </head>`);                // Write the updated content        fs.writeFileSync(indexHtmlPath, htmlContent);        console.log('✓ Added CSS link to index.html');      }    } else {      console.error('⚠️ Could not find index.html in dist directory');    }  };

  // Copy all font files from public to dist
  const copyFonts = () => {
    const distFontsDir = path.join(distDir, 'assets', 'fonts');
    const publicFontsDir = path.join(publicDir, 'assets', 'fonts');
    
    // Create fonts directory if it doesn't exist
    if (!fs.existsSync(distFontsDir)) {
      fs.mkdirSync(distFontsDir, { recursive: true });
      console.log(`Created directory: ${distFontsDir}`);
    }
    
    // If public fonts directory exists, copy all fonts
    if (fs.existsSync(publicFontsDir)) {
      const fontFiles = fs.readdirSync(publicFontsDir);
      fontFiles.forEach(file => {
        const sourcePath = path.join(publicFontsDir, file);
        const destPath = path.join(distFontsDir, file);
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${file} to ${distFontsDir}`);
      });
    } else {
      console.log('No public fonts directory found, using downloaded fonts');
    }
    
    // Generate fallback font files if they don't exist
    const fontFiles = [
      'SF-Pro-Display-Regular.woff2',
      'SF-Pro-Display-Medium.woff2',
      'SF-Pro-Display-Bold.woff2'
    ];
    
    fontFiles.forEach(fontFile => {
      const fontPath = path.join(distFontsDir, fontFile);
      if (!fs.existsSync(fontPath)) {
        // Create an empty font file (this is just a placeholder, real fonts were downloaded in prebuild)
        const emptyFont = Buffer.alloc(10);
        fs.writeFileSync(fontPath, emptyFont);
        console.log(`Created placeholder font file: ${fontFile}`);
      }
    });
  };

  // Create necessary directories and files
  (async function main() {
    try {
      // Create and copy basic assets
      createMainCss();
      copyFonts();
      
      // Add CSS links to index.html      addCssLinks();
      
      // Add extra headers file to ensure proper CSP
      const headersPath = path.join(distDir, '_headers');
      if (fs.existsSync(indexHtmlPath)) {
        console.log('✓ Found index.html in dist directory');
        
        // Create _headers file with expanded CSP for Google Analytics
        const headersContent = `
/*
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.google-analytics.com; script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.google-analytics.com; connect-src 'self' https://*.google-analytics.com https://api.cloudseek.io https://*.netlify.app https://www.googletagmanager.com; img-src 'self' data: https://*.google-analytics.com https://images.ctfassets.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; object-src 'none'; frame-src 'self'; manifest-src 'self';
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
        
        fs.writeFileSync(headersPath, headersContent.trim());
        console.log('✓ Created _headers file with expanded CSP');
      } else {
        console.error('⚠️ Could not find index.html in dist directory');
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
      
      // Create a simple robots.txt file
      const robotsPath = path.join(distDir, 'robots.txt');
      if (!fs.existsSync(robotsPath)) {
        const robotsContent = `User-agent: *
Allow: /

Sitemap: https://cloudseek.io/sitemap.xml`;
        
        fs.writeFileSync(robotsPath, robotsContent);
        console.log('✓ Created robots.txt file');
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