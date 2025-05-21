import { format, parseISO } from 'date-fns';
import { BlogPost } from '../models/Blog';

// Format date in a consistent way across the blog
export const formatBlogDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMMM d, yyyy');
  } catch (error) {
    console.error('Invalid date format:', error);
    return dateString;
  }
};

// Calculate estimated reading time
export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Generate a URL-friendly slug from a string
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();
};

// Extract excerpt from content
export const extractExcerpt = (content: string, maxLength: number = 160): string => {
  // If content is blank, return empty string
  if (!content) return '';
  
  // Remove markdown formatting
  const cleanContent = content
    .replace(/#+\s+(.*)\n/g, '$1 ')    // Remove headings
    .replace(/\*\*(.*?)\*\*/g, '$1')   // Remove bold
    .replace(/\*(.*?)\*/g, '$1')       // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')// Remove links
    .replace(/```.*?```/gs, '')        // Remove code blocks
    .replace(/`(.*?)`/g, '$1')         // Remove inline code
    .replace(/!\[(.*?)\]\(.*?\)/g, '') // Remove images
    .trim();
  
  // If the cleaned content is shorter than maxLength, return it
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  // Otherwise, truncate at the last space before maxLength
  const truncated = cleanContent.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  // If no spaces found, just truncate
  return truncated + '...';
};

// Get a list of popular tags based on post count
export const getPopularTags = (posts: BlogPost[], limit: number = 10): string[] => {
  const tagCounts: Record<string, number> = {};
  
  // Count occurrences of each tag
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  // Sort tags by count and limit to the requested number
  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
}; 