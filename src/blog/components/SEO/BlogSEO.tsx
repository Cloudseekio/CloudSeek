import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BlogPost, Author } from '../../../models/Blog';

interface BlogSEOProps {
  post?: BlogPost;
  author?: Author;
  isBlogListing?: boolean;
  isAuthorPage?: boolean;
  canonicalUrl?: string;
  noIndex?: boolean;
  title?: string;
  description?: string;
  image?: string;
}

const BlogSEO: React.FC<BlogSEOProps> = ({
  post,
  author,
  isBlogListing = false,
  isAuthorPage = false,
  canonicalUrl,
  noIndex = false,
  title: customTitle,
  description: customDescription,
  image: customImage
}) => {
  // Default site metadata
  const siteName = 'CloudSeek Blog';
  const siteUrl = 'https://cloudseek.com';

  // Determine title
  const title = customTitle || (post ? post.title : author ? `${author.name} - Author Profile` : 'Blog');
  const fullTitle = `${title} | ${siteName}`;

  // Determine description
  const description = customDescription || (post ? post.excerpt : author ? author.bio : 'Latest articles and insights');

  // Determine image
  const image = customImage || (post ? post.coverImage.url : author?.avatarUrl);

  // Determine page type
  const pageType = isAuthorPage ? 'profile' : (post ? 'article' : 'website');

  // Generate structured data
  const getArticleStructuredData = () => {
    if (!post) return null;

    return {
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
        name: siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl || `${siteUrl}/blog/${post.slug}`
      }
    };
  };

  const getAuthorStructuredData = () => {
    if (!author) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: author.name,
      description: author.bio,
      image: author.avatarUrl,
      url: `${siteUrl}/blog/author/${author.id}`,
      sameAs: [
        author.socialLinks?.twitter,
        author.socialLinks?.linkedin,
        author.socialLinks?.github,
        author.socialLinks?.website
      ].filter(Boolean)
    };
  };

  const getBlogListingStructuredData = () => {
    if (!isBlogListing) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: siteName,
      description: 'Latest articles and insights about cloud computing and technology',
      url: `${siteUrl}/blog`
    };
  };

  const getBreadcrumbStructuredData = () => {
    const items = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Blog',
        item: `${siteUrl}/blog`
      }
    ];

    if (author) {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Authors',
        item: `${siteUrl}/blog/authors`
      }, {
        '@type': 'ListItem',
        position: 3,
        name: author.name,
        item: `${siteUrl}/blog/author/${author.id}`
      });
    } else if (post) {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: post.title,
        item: `${siteUrl}/blog/${post.slug}`
      });
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items
    };
  };

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={pageType} />
      {image && <meta property="og:image" content={image} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Article-specific metadata */}
      {post && (
        <>
          <meta property="article:published_time" content={post.publishDate} />
          {post.modifiedDate && (
            <meta property="article:modified_time" content={post.modifiedDate} />
          )}
          {post.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Structured Data */}
      {post && (
        <script type="application/ld+json">
          {JSON.stringify(getArticleStructuredData())}
        </script>
      )}

      {author && (
        <script type="application/ld+json">
          {JSON.stringify(getAuthorStructuredData())}
        </script>
      )}

      {isBlogListing && (
        <script type="application/ld+json">
          {JSON.stringify(getBlogListingStructuredData())}
        </script>
      )}

      <script type="application/ld+json">
        {JSON.stringify(getBreadcrumbStructuredData())}
      </script>
    </Helmet>
  );
};

export default BlogSEO; 