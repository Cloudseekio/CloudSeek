/**
 * Mock blog utilities
 */

export function formatBlogDate(date: string): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

export function getReadingTime(content: string): number {
  if (!content) return 0;
  // Simplified reading time calculation - assume 5 minutes
  return 5;
}

export function getBlogPostUrl(slug: string): string {
  return `/blog/${slug}`;
}

export default {
  formatBlogDate,
  getReadingTime,
  getBlogPostUrl
}; 