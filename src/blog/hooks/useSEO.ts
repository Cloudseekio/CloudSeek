import { useState, useEffect } from 'react';
import { BlogPost, BlogCategory, Author } from '../../models/Blog';
import { generateSitemap, generateRSSFeed, generateRobotsTxt } from '../utils/sitemapGenerator';

interface UseSEOOptions {
  siteUrl: string;
  posts: BlogPost[];
  categories: BlogCategory[];
  authors: Author[];
}

interface SEOFiles {
  sitemap: string;
  rss: string;
  robots: string;
}

export function useSEO({
  siteUrl,
  posts,
  categories,
  authors
}: UseSEOOptions) {
  const [seoFiles, setSeoFiles] = useState<SEOFiles>({
    sitemap: '',
    rss: '',
    robots: ''
  });

  useEffect(() => {
    // Generate sitemap
    const sitemap = generateSitemap({
      siteUrl,
      posts,
      categories,
      authors
    });

    // Generate RSS feed
    const rss = generateRSSFeed({
      siteUrl,
      posts
    });

    // Generate robots.txt
    const robots = generateRobotsTxt(siteUrl);

    setSeoFiles({
      sitemap,
      rss,
      robots
    });
  }, [siteUrl, posts, categories, authors]);

  const getCanonicalUrl = (path: string): string => {
    return `${siteUrl}${path}`;
  };

  const getMetaTags = (post?: BlogPost): Record<string, string> => {
    const defaultTags = {
      'og:site_name': 'CloudSeek Blog',
      'og:type': 'website',
      'twitter:card': 'summary_large_image'
    };

    if (!post) {
      return {
        ...defaultTags,
        title: 'CloudSeek Blog - Latest Articles and Insights',
        description: 'Stay up to date with the latest in cloud computing and technology',
        'og:title': 'CloudSeek Blog - Latest Articles and Insights',
        'og:description': 'Stay up to date with the latest in cloud computing and technology',
        'twitter:title': 'CloudSeek Blog - Latest Articles and Insights',
        'twitter:description': 'Stay up to date with the latest in cloud computing and technology'
      };
    }

    return {
      ...defaultTags,
      title: post.title,
      description: post.excerpt,
      'article:published_time': post.publishDate,
      'article:modified_time': post.modifiedDate || post.publishDate,
      'article:author': post.authors.map(author => author.name).join(', '),
      'article:tag': post.tags.join(','),
      'og:title': post.title,
      'og:description': post.excerpt,
      'og:type': 'article',
      'og:image': post.coverImage.url,
      'twitter:title': post.title,
      'twitter:description': post.excerpt,
      'twitter:image': post.coverImage.url
    };
  };

  const getStructuredData = (post?: BlogPost): string => {
    if (!post) {
      return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'CloudSeek Blog',
        description: 'Latest articles and insights about cloud computing and technology',
        url: siteUrl
      });
    }

    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      image: post.coverImage.url,
      datePublished: post.publishDate,
      dateModified: post.modifiedDate || post.publishDate,
      author: post.authors.map(author => ({
        '@type': 'Person',
        name: author.name,
        url: `${siteUrl}/blog/author/${author.id}`
      })),
      publisher: {
        '@type': 'Organization',
        name: 'CloudSeek',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${siteUrl}/blog/${post.slug}`
      }
    });
  };

  const getBreadcrumbData = (post?: BlogPost): string => {
    const items = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Blog',
        item: `${siteUrl}/blog`
      }
    ];

    if (post) {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: post.title,
        item: `${siteUrl}/blog/${post.slug}`
      });
    }

    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items
    });
  };

  return {
    seoFiles,
    getCanonicalUrl,
    getMetaTags,
    getStructuredData,
    getBreadcrumbData
  };
} 