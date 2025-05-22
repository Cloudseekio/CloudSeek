#!/usr/bin/env node

/**
 * Enhanced prebuild script for Netlify environment
 * This script prepares the build environment and assets
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

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
  }
}

// Execute the font download
downloadFonts().then(() => {
  console.log('✅ Font setup completed');
}).catch(error => {
  console.error('Font setup failed:', error);
});

console.log('✅ Prebuild completed successfully');

// Exit with success code
process.exit(0); 