#!/usr/bin/env node

/**
 * Pre-Deployment Checklist Script
 * 
 * This script runs a series of checks to ensure the website is ready for production deployment:
 * 1. Verifies all assets are properly optimized (images, JS, CSS)
 * 2. Checks for console.log statements in production code
 * 3. Validates meta tags and schema markup
 * 4. Runs Lighthouse and ensures minimum scores
 * 5. Verifies critical user flows
 * 6. Checks for broken links and image references
 * 
 * Run with: npm run pre-check
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import glob from 'glob';
import chalk from 'chalk';
import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import { URL } from 'url';
import sharp from 'sharp';
import validator from 'html-validator';

// Configuration
const config = {
  // Base URL for the site (for Lighthouse and broken links)
  baseUrl: 'http://localhost:5173',
  
  // Minimum Lighthouse scores (0-100)
  lighthouseThresholds: {
    performance: 80,
    accessibility: 90,
    'best-practices': 85,
    seo: 90,
  },
  
  // File patterns to check for console.logs
  jsFilesToCheck: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
  
  // Critical user flows to check
  criticalFlows: [
    { name: 'Homepage Load', path: '/' },
    { name: 'Blog Page', path: '/blog' },
    // Add more critical paths as needed
  ],
  
  // Assets optimization checks
  assetChecks: {
    // Image formats to verify
    imageExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    // Min compression ratio for images (original/optimized)
    minImageCompressionRatio: 0.7,
    // Max image size in KB
    maxImageSizeKB: 200,
  },
};

// Statistics and reporting
const stats = {
  checks: {
    passed: 0,
    failed: 0,
    warnings: 0,
  },
  details: {
    consoleLogCount: 0,
    unoptimizedImageCount: 0,
    brokenLinksCount: 0,
    metaTagIssuesCount: 0,
    criticalFlowsFailedCount: 0,
    lighthouseFailures: [],
  },
  errorMessages: [],
  warningMessages: [],
};

/**
 * Runs all pre-deployment checks and reports results
 */
