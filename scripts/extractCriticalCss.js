#!/usr/bin/env node

/**
 * Critical CSS extraction script
 * 
 * This script:
 * 1. Runs after the production build is complete
 * 2. Extracts critical CSS for above-the-fold content
 * 3. Inlines the critical CSS in the HTML
 * 4. Adds async loading for the full CSS
 * 
 * Usage: Automatically runs via npm postbuild script
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import glob from 'glob';
import { PurgeCSS } from 'purgecss';
import chalk from 'chalk';

// Get the directory of current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

// Configuration
const config = {
  // Path to the HTML file to update
  htmlPath: path.join(distDir, 'index.html'),
  // Content paths to analyze (critical components)
  contentPaths: [
    // Navigation elements
    path.join(projectRoot, 'src', 'components', 'common', 'Navbar.tsx'),
    
    // Key hero and intro sections
    path.join(projectRoot, 'src', 'components', 'HeroSection.tsx'),
    path.join(projectRoot, 'src', 'components', 'home', 'HeroSection.tsx'),
    path.join(projectRoot, 'src', 'components', 'home', 'IntroSection.tsx'),
    path.join(projectRoot, 'src', 'components', 'home', 'StatsSection.tsx'),
    
    // Loading states that appear during initial render
    path.join(projectRoot, 'src', 'components', 'LoadingFallback.tsx'),
    
    // Key interactive elements that appear above the fold
    path.join(projectRoot, 'src', 'components', 'SmoothInfiniteCarousel.jsx'),
    path.join(projectRoot, 'src', 'components', 'RotatingTextSlider.tsx'),
    
    // Utility components that contribute to above-fold styling
    path.join(projectRoot, 'src', 'components', 'OptimizedImage.tsx'),
    
    // Main layout and page components
    path.join(projectRoot, 'src', 'App.tsx'),
    path.join(projectRoot, 'src', 'Home.tsx'),
    path.join(projectRoot, 'src', 'pages', 'Home.tsx'),
    
    // Global styles
    path.join(projectRoot, 'src', 'index.css'),
    path.join(projectRoot, 'src', 'styles', 'globals.css')
  ],
  // Tailwind classes that should always be included
  whitelistClasses: [
    // Base theme classes
    'dark',
    'light',
    'html',
    'body',
    
    // Key background and text colors
    'bg-white',
    'bg-[#0f1628]',
    'bg-gray-50',
    'bg-gray-900',
    'text-white',
    'text-gray-900',
    'text-gray-600',
    'text-blue-600',
    
    // Common layout patterns in above-fold content
    'container',
    'fixed',
    'flex',
    'items-center',
    'justify-center',
    'grid',
    'grid-cols-1',
    'lg:grid-cols-2',
    'w-full',
    'h-full',
    'px-4',
    'py-2',
    'mx-auto',
    'rounded-lg',
    'shadow-sm',
    
    // Animation classes that apply above the fold
    'animate-spin',
    'animate-pulse',
    'transition',
    
    // Dark mode variants of important classes
    'dark:bg-gray-900',
    'dark:text-gray-100'
  ]
};

console.log(chalk.blue('🔍 Starting critical CSS extraction script...'));
console.log(`📁 Script directory: ${__dirname}`);
console.log(`📁 Looking for dist directory at: ${distDir}`);

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  console.error(chalk.red('❌ dist directory not found. Make sure you ran the build command first.'));
  process.exit(1);
}
console.log(chalk.green('✅ Found dist directory'));

// List all files in the assets directory structure for debugging
console.log(chalk.blue('\n📋 Scanning assets directory structure:'));
try {
  // First try to look in the css subdirectory where our CSS files should be
  const cssDir = path.join(distDir, 'assets', 'css');
  const cssFilesPath = path.join(cssDir, '*.css');
  console.log(`Looking for CSS files in: ${cssFilesPath}`);
  
  if (!fs.existsSync(cssDir)) {
    console.error(chalk.red(`❌ CSS directory not found: ${cssDir}`));
    
    // List the dist/assets directory to see its structure
    const assetsDir = path.join(distDir, 'assets');
    if (fs.existsSync(assetsDir)) {
      console.log('Contents of assets directory:');
      fs.readdirSync(assetsDir).forEach(item => console.log(`- ${item}`));
    }
    
    process.exit(1);
  }
  
  // Read CSS directory contents directly
  console.log('Reading CSS directory:');
  const cssFiles = fs.readdirSync(cssDir)
    .filter(file => path.extname(file) === '.css' && !file.endsWith('.br') && !file.endsWith('.gz'))
    .map(file => path.join(cssDir, file));
    
  console.log(`Found ${cssFiles.length} CSS files with direct filesystem access`);
  
  if (cssFiles.length === 0) {
    console.error(chalk.red('❌ No CSS files found in the assets directory. Aborting.'));
    process.exit(1);
  }

  console.log(chalk.green(`\n✅ Found ${cssFiles.length} CSS files:`));
  cssFiles.forEach(file => console.log(`- ${path.relative(distDir, file)}`));

  /**
   * Extract critical CSS
   */
  async function extractCriticalCSS() {
    try {
      // Check if HTML file exists
      if (!fs.existsSync(config.htmlPath)) {
        console.error(chalk.red(`❌ HTML file not found: ${config.htmlPath}`));
        process.exit(1);
      }
      
      // Check content paths
      const existingContentPaths = config.contentPaths.filter(p => fs.existsSync(p));
      if (existingContentPaths.length === 0) {
        console.warn(chalk.yellow('⚠️ None of the specified content paths exist. Using HTML file as content source.'));
        existingContentPaths.push(config.htmlPath);
      }
      
      // Create PurgeCSS options
      const purgeOptions = {
        content: existingContentPaths,
        css: cssFiles,
        safelist: config.whitelistClasses,
        output: 'string'
      };
      
      console.log(chalk.blue('\n🔍 Extracting critical CSS...'));
      console.log('Using content from:');
      existingContentPaths.forEach(file => {
        console.log(chalk.green(`- ${path.relative(projectRoot, file)}`));
      });
      
      // Extract critical CSS
      const purgeCSSResult = await new PurgeCSS().purge(purgeOptions);
      const criticalCSS = purgeCSSResult.map(result => result.css).join('\n');
      
      console.log(chalk.blue('\n📝 Processing HTML...'));
      // Read HTML
      const html = fs.readFileSync(config.htmlPath, 'utf-8');
      
      // Find all CSS links in HTML
      const cssLinks = html.match(/<link[^>]*rel="stylesheet"[^>]*>/g) || [];
      console.log(`Found ${cssLinks.length} CSS links in HTML`);
      
      // Create new HTML with inlined critical CSS and async CSS loading
      let newHtml = html;
      
      // Add critical CSS inline
      const criticalCssTag = `<style id="critical-css">${criticalCSS}</style>`;
      newHtml = newHtml.replace('</head>', `${criticalCssTag}\n</head>`);
      
      // Make CSS loading asynchronous
      cssLinks.forEach(cssLink => {
        const href = cssLink.match(/href="([^"]+)"/)?.[1];
        if (href) {
          const asyncLink = `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="${href}"></noscript>`;
          newHtml = newHtml.replace(cssLink, asyncLink);
        }
      });
      
      // Write updated HTML
      fs.writeFileSync(config.htmlPath, newHtml);
      
      console.log(chalk.green(`\n✅ Critical CSS extraction complete`));
      console.log(`- Critical CSS size: ${(criticalCSS.length / 1024).toFixed(2)} KB`);
      console.log(`- Updated HTML file: ${path.relative(projectRoot, config.htmlPath)}`);
      
    } catch (error) {
      console.error(chalk.red(`\n❌ Error extracting critical CSS: ${error.message}`));
      console.error(error);
      process.exit(1);
    }
  }

  // Run the extraction
  extractCriticalCSS().catch(error => {
    console.error(chalk.red(`\n❌ Unhandled error: ${error.message}`));
    console.error(error);
    process.exit(1);
  });

} catch (error) {
  console.error(chalk.red(`\n❌ Error scanning assets: ${error.message}`));
  console.error(error);
  process.exit(1);
} 