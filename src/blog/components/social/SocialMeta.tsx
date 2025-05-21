import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BlogPost } from '../../../models/Blog';

interface SocialMetaProps {
  post: BlogPost;
  siteUrl: string;
  siteName: string;
  twitterHandle?: string;
  facebookAppId?: string;
}

const SocialMeta: React.FC<SocialMetaProps> = ({
  post,
  siteUrl,
  siteName,
  twitterHandle,
  facebookAppId
}) => {
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = post.coverImage?.url.startsWith('http')
    ? post.coverImage.url
    : `${siteUrl}${post.coverImage?.url}`;

  return (
    <Helmet>
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.excerpt} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={canonicalUrl} />
      {post.coverImage && <meta property="og:image" content={imageUrl} />}
      <meta property="og:site_name" content={siteName} />
      {facebookAppId && <meta property="fb:app_id" content={facebookAppId} />}
      
      {/* Article Specific Meta Tags */}
      <meta property="article:published_time" content={post.publishedAt} />
      {post.updatedAt && (
        <meta property="article:modified_time" content={post.updatedAt} />
      )}
      {post.authors.map(author => (
        <meta key={author.id} property="article:author" content={author.name} />
      ))}
      {post.tags.map(tag => (
        <meta key={tag.id} property="article:tag" content={tag.name} />
      ))}
      <meta property="article:section" content={post.category?.name || ''} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      {twitterHandle && <meta name="twitter:site" content={`@${twitterHandle}`} />}
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={post.excerpt} />
      {post.coverImage && <meta name="twitter:image" content={imageUrl} />}
      {post.coverImage?.alt && (
        <meta name="twitter:image:alt" content={post.coverImage.alt} />
      )}

      {/* Schema.org / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          image: imageUrl,
          url: canonicalUrl,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt || post.publishedAt,
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
            '@id': canonicalUrl
          }
        })}
      </script>
    </Helmet>
  );
};

export default SocialMeta; 