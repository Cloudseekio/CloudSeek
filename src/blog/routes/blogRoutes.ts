import { BlogPost } from '../types/blog';

export const BLOG_ROUTES = {
  root: '/',
  blog: '/blog',
  debug: '/blog/debug',
  debugParam: '/blog?debug=true',
  post: (slug: string) => `/blog/${slug}`,
  category: (slug: string) => `/blog/category/${slug}`,
  tag: (tag: string) => `/blog/tag/${tag}`,
  author: (slug: string) => `/blog/author/${slug}`,
} as const;

export type BlogRoute = typeof BLOG_ROUTES[keyof typeof BLOG_ROUTES];

/**
 * Check if the current route is in debug mode
 * Debug mode is enabled either by:
 * 1. Being on the debug page (/blog/debug)
 * 2. Having the debug query parameter (?debug=true)
 */
export const isDebugMode = (path: string): boolean => {
  const searchParams = new URLSearchParams(window.location.search);
  return path.includes('/blog/debug') || searchParams.get('debug') === 'true';
};

/**
 * Get the URL for a blog post
 */
export const getBlogPostUrl = (post: BlogPost): string => {
  return BLOG_ROUTES.post(post.slug);
};

/**
 * Get the debug URL for any blog route
 */
export const getDebugUrl = (path: string): string => {
  const url = new URL(path, window.location.origin);
  url.searchParams.set('debug', 'true');
  return url.pathname + url.search;
}; 