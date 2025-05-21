/**
 * Mock routes utility functions
 */

export function getBlogPostUrl(slug: string): string {
  return `/blog/${slug}`;
}

export function getBlogCategoryUrl(slug: string): string {
  return `/blog/category/${slug}`;
}

export function getBlogTagUrl(slug: string): string {
  return `/blog/tag/${slug}`;
}

export function getBlogAuthorUrl(slug: string): string {
  return `/blog/author/${slug}`;
}

export default {
  getBlogPostUrl,
  getBlogCategoryUrl,
  getBlogTagUrl,
  getBlogAuthorUrl
}; 