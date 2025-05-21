import { BlogPost } from '../models/Blog';

/**
 * Generate an RSS feed XML string for blog posts
 */
export const generateRSSFeed = (posts: BlogPost[]): string => {
  const siteUrl = 'https://cloudseek.i0';
  const dateNow = new Date().toUTCString();
  
  const rssItems = posts.map(post => {
    const pubDate = new Date(post.publishDate).toUTCString();
    return `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${siteUrl}/blog/${post.slug}</link>
        <guid>${siteUrl}/blog/${post.slug}</guid>
        <pubDate>${pubDate}</pubDate>
        <description><![CDATA[${post.excerpt}]]></description>
        <author>${post.author.name}</author>
        <category>${post.category}</category>
        ${post.tags.map(tag => `<category>${tag}</category>`).join('')}
      </item>
    `;
  }).join('');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CloudSeek Blog</title>
    <description>Insights, tutorials, and resources to help you get the most out of Salesforce and cloud technologies.</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${dateNow}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;
}; 