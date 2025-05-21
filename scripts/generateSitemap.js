#!/usr/bin/env node

/**
 * Sitemap Generator
 * 
 * This script:
 * 1. Extracts routes from the React Router configuration in App.tsx (or uses hardcoded routes)
 * 2. Generates a properly formatted sitemap.xml file
 * 3. Adds priority and changefreq attributes based on page importance
 * 4. Places the output in the public directory
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configuration
const config = {
  // Source file with routes
  routesFile: path.join(projectRoot, 'src', 'App.tsx'),
  // Output file for sitemap
  outputFile: path.join(projectRoot, 'public', 'sitemap.xml'),
  // Site URL, replace with your production domain
  siteUrl: 'https://cloudseek.io',
  // Last modification date (defaults to today)
  lastmod: new Date().toISOString().split('T')[0],
  // Default values for pages
  defaultConfig: {
    priority: 0.5,
    changefreq: 'monthly'
  },
  // Page-specific configurations, ordered by priority
  pageConfigs: [
    // Home page has highest priority and changes frequently
    {
      path: '/',
      priority: 1.0,
      changefreq: 'daily',
      lastmod: new Date().toISOString().split('T')[0]
    },
    // Main product/service pages
    {
      path: '/services',
      priority: 0.9,
      changefreq: 'weekly'
    },
    {
      pathRegex: /^\/services\/.+$/,
      priority: 0.8,
      changefreq: 'weekly'
    },
    // Blog and content pages
    {
      path: '/blog',
      priority: 0.8,
      changefreq: 'daily'
    },
    {
      pathRegex: /^\/blog\/.+$/,
      priority: 0.7,
      changefreq: 'weekly'
    },
    // Case studies
    {
      path: '/case-studies',
      priority: 0.8,
      changefreq: 'weekly'
    },
    {
      pathRegex: /^\/case-studies\/.+$/,
      priority: 0.7,
      changefreq: 'monthly'
    },
    // Company pages
    {
      path: '/company',
      priority: 0.6,
      changefreq: 'monthly'
    },
    {
      path: '/careers',
      priority: 0.6,
      changefreq: 'weekly'
    },
    // Contact page
    {
      path: '/contact',
      priority: 0.8,
      changefreq: 'monthly'
    }
  ],
  // Routes to exclude from sitemap
  excludeRoutes: [
    '/admin',
    '/login',
    '/dashboard',
    '/register',
    '/account'
  ],
  // Routes that should be added manually (not in React Router)
  additionalRoutes: [
    // Main pages
    '/',
    '/services',
    '/services/salesforce-implementation',
    '/services/custom-salesforce-solutions',
    '/services/salesforce-consulting',
    '/services/strategic-digital-marketing',
    '/services/web-design',
    '/services/mobile-development',
    '/blog',
    '/case-studies',
    '/case-studies/luxe-properties',
    '/case-studies/techforward-customer-lifetime-value',
    '/case-studies/coastal-developments',
    '/company',
    '/careers',
    '/contact'
  ]
};

/**
 * Escape special XML characters
 */
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Extract routes from App.tsx file
 */
function extractRoutes() {
  try {
    console.log(chalk.blue('📖 Extracting routes from App.tsx...'));
    
    // Check if routes file exists
    if (!fs.existsSync(config.routesFile)) {
      console.warn(chalk.yellow('⚠️ Routes file not found. Using hardcoded routes.'));
      return config.additionalRoutes;
    }
    
    const routesContent = fs.readFileSync(config.routesFile, 'utf8');
    
    // Find all Route components and extract their path props
    // This regex looks for <Route path="..." or <Route exact path="..." patterns
    const routeRegex = /<Route[^>]*path=["']([^"']+)["'][^>]*>/g;
    const routes = [];
    let match;
    
    while ((match = routeRegex.exec(routesContent)) !== null) {
      routes.push(match[1]);
    }
    
    // Also try to find paths in createBrowserRouter format
    const objectRouteRegex = /path:\s*["']([^"']+)["']/g;
    while ((match = objectRouteRegex.exec(routesContent)) !== null) {
      routes.push(match[1]);
    }
    
    // If using React Router v6 in a different format, try to capture those
    const jsxRouteRegex = /element={<[^>]+>}\s*path=["']([^"']+)["']/g;
    while ((match = jsxRouteRegex.exec(routesContent)) !== null) {
      routes.push(match[1]);
    }
    
    // Filter out routes with path parameters like :id (or include them as patterns)
    const cleanRoutes = routes
      .filter(route => !config.excludeRoutes.includes(route))
      .map(route => {
        // Replace route parameters with a generic value
        // e.g., /blog/:slug becomes /blog/post-title
        return route.replace(/:(\w+)/g, (_, paramName) => {
          switch (paramName) {
            case 'slug':
            case 'postId':
              return 'post-title';
            case 'id':
              return '1';
            case 'category':
              return 'category-name';
            default:
              return paramName;
          }
        });
      });
    
    // Add manual routes
    const allRoutes = [...new Set([...cleanRoutes, ...config.additionalRoutes])];
    
    console.log(chalk.green(`✅ Found ${allRoutes.length} routes`));
    
    // If no routes found in the file, use the hardcoded ones
    if (allRoutes.length === 0) {
      console.warn(chalk.yellow('⚠️ No routes found in App.tsx. Using hardcoded routes.'));
      return config.additionalRoutes;
    }
    
    return allRoutes;
  } catch (error) {
    console.error(chalk.red(`❌ Error extracting routes: ${error.message}`));
    console.error(error);
    console.warn(chalk.yellow('⚠️ Falling back to hardcoded routes.'));
    return config.additionalRoutes; // Fallback to hardcoded routes
  }
}

/**
 * Get configuration for a specific route
 */
function getRouteConfig(route) {
  // Look for exact path match first
  const exactMatch = config.pageConfigs.find(page => page.path === route);
  if (exactMatch) {
    return {
      ...config.defaultConfig,
      ...exactMatch
    };
  }
  
  // Then try regex patterns
  const patternMatch = config.pageConfigs.find(
    page => page.pathRegex && page.pathRegex.test(route)
  );
  
  if (patternMatch) {
    return {
      ...config.defaultConfig,
      ...patternMatch
    };
  }
  
  // Default configuration
  return config.defaultConfig;
}

/**
 * Generate the sitemap XML
 */
function generateSitemap(routes) {
  try {
    console.log(chalk.blue('🔨 Generating sitemap.xml...'));
    
    // Start building the XML
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add each URL
    routes.forEach(route => {
      const { priority, changefreq } = getRouteConfig(route);
      
      // Ensure the route starts with a slash
      const normRoute = route.startsWith('/') ? route : `/${route}`;
      
      // Combine with site URL
      const url = `${config.siteUrl}${normRoute}`;
      
      sitemap += '  <url>\n';
      sitemap += `    <loc>${escapeXml(url)}</loc>\n`;
      sitemap += `    <lastmod>${config.lastmod}</lastmod>\n`;
      sitemap += `    <priority>${priority}</priority>\n`;
      sitemap += `    <changefreq>${changefreq}</changefreq>\n`;
      sitemap += '  </url>\n';
    });
    
    // Close the XML
    sitemap += '</urlset>';
    
    // Ensure the public directory exists
    const publicDir = path.dirname(config.outputFile);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Write to file
    fs.writeFileSync(config.outputFile, sitemap);
    
    console.log(chalk.green(`✅ Sitemap generated at ${config.outputFile}`));
    
    return true;
  } catch (error) {
    console.error(chalk.red(`❌ Error generating sitemap: ${error.message}`));
    console.error(error);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log(chalk.blue('🚀 Starting sitemap generation...'));
  
  // Extract routes
  const routes = extractRoutes();
  
  if (routes.length === 0) {
    console.error(chalk.red('❌ No routes found. Please check your App.tsx file.'));
    process.exit(1);
  }
  
  // Generate sitemap
  const success = generateSitemap(routes);
  
  if (success) {
    console.log(chalk.green('✅ Sitemap generation completed successfully!'));
  } else {
    console.error(chalk.red('❌ Sitemap generation failed.'));
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error(chalk.red(`❌ Unhandled error: ${error.message}`));
  console.error(error);
  process.exit(1);
}); 