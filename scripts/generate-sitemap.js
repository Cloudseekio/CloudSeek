#!/usr/bin/env node

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the site URL
const SITE_URL = 'https://cloudseek.io';

// Mock blog categories (from src/services/blogService.ts)
const mockCategories = [
  {
    id: 'salesforce-ai',
    name: 'Salesforce AI',
    slug: 'salesforce-ai',
    description: 'Articles about Salesforce AI and Einstein capabilities'
  },
  {
    id: 'implementation',
    name: 'Implementation',
    slug: 'implementation',
    description: 'Articles about implementing Salesforce solutions'
  },
  {
    id: 'development',
    name: 'Development',
    slug: 'development',
    description: 'Articles about software development techniques and best practices'
  },
  {
    id: 'customer-360',
    name: 'Customer 360',
    slug: 'customer-360',
    description: 'Articles about Salesforce Customer 360 platform'
  },
  {
    id: 'consulting',
    name: 'Consulting',
    slug: 'consulting',
    description: 'Articles about Salesforce consulting best practices'
  }
];

// Mock blog posts data (simplified version based on the actual data structure)
const mockBlogPosts = [
  {
    id: "1",
    title: "5 Ways Salesforce Einstein AI is Transforming CRM in 2025",
    slug: "salesforce-einstein-ai-transforming-crm-2025",
    publishDate: "2025-03-15T08:00:00Z",
    modifiedDate: "2025-03-15T10:30:00Z"
  },
  {
    id: "2",
    title: "The Complete Guide to Salesforce Customer 360: Unifying Your Business",
    slug: "complete-guide-salesforce-customer-360",
    publishDate: "2025-03-10T08:00:00Z",
    modifiedDate: "2025-03-10T10:30:00Z"
  },
  {
    id: "3",
    title: "Salesforce Implementation Best Practices for 2025",
    slug: "salesforce-implementation-best-practices-2025",
    publishDate: "2025-03-05T08:00:00Z",
    modifiedDate: "2025-03-05T10:30:00Z"
  }
];

// Helper function to get canonical blog post URL
const getCanonicalBlogPostUrl = (slug) => `/blog/${slug}`;

// Generate sitemap function (based on src/utils/sitemap.ts)
const generateSitemap = (posts, categories) => {
  const siteUrl = SITE_URL;
  const now = new Date().toISOString();
  
  // Static pages
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'weekly' },
    { url: '/services', priority: 0.8, changefreq: 'monthly' },
    { url: '/services/salesforce-implementation', priority: 0.8, changefreq: 'monthly' },
    { url: '/services/custom-salesforce-solutions', priority: 0.8, changefreq: 'monthly' },
    { url: '/services/salesforce-consulting', priority: 0.8, changefreq: 'monthly' },
    { url: '/services/strategic-digital-marketing', priority: 0.8, changefreq: 'monthly' },
    { url: '/services/web-design', priority: 0.8, changefreq: 'monthly' },
    { url: '/services/mobile-development', priority: 0.8, changefreq: 'monthly' },
    { url: '/blog', priority: 0.9, changefreq: 'daily' },
    { url: '/case-studies', priority: 0.8, changefreq: 'monthly' },
    { url: '/case-studies/luxe-properties', priority: 0.7, changefreq: 'monthly' },
    { url: '/case-studies/techforward-customer-lifetime-value', priority: 0.7, changefreq: 'monthly' },
    { url: '/case-studies/coastal-developments', priority: 0.7, changefreq: 'monthly' },
    { url: '/about', priority: 0.7, changefreq: 'monthly' },
    { url: '/contact', priority: 0.7, changefreq: 'monthly' },
    { url: '/company', priority: 0.7, changefreq: 'monthly' },
    { url: '/careers', priority: 0.7, changefreq: 'monthly' },
    { url: '/customers', priority: 0.7, changefreq: 'monthly' }
  ];
  
  // Blog posts - Only include canonical URLs (/blog/:slug)
  const blogUrls = posts.map(post => {
    const lastmod = post.modifiedDate || post.publishDate;
    return `
      <url>
        <loc>${siteUrl}${getCanonicalBlogPostUrl(post.slug)}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>
    `;
  });
  
  // Categories
  const categoryUrls = categories.map(category => `
    <url>
      <loc>${siteUrl}/blog?category=${encodeURIComponent(category.slug)}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.6</priority>
    </url>
  `);
  
  // Static pages
  const staticUrls = staticPages.map(page => `
    <url>
      <loc>${siteUrl}${page.url}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>
  `);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls.join('')}
  ${blogUrls.join('')}
  ${categoryUrls.join('')}
</urlset>`;
};

// Main function to generate and write sitemap
async function generateSitemapFile() {
  try {
    console.log('🚀 Generating sitemap.xml...');
    
    // Generate the sitemap XML
    const sitemapXml = generateSitemap(mockBlogPosts, mockCategories);
    
    // Ensure the public directory exists
    const publicDir = join(__dirname, '..', 'public');
    mkdirSync(publicDir, { recursive: true });
    
    // Write the sitemap to public/sitemap.xml
    const sitemapPath = join(publicDir, 'sitemap.xml');
    writeFileSync(sitemapPath, sitemapXml, 'utf8');
    
    console.log('✅ Sitemap generated successfully at:', sitemapPath);
    console.log(`📊 Generated sitemap with ${mockBlogPosts.length} blog posts and ${mockCategories.length} categories`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the script
generateSitemapFile(); 