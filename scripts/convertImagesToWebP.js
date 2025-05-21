#!/usr/bin/env node

/**
 * Image Conversion Script
 * 
 * This script:
 * 1. Converts images in public directory to WebP format
 * 2. Creates responsive versions at different sizes
 * 3. Preserves original images
 * 
 * Run with: node scripts/convertImagesToWebP.js
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import glob from 'glob';
import chalk from 'chalk';

// Configuration
const config = {
  // Source directories to process (relative to project root)
  sourceDirs: ['public/images', 'public/assets', 'public/blogs'],
  // Image file extensions to process
  extensions: ['.jpg', '.jpeg', '.png', '.gif'],
  // Responsive breakpoints for image sizes
  breakpoints: [640, 768, 1024, 1280, 1536],
  // Default image quality for WebP (1-100)
  quality: 80,
  // Whether to create responsive versions
  createResponsive: true,
  // Whether to create WebP versions of existing images
  createWebP: true,
  // Only process images modified in the last X days (0 = all images)
  modifiedInLastDays: 0,
};

// Statistics for reporting
const stats = {
  processed: 0,
  skipped: 0,
  errors: 0,
  savedBytes: 0,
  totalOriginalSize: 0,
};

// Validate the presence of sharp
try {
  if (!sharp) {
    console.error(chalk.red('Sharp image processing library is required.'));
    console.error(chalk.yellow('Please install it with: npm install sharp --save-dev'));
    process.exit(1);
  }
} catch (error) {
  console.error(chalk.red('Sharp image processing library is required.'));
  console.error(chalk.yellow('Please install it with: npm install sharp --save-dev'));
  process.exit(1);
}

// Ensure output directory exists
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

// Get file size in bytes
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

// Get file modification time
function getFileModTime(filePath) {
  const stats = fs.statSync(filePath);
  return stats.mtime;
}

// Check if file was modified in the last X days
function wasModifiedRecently(filePath, days) {
  if (days <= 0) return true;
  
  const fileTime = getFileModTime(filePath);
  const now = new Date();
  const daysAgo = new Date(now - days * 24 * 60 * 60 * 1000);
  
  return fileTime > daysAgo;
}

// Process a single image
async function processImage(imagePath) {
  try {
    const originalSize = getFileSize(imagePath);
    stats.totalOriginalSize += originalSize;
    
    // Check if the file was modified recently enough to process
    if (!wasModifiedRecently(imagePath, config.modifiedInLastDays)) {
      console.log(chalk.yellow(`Skipping ${imagePath} - not modified recently`));
      stats.skipped++;
      return;
    }
    
    // Get file info
    const pathInfo = path.parse(imagePath);
    const filename = pathInfo.name;
    const ext = pathInfo.ext.toLowerCase();
    const dir = pathInfo.dir;
    
    // Skip if already a WebP file
    if (ext === '.webp') {
      stats.skipped++;
      return;
    }
    
    // Create WebP version
    if (config.createWebP) {
      const webpPath = path.join(dir, `${filename}.webp`);
      
      // Check if WebP already exists and is newer than source
      if (fs.existsSync(webpPath) && 
          getFileModTime(webpPath) > getFileModTime(imagePath)) {
        console.log(chalk.yellow(`Skipping ${webpPath} - already up to date`));
      } else {
        await sharp(imagePath)
          .webp({ quality: config.quality })
          .toFile(webpPath);
        
        const webpSize = getFileSize(webpPath);
        const saved = originalSize - webpSize;
        stats.savedBytes += saved;
        
        console.log(
          chalk.green(`Created ${webpPath}`) +
          chalk.blue(` (${formatBytes(webpSize)}, saved ${formatBytes(saved)})`)
        );
      }
    }
    
    // Create responsive versions
    if (config.createResponsive) {
      const responsiveDir = path.join(dir, 'responsive');
      ensureDirectoryExists(responsiveDir);
      
      // Process each breakpoint
      for (const width of config.breakpoints) {
        // Original format responsive
        const responsivePath = path.join(responsiveDir, `${filename}-${width}${ext}`);
        // WebP format responsive
        const responsiveWebpPath = path.join(responsiveDir, `${filename}-${width}.webp`);
        
        // Check if files already exist and are newer than source
        const skipOriginal = fs.existsSync(responsivePath) && 
                            getFileModTime(responsivePath) > getFileModTime(imagePath);
        const skipWebp = fs.existsSync(responsiveWebpPath) && 
                        getFileModTime(responsiveWebpPath) > getFileModTime(imagePath);
        
        if (!skipOriginal) {
          await sharp(imagePath)
            .resize({ width, withoutEnlargement: true })
            .toFile(responsivePath);
            
          console.log(chalk.green(`Created ${responsivePath}`));
        }
        
        if (!skipWebp) {
          await sharp(imagePath)
            .resize({ width, withoutEnlargement: true })
            .webp({ quality: config.quality })
            .toFile(responsiveWebpPath);
            
          console.log(chalk.green(`Created ${responsiveWebpPath}`));
        }
      }
    }
    
    stats.processed++;
  } catch (error) {
    console.error(chalk.red(`Error processing ${imagePath}: ${error.message}`));
    stats.errors++;
  }
}

// Format bytes to human-readable size
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Find all images matching configured criteria
function findImages() {
  let images = [];
  
  config.sourceDirs.forEach(sourceDir => {
    config.extensions.forEach(ext => {
      const pattern = path.join(sourceDir, `**/*${ext}`);
      const found = glob.sync(pattern);
      images = images.concat(found);
    });
  });
  
  return images;
}

// Main function
async function main() {
  console.log(chalk.cyan('🖼️  Starting image optimization...\n'));
  
  // Find all images
  const images = findImages();
  console.log(chalk.cyan(`Found ${images.length} images to process`));
  
  // Process images
  const startTime = Date.now();
  for (const imagePath of images) {
    await processImage(imagePath);
  }
  const endTime = Date.now();
  
  // Print report
  console.log('\n' + chalk.cyan('📊 Image Optimization Report'));
  console.log('-------------------------------');
  console.log(`${chalk.green(`✓ Processed:`)} ${stats.processed} images`);
  console.log(`${chalk.yellow(`⚠ Skipped:`)} ${stats.skipped} images`);
  console.log(`${chalk.red(`✗ Errors:`)} ${stats.errors} images`);
  
  if (stats.processed > 0) {
    const compressionRatio = (stats.totalOriginalSize - stats.savedBytes) / stats.totalOriginalSize;
    const savingsPercent = ((1 - compressionRatio) * 100).toFixed(2);
    
    console.log(`${chalk.blue(`💾 Total size reduced by:`)} ${formatBytes(stats.savedBytes)} (${savingsPercent}%)`);
    console.log(`${chalk.blue(`⏱️ Processing time:`)} ${((endTime - startTime) / 1000).toFixed(2)}s`);
  }
}

// Run the script
main().catch(error => {
  console.error(chalk.red(`Failed to process images: ${error.message}`));
  process.exit(1);
}); 