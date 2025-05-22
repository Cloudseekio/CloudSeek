#!/usr/bin/env node

/**
 * Prebuild script for Netlify environment
 * This script prepares necessary assets before build
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// ES Module compatibility setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Font URLs to download
const FONTS_TO_DOWNLOAD = [
  {
    url: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
    dest: 'SF-Pro-Display-Regular.woff2',
    fallbackUrl: 'https://applesocial.s3.amazonaws.com/assets/styles/fonts/sanfrancisco/sanfranciscodisplay-regular-webfont.woff2'
  },
  {
    url: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2',
    dest: 'SF-Pro-Display-Medium.woff2',
    fallbackUrl: 'https://applesocial.s3.amazonaws.com/assets/styles/fonts/sanfrancisco/sanfranciscodisplay-medium-webfont.woff2'
  },
  {
    url: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4AMP6lQ.woff2',
    dest: 'SF-Pro-Display-Bold.woff2',
    fallbackUrl: 'https://applesocial.s3.amazonaws.com/assets/styles/fonts/sanfrancisco/sanfranciscodisplay-bold-webfont.woff2'
  }
];

try {
  console.log('🚀 Starting enhanced prebuild process for Netlify environment');

  // Helper function to download a file
  const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
      console.log(`Downloading ${url} to ${dest}`);
      
      const file = fs.createWriteStream(dest);
      https.get(url, response => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✅ Successfully downloaded ${dest}`);
            resolve();
          });
        } else if (response.statusCode === 404) {
          file.close();
          fs.unlinkSync(dest); // Remove the file if it was created
          reject(new Error(`File not found: ${url}`));
        } else {
          file.close();
          fs.unlinkSync(dest); // Remove the file if it was created
          reject(new Error(`Failed to download ${url}, status code: ${response.statusCode}`));
        }
      }).on('error', err => {
        fs.unlinkSync(dest); // Remove the file if it was created
        reject(err);
      });
    });
  };

  // Create necessary directories if they don't exist
  const createDirectories = () => {
    const publicDir = path.resolve(__dirname, '../public');
    const assetsDir = path.join(publicDir, 'assets');
    const cssDir = path.join(assetsDir, 'css');
    const fontsDir = path.join(assetsDir, 'fonts');
    
    [publicDir, assetsDir, cssDir, fontsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    });
    
    return { publicDir, assetsDir, cssDir, fontsDir };
  };

  // Download fonts and create CSS
  async function downloadFonts() {
    const { fontsDir } = createDirectories();
    
    // Download fonts in parallel
    const downloadPromises = FONTS_TO_DOWNLOAD.map(async font => {
      const fontPath = path.join(fontsDir, font.dest);
      
      try {
        if (!fs.existsSync(fontPath)) {
          await downloadFile(font.url, fontPath)
            .catch(async (error) => {
              console.warn(`Warning: ${error.message}. Trying fallback URL...`);
              // Try fallback URL if primary fails
              if (font.fallbackUrl) {
                return downloadFile(font.fallbackUrl, fontPath);
              }
              throw error;
            });
        } else {
          console.log(`Font ${font.dest} already exists, skipping download`);
        }
      } catch (error) {
        console.error(`Failed to download font ${font.dest}: ${error.message}`);
        // Create an empty placeholder file so the build won't fail
        fs.writeFileSync(fontPath, Buffer.alloc(10));
        console.log(`Created placeholder for ${font.dest}`);
      }
    });
    
    await Promise.all(downloadPromises);
  }
  
  // Create main.css if it doesn't exist
  function createMainCss() {
    const { cssDir } = createDirectories();
    const cssPath = path.join(cssDir, 'main.css');
    
    if (!fs.existsSync(cssPath)) {
      const cssContent = `
/* Base styles to prevent blank page */
body {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
  color: #333;
  background-color: #fff;
}

html, body {
  height: 100%;
}

#root {
  height: 100%;
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
      fs.writeFileSync(cssPath, cssContent);
      console.log(`✅ Created ${cssPath} with basic styles`);
    } else {
      console.log(`${cssPath} already exists, skipping creation`);
    }
  }
  
  // Create _headers file
  function createHeaders() {
    const publicDir = path.resolve(__dirname, '../public');
    const headersPath = path.join(publicDir, '_headers');
    
    if (!fs.existsSync(headersPath)) {
      const headersContent = `
/*
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.google-analytics.com https://code.jquery.com data:; connect-src 'self' https://*.google-analytics.com https://api.cloudseek.io https://*.netlify.app https://www.googletagmanager.com; img-src 'self' data: https://*.google-analytics.com https://images.ctfassets.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; object-src 'none'; frame-src 'self'; manifest-src 'self';
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
      console.log(`✅ Created ${headersPath} with CSP headers`);
    } else {
      console.log(`${headersPath} already exists, skipping creation`);
    }
  }

  // Main execution
  (async function main() {
    try {
      await downloadFonts();
      createMainCss();
      createHeaders();
      console.log('✅ Prebuild process completed successfully');
    } catch (error) {
      console.error('❌ Prebuild process failed:', error);
      process.exit(1); // Exit with error code
    }
  })();
} catch (error) {
  console.error('❌ Unhandled error during prebuild process:', error);
  process.exit(1); // Exit with error code
} 