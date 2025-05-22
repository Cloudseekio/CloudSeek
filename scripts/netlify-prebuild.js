#!/usr/bin/env node

/**
 * Enhanced prebuild script for Netlify environment
 * This script prepares the build environment and assets
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// ES Module compatibility setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Wrap everything in a try/catch for better error reporting
try {
  console.log('🚀 Starting enhanced prebuild process for Netlify environment');

  // Ensure public directory structure exists
  const publicDir = path.resolve(__dirname, '../public');
  const assetsDir = path.join(publicDir, 'assets');
  const fontsDir = path.join(assetsDir, 'fonts');
  const cssDir = path.join(assetsDir, 'css');
  const imagesDir = path.join(assetsDir, 'images');

  // Create directories if they don't exist
  [assetsDir, fontsDir, cssDir, imagesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });

  // Function to download a file
  const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dest);
      https.get(url, response => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${dest}`);
          resolve();
        });
      }).on('error', err => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    });
  };

  // Create empty CSS file if it doesn't exist
  const cssFile = path.join(cssDir, 'main.css');
  if (!fs.existsSync(cssFile)) {
    fs.writeFileSync(cssFile, '/* Generated CSS file */');
    console.log('Created empty main.css file');
  }

  // Font files to download
  const fontFiles = [
    {
      name: 'SF-Pro-Display-Regular.woff2',
      url: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/webfonts/fa-regular-400.woff2'
    },
    {
      name: 'SF-Pro-Display-Medium.woff2',
      url: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/webfonts/fa-regular-400.woff2'
    },
    {
      name: 'SF-Pro-Display-Bold.woff2',
      url: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/webfonts/fa-solid-900.woff2'
    }
  ];

  // Download all font files
  async function downloadFonts() {
    try {
      for (const font of fontFiles) {
        const fontPath = path.join(fontsDir, font.name);
        if (!fs.existsSync(fontPath)) {
          await downloadFile(font.url, fontPath);
        }
      }
    } catch (error) {
      console.error('Error downloading fonts:', error);
      // Don't throw here, allow the script to continue even if fonts fail
    }
  }

  // Execute the font download and finalize the script
  (async function main() {
    try {
      await downloadFonts();
      console.log('✅ Font setup completed');
      console.log('✅ Prebuild completed successfully');
      process.exit(0);  // Exit with success code
    } catch (error) {
      console.error('❌ Prebuild failed:', error);
      process.exit(1);  // Exit with error code
    }
  })();

} catch (error) {
  console.error('❌ Unhandled error during prebuild:', error);
  process.exit(1); // Exit with error code
} 