async function runAllChecks() {
  console.log(chalk.cyan('\n🔍 Starting Pre-Deployment Checks\n'));
  
  try {
    // Build the site for testing - use a quick development build
    await buildSiteForTesting();
    
    // Run all checks in parallel for efficiency
    await Promise.all([
      checkConsoleLogStatements(),
      checkImageOptimization(),
      checkMinification(),
    ]);
    
    // These checks need to be run serially as they depend on the site being served
    await startDevServer();
    await checkMetaTagsAndSchema();
    await checkLighthouseScores();
    await checkCriticalUserFlows();
    await checkBrokenLinks();
    await stopDevServer();
    
    // Report results
    reportResults();
    
    // Exit with appropriate code
    if (stats.checks.failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error(chalk.red(`\n❌ Pre-deployment checks failed: ${error.message}`));
    console.error(error);
    process.exit(1);
  }
}

/**
 * Builds the site for testing purposes
 */
async function buildSiteForTesting() {
  console.log(chalk.cyan('📦 Building site for testing...'));
  
  try {
    // Use a fast development build for testing
    execSync('npm run build -- --mode development', { stdio: 'inherit' });
    console.log(chalk.green('✅ Build completed successfully'));
    stats.checks.passed++;
  } catch (error) {
    console.error(chalk.red('❌ Build failed'));
    stats.checks.failed++;
    throw new Error('Build failed, cannot proceed with checks');
  }
}

/**
 * Start a development server for testing
 */
let serverProcess;
async function startDevServer() {
  console.log(chalk.cyan('🚀 Starting development server...'));
  
  return new Promise((resolve, reject) => {
    try {
      // Start the server in the background (adapt command based on your setup)
      serverProcess = require('child_process').spawn('npm', ['run', 'preview'], {
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: true,
      });
      
      // Wait for server to start
      let output = '';
      serverProcess.stdout.on('data', (data) => {
        output += data.toString();
        if (output.includes('Local:') || output.includes('ready in')) {
          console.log(chalk.green('✅ Development server started'));
          // Wait a bit more for the server to fully initialize
          setTimeout(resolve, 2000);
        }
      });
      
      serverProcess.stderr.on('data', (data) => {
        console.error(data.toString());
      });
      
      // Set a timeout in case the server doesn't start properly
      setTimeout(() => {
        reject(new Error('Server start timeout'));
      }, 30000);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Stop the development server
 */
async function stopDevServer() {
  if (serverProcess) {
    // Kill the server process and all its children
    if (process.platform === 'win32') {
      execSync(`taskkill /pid ${serverProcess.pid} /T /F`, { stdio: 'ignore' });
    } else {
      process.kill(-serverProcess.pid);
    }
    console.log(chalk.cyan('🛑 Development server stopped'));
  }
}

/**
 * Check for console.log statements in production code
 */
async function checkConsoleLogStatements() {
  console.log(chalk.cyan('\n🔍 Checking for console.log statements in production code...'));
  
  let foundConsoleLogs = 0;
  
  for (const pattern of config.jsFilesToCheck) {
    const files = glob.sync(pattern);
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Regular expression to find console.log statements
      // This regex looks for console.log that isn't commented out
      const regex = /^(?!.*\/\/).*console\.log\(/gm;
      
      const matches = content.match(regex);
      
      if (matches) {
        foundConsoleLogs += matches.length;
        stats.warningMessages.push(`${file} contains ${matches.length} console.log statement(s)`);
      }
    }
  }
  
  stats.details.consoleLogCount = foundConsoleLogs;
  
  if (foundConsoleLogs > 0) {
    console.log(chalk.yellow(`⚠️ Found ${foundConsoleLogs} console.log statements in production code`));
    stats.checks.warnings++;
  } else {
    console.log(chalk.green('✅ No console.log statements found'));
    stats.checks.passed++;
  }
}

/**
 * Check if images are properly optimized
 */
async function checkImageOptimization() {
  console.log(chalk.cyan('\n🔍 Checking image optimization...'));
  
  const imageFiles = [];
  config.assetChecks.imageExtensions.forEach(ext => {
    const files = glob.sync(`public/**/*${ext}`);
    imageFiles.push(...files);
  });
  
  const unoptimizedImages = [];
  
  for (const file of imageFiles) {
    try {
      const stats = fs.statSync(file);
      const fileSizeKB = stats.size / 1024;
      
      if (fileSizeKB > config.assetChecks.maxImageSizeKB) {
        unoptimizedImages.push({ file, size: fileSizeKB, reason: 'Size exceeds limit' });
        continue;
      }
      
      // Check if image is WebP for optimal format
      const ext = path.extname(file).toLowerCase();
      if (ext !== '.webp' && ext !== '.svg') {
        // Check if WebP version exists
        const webpFile = file.slice(0, file.lastIndexOf('.')) + '.webp';
        if (!fs.existsSync(webpFile)) {
          unoptimizedImages.push({ file, size: fileSizeKB, reason: 'No WebP version available' });
        }
      }
      
      // For more advanced checks, we can use sharp to analyze the image
      if (ext !== '.svg' && ext !== '.gif') {
        const metadata = await sharp(file).metadata();
        if (metadata.width > 2000 || metadata.height > 2000) {
          unoptimizedImages.push({ file, size: fileSizeKB, reason: 'Image dimensions too large' });
        }
      }
      
    } catch (error) {
      stats.errorMessages.push(`Error processing image ${file}: ${error.message}`);
    }
  }
  
  stats.details.unoptimizedImageCount = unoptimizedImages.length;
  
  if (unoptimizedImages.length > 0) {
    console.log(chalk.yellow(`⚠️ Found ${unoptimizedImages.length} unoptimized images:`));
    unoptimizedImages.forEach(img => {
      console.log(chalk.yellow(`  - ${img.file} (${Math.round(img.size)}KB): ${img.reason}`));
      stats.warningMessages.push(`Unoptimized image: ${img.file} (${Math.round(img.size)}KB): ${img.reason}`);
    });
    stats.checks.warnings++;
  } else {
    console.log(chalk.green(`✅ All ${imageFiles.length} images are optimized`));
    stats.checks.passed++;
  }
}

/**
 * Check if JS and CSS files are minified
 */
async function checkMinification() {
  console.log(chalk.cyan('\n🔍 Checking JS/CSS minification...'));
  
  // Check dist folder after build
  const jsFiles = glob.sync('dist/assets/**/*.js');
  const cssFiles = glob.sync('dist/assets/**/*.css');
  
  const unminifiedFiles = [];
  
  // Simple heuristic: minified files shouldn't have many newlines relative to file size
  // This isn't perfect but catches obvious issues
  const checkFile = (file) => {
    const content = fs.readFileSync(file, 'utf8');
    const newlineRatio = (content.match(/\n/g) || []).length / content.length;
    
    // Heuristic: If more than 1% of the file is newlines, it might not be minified
    if (newlineRatio > 0.01) {
      unminifiedFiles.push({ file, ratio: newlineRatio });
    }
  };
  
  jsFiles.forEach(checkFile);
  cssFiles.forEach(checkFile);
  
  if (unminifiedFiles.length > 0) {
    console.log(chalk.yellow(`⚠️ Found ${unminifiedFiles.length} potentially unminified files:`));
    unminifiedFiles.forEach(file => {
      console.log(chalk.yellow(`  - ${file.file}`));
      stats.warningMessages.push(`Potentially unminified file: ${file.file}`);
    });
    stats.checks.warnings++;
  } else {
    console.log(chalk.green(`✅ All ${jsFiles.length + cssFiles.length} JS/CSS files appear to be minified`));
    stats.checks.passed++;
  }
}

/**
 * Validate meta tags and schema markup
 */
async function checkMetaTagsAndSchema() {
  console.log(chalk.cyan('\n🔍 Validating meta tags and schema markup...'));
  
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    // Visit the homepage
    await page.goto(config.baseUrl, { waitUntil: 'networkidle0' });
    
    // Check meta tags
    const metaTags = await page.evaluate(() => {
      const metas = {};
      document.querySelectorAll('meta').forEach(meta => {
        const name = meta.getAttribute('name') || meta.getAttribute('property');
        if (name) metas[name] = meta.getAttribute('content');
      });
      return metas;
    });
    
    // Required meta tags for SEO
    const requiredMetaTags = [
      'description',
      'og:title',
      'og:description',
      'og:image',
      'twitter:card'
    ];
    
    const missingMetaTags = requiredMetaTags.filter(tag => !metaTags[tag]);
    
    // Check for schema markup
    const schemaMarkup = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      return scripts.map(script => {
        try {
          return JSON.parse(script.textContent);
        } catch (e) {
          return { error: true, message: e.message };
        }
      });
    });
    
    const invalidSchemas = schemaMarkup.filter(schema => schema.error);
    const hasSchemaMarkup = schemaMarkup.length > 0 && invalidSchemas.length === 0;
    
    if (missingMetaTags.length > 0 || invalidSchemas.length > 0 || !hasSchemaMarkup) {
      if (missingMetaTags.length > 0) {
        console.log(chalk.yellow(`⚠️ Missing ${missingMetaTags.length} required meta tags: ${missingMetaTags.join(', ')}`));
        stats.warningMessages.push(`Missing meta tags: ${missingMetaTags.join(', ')}`);
      }
      
      if (!hasSchemaMarkup) {
        console.log(chalk.yellow('⚠️ No valid schema markup found on homepage'));
        stats.warningMessages.push('No valid schema markup found on homepage');
      }
      
      if (invalidSchemas.length > 0) {
        console.log(chalk.yellow(`⚠️ Found ${invalidSchemas.length} invalid schema markup scripts`));
        stats.warningMessages.push(`Invalid schema markup detected`);
      }
      
      stats.checks.warnings++;
    } else {
      console.log(chalk.green('✅ Meta tags and schema markup validation passed'));
      stats.checks.passed++;
    }
  } catch (error) {
    console.error(chalk.red(`❌ Error validating meta tags: ${error.message}`));
    stats.errorMessages.push(`Meta tag validation error: ${error.message}`);
    stats.checks.failed++;
  } finally {
    await browser.close();
  }
}

/**
 * Run Lighthouse and check scores
 */
async function checkLighthouseScores() {
  console.log(chalk.cyan('\n🔍 Running Lighthouse audit...'));
  
  const browser = await puppeteer.launch({ headless: "new" });
  
  try {
    const { port } = new URL(config.baseUrl);
    
    const options = {
      port: (new URL(browser.wsEndpoint())).port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    };
    
    const lhUrl = config.baseUrl;
    const runnerResult = await lighthouse(lhUrl, options);
    const lhReport = runnerResult.report;
    
    // Save the report to a file for reference
    fs.writeFileSync('lighthouse-report.json', lhReport);
    
    const categories = runnerResult.lhr.categories;
    const scores = {
      performance: categories.performance.score * 100,
      accessibility: categories.accessibility.score * 100,
      'best-practices': categories['best-practices'].score * 100,
      seo: categories.seo.score * 100,
    };
    
    console.log(chalk.blue('\nLighthouse Scores:'));
    console.log(chalk.blue('-------------------'));
    
    let allScoresPass = true;
    
    for (const [category, score] of Object.entries(scores)) {
      const threshold = config.lighthouseThresholds[category];
      const roundedScore = Math.round(score);
      
      if (roundedScore >= threshold) {
        console.log(chalk.green(`✅ ${category}: ${roundedScore}/100 (threshold: ${threshold})`));
      } else {
        console.log(chalk.red(`❌ ${category}: ${roundedScore}/100 (threshold: ${threshold})`));
        allScoresPass = false;
        stats.details.lighthouseFailures.push({ category, score: roundedScore, threshold });
      }
    }
    
    if (allScoresPass) {
      console.log(chalk.green('\n✅ All Lighthouse scores meet or exceed thresholds'));
      stats.checks.passed++;
    } else {
      console.log(chalk.red('\n❌ Some Lighthouse scores are below thresholds'));
      stats.checks.failed++;
      stats.errorMessages.push(`Lighthouse score failures: ${stats.details.lighthouseFailures.map(f => `${f.category}=${f.score}/${f.threshold}`).join(', ')}`);
    }
  } catch (error) {
    console.error(chalk.red(`❌ Error running Lighthouse: ${error.message}`));
    stats.checks.failed++;
    stats.errorMessages.push(`Lighthouse error: ${error.message}`);
  } finally {
    await browser.close();
  }
}

/**
 * Verify critical user flows
 */
async function checkCriticalUserFlows() {
  console.log(chalk.cyan('\n🔍 Verifying critical user flows...'));
  
  const browser = await puppeteer.launch({ headless: "new" });
  const failedFlows = [];
  
  for (const flow of config.criticalFlows) {
    try {
      console.log(chalk.blue(`Testing flow: ${flow.name} (${flow.path})`));
      
      const page = await browser.newPage();
      const response = await page.goto(`${config.baseUrl}${flow.path}`, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });
      
      if (!response.ok()) {
        console.log(chalk.red(`❌ Flow failed: ${flow.name} - Status code: ${response.status()}`));
        failedFlows.push({ name: flow.name, path: flow.path, status: response.status() });
        continue;
      }
      
      // Check for client-side errors
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      
      // Check for React error boundaries
      const hasErrorBoundary = await page.evaluate(() => {
        return document.querySelector('.error-boundary') !== null ||
               document.querySelector('[data-testid="error-boundary"]') !== null;
      });
      
      if (errors.length > 0 || hasErrorBoundary) {
        console.log(chalk.red(`❌ Flow has errors: ${flow.name} - ${errors.length} JS errors`));
        failedFlows.push({ name: flow.name, path: flow.path, errors });
        continue;
      }
      
      // Custom checks for specific flows can be added here
      // e.g., checking form submission, login, etc.
      
      console.log(chalk.green(`✅ Flow passed: ${flow.name}`));
      await page.close();
    } catch (error) {
      console.log(chalk.red(`❌ Error testing flow ${flow.name}: ${error.message}`));
      failedFlows.push({ name: flow.name, path: flow.path, error: error.message });
    }
  }
  
  stats.details.criticalFlowsFailedCount = failedFlows.length;
  
  if (failedFlows.length === 0) {
    console.log(chalk.green(`✅ All ${config.criticalFlows.length} critical user flows passed`));
    stats.checks.passed++;
  } else {
    console.log(chalk.red(`❌ ${failedFlows.length}/${config.criticalFlows.length} critical user flows failed`));
    failedFlows.forEach(flow => {
      stats.errorMessages.push(`Failed flow: ${flow.name} (${flow.path}) - ${flow.error || flow.status || 'Unknown error'}`);
    });
    stats.checks.failed++;
  }
  
  await browser.close();
}

/**
 * Check for broken links and image references
 */
async function checkBrokenLinks() {
  console.log(chalk.cyan('\n🔍 Checking for broken links and image references...'));
  
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    await page.goto(config.baseUrl, { waitUntil: 'networkidle0' });
    
    // Find all links and images on the page
    const links = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a[href]'))
        .map(a => ({ type: 'link', url: a.href, text: a.textContent.trim() }));
      
      const images = Array.from(document.querySelectorAll('img[src]'))
        .map(img => ({ type: 'image', url: img.src, alt: img.alt }));
      
      return [...anchors, ...images];
    });
    
    // Filter out external links and data URLs
    const internalResources = links.filter(link => {
      try {
        const url = new URL(link.url);
        return url.hostname === new URL(config.baseUrl).hostname && !link.url.startsWith('data:');
      } catch (e) {
        return false;
      }
    });
    
    // Check each internal link
    const brokenResources = [];
    for (const resource of internalResources) {
      try {
        const response = await page.goto(resource.url, { waitUntil: 'networkidle0', timeout: 10000 });
        if (!response.ok()) {
          brokenResources.push({
            ...resource,
            status: response.status(),
          });
        }
        await page.goBack({ waitUntil: 'networkidle0' });
      } catch (error) {
        brokenResources.push({
          ...resource,
          error: error.message,
        });
      }
    }
    
    stats.details.brokenLinksCount = brokenResources.length;
    
    if (brokenResources.length > 0) {
      console.log(chalk.red(`❌ Found ${brokenResources.length} broken resources:`));
      brokenResources.forEach(resource => {
        const message = `Broken ${resource.type}: ${resource.url} - ${resource.status || resource.error}`;
        console.log(chalk.red(`  - ${message}`));
        stats.errorMessages.push(message);
      });
      stats.checks.failed++;
    } else {
      console.log(chalk.green(`✅ All ${internalResources.length} internal resources are valid`));
      stats.checks.passed++;
    }
  } catch (error) {
    console.error(chalk.red(`❌ Error checking broken links: ${error.message}`));
    stats.checks.failed++;
    stats.errorMessages.push(`Broken link check error: ${error.message}`);
  } finally {
    await browser.close();
  }
}

/**
 * Report overall results
 */
function reportResults() {
  console.log('\n');
  console.log(chalk.cyan('📊 Pre-Deployment Check Results'));
  console.log(chalk.cyan('============================'));
  
  console.log(chalk.blue(`Checks passed: ${stats.checks.passed}`));
  console.log(chalk.yellow(`Warnings: ${stats.checks.warnings}`));
  console.log(chalk.red(`Checks failed: ${stats.checks.failed}`));
  
  if (stats.errorMessages.length > 0) {
    console.log(chalk.red('\n❌ Error details:'));
    stats.errorMessages.forEach(msg => console.log(chalk.red(` - ${msg}`)));
  }
  
  if (stats.warningMessages.length > 0) {
    console.log(chalk.yellow('\n⚠️ Warning details:'));
    stats.warningMessages.forEach(msg => console.log(chalk.yellow(` - ${msg}`)));
  }
  
  if (stats.checks.failed > 0) {
    console.log(chalk.red('\n❌ Pre-deployment checks failed. Please fix the issues before deploying.'));
  } else if (stats.checks.warnings > 0) {
    console.log(chalk.yellow('\n⚠️ Pre-deployment checks passed with warnings. Review warnings before deploying.'));
  } else {
    console.log(chalk.green('\n✅ All pre-deployment checks passed! Ready to deploy.'));
  }
  
  // Save results to a file for reference
  const report = {
    timestamp: new Date().toISOString(),
    stats,
    passed: stats.checks.failed === 0,
  };
  
  fs.writeFileSync('pre-deployment-report.json', JSON.stringify(report, null, 2));
  console.log(chalk.blue('\nDetailed report saved to pre-deployment-report.json'));
}

// Run all checks
runAllChecks(); 