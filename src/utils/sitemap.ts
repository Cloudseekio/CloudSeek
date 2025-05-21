import { BlogPost, BlogCategory } from '../models/Blog';
import { getCanonicalBlogPostUrl } from './routes';

/**
 * Generate a sitemap XML string for the entire site
 */
export const generateSitemap = (posts: BlogPost[], categories: BlogCategory[]): string => {
  const siteUrl = 'https://cloudseek.io';
  const now = new Date().toISOString();
  
  // Static pages
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'weekly' },
    { url: '/services', priority: 0.8, changefreq: 'monthly' },
    { url: '/blog', priority: 0.9, changefreq: 'daily' },
    // Note: We don't include /blogs in the sitemap to avoid duplicate content
    { url: '/case-studies', priority: 0.8, changefreq: 'monthly' },
    { url: '/about', priority: 0.7, changefreq: 'monthly' },
    { url: '/contact', priority: 0.7, changefreq: 'monthly' },
    // ...other pages
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