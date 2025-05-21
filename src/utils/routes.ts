/**
 * Helper functions for blog routes
 */

// Flag to control which URL format to use for generating links
// This allows us to easily switch the link format while keeping redirects
const USE_BLOG_SINGULAR = true;

// Base URL for blog
export const getBlogBaseUrl = (): string => {
  return USE_BLOG_SINGULAR ? '/blog' : '/blogs';
};

// Generate blog post URL
export const getBlogPostUrl = (slug: string): string => {
  return `${getBlogBaseUrl()}/${slug}`;
};

// Generate canonical blog post URL (always uses /blog for SEO purposes)
export const getCanonicalBlogPostUrl = (slug: string): string => {
  return `/blog/${slug}`;
};

// Generate category filter URL
export const getBlogCategoryUrl = (category: string): string => {
  return `${getBlogBaseUrl()}?category=${encodeURIComponent(category)}`;
};

// Generate tag filter URL
export const getBlogTagUrl = (tag: string): string => {
  return `${getBlogBaseUrl()}?tag=${encodeURIComponent(tag)}`;
};

// Generate search URL
export const getBlogSearchUrl = (query: string): string => {
  return `${getBlogBaseUrl()}?q=${encodeURIComponent(query)}`;
};

// Canonical blog base URL (for SEO)
export const getCanonicalBlogBaseUrl = (): string => {
  return '/blog';
}; 