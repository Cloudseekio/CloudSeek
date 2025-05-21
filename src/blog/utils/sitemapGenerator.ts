import { BlogPost, BlogCategory, Author } from '../../models/Blog';

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

interface SitemapConfig {
  siteUrl: string;
  posts: BlogPost[];
  categories: BlogCategory[];
  authors: Author[];
}

export const generateSitemap = ({
  siteUrl,
  posts,
  categories,
  authors
}: SitemapConfig): string => {
  const urls: SitemapURL[] = [];

  // Add static pages
  urls.push(
    {
      loc: `${siteUrl}/blog`,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${siteUrl}/blog/categories`,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${siteUrl}/blog/authors`,
      changefreq: 'weekly',
      priority: 0.8
    }
  );

  // Add blog posts
  posts.forEach(post => {
    urls.push({
      loc: `${siteUrl}/blog/${post.slug}`,
      lastmod: post.modifiedDate || post.publishDate,
      changefreq: 'monthly',
      priority: 0.9
    });
  });

  // Add category pages
  categories.forEach(category => {
    urls.push({
      loc: `${siteUrl}/blog/category/${category.slug}`,
      changefreq: 'weekly',
      priority: 0.7
    });
  });

  // Add author pages
  authors.forEach(author => {
    urls.push({
      loc: `${siteUrl}/blog/author/${author.id}`,
      changefreq: 'weekly',
      priority: 0.7
    });
  });

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    url => `  <url>
    <loc>${url.loc}</loc>${
      url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''
    }${
      url.changefreq ? `\n    <changefreq>${url.changefreq}</changefreq>` : ''
    }${
      url.priority ? `\n    <priority>${url.priority}</priority>` : ''
    }
  </url>`
  )
  .join('\n')}
</urlset>`;

  return sitemap;
};

export const generateRSSFeed = ({
  siteUrl,
  posts,
}: Pick<SitemapConfig, 'siteUrl' | 'posts'>): string => {
  const feedItems = posts
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, 10) // Latest 10 posts
    .map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid>${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishDate).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      ${post.coverImage.url ? `<image>${post.coverImage.url}</image>` : ''}
      ${post.tags.map(tag => `<category>${tag}</category>`).join('\n      ')}
    </item>`
    )
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CloudSeek Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Latest articles and insights about cloud computing and technology</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${feedItems}
  </channel>
</rss>`;

  return rss;
};

export const generateRobotsTxt = (siteUrl: string): string => {
  return `User-agent: *
Allow: /blog/
Allow: /blog/category/
Allow: /blog/author/
Allow: /blog/tag/

Disallow: /blog/preview/
Disallow: /blog/draft/
Disallow: /blog/admin/

Sitemap: ${siteUrl}/sitemap.xml
`;
}; 