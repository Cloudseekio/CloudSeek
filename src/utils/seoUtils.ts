import { BlogPost } from '../models/Blog';

interface SiteInfo {
  name: string;
  url: string;
  logo: string;
  author: {
    name: string;
    url: string;
  };
}

// Site information for structured data
const siteInfo: SiteInfo = {
  name: 'CloudSeek',
  url: 'https://cloudseek.io',
  logo: 'https://cloudseek.io/images/logo.png',
  author: {
    name: 'CloudSeek Team',
    url: 'https://cloudseek.io/about'
  }
};

/**
 * Generate article structured data for a blog post
 */
export const generateArticleStructuredData = (post: BlogPost) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage.startsWith('http') 
      ? post.coverImage 
      : `${siteInfo.url}${post.coverImage}`,
    datePublished: post.publishDate,
    dateModified: post.modifiedDate || post.publishDate,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: post.author.url || `${siteInfo.url}/authors/${post.author.name.toLowerCase().replace(/\s+/g, '-')}`
    },
    publisher: {
      '@type': 'Organization',
      name: siteInfo.name,
      logo: {
        '@type': 'ImageObject',
        url: siteInfo.logo
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteInfo.url}/blog/${post.slug}`
    },
    keywords: post.tags.join(', ')
  };
};

/**
 * Generate breadcrumb structured data
 */
export const generateBreadcrumbStructuredData = (post: BlogPost) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteInfo.url
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${siteInfo.url}/blog`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.category,
        item: `${siteInfo.url}/blog?category=${encodeURIComponent(post.category.toLowerCase())}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: post.title,
        item: `${siteInfo.url}/blog/${post.slug}`
      }
    ]
  };
};

/**
 * Get estimated read time based on content length
 */
export const getReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

/**
 * Generate a meta description from the post content
 */
export const generateMetaDescription = (content: string, maxLength: number = 160): string => {
  // Strip markdown and HTML
  const plainText = content
    .replace(/#+\s(.*)\n/g, '') // Remove headings
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/\n+/g, ' ').trim(); // Replace newlines with spaces

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Truncate at the last space before maxLength
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '...';
}; 