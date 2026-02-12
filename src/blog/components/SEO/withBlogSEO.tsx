import React from 'react';
import { BlogPost, Author } from '../../../models/Blog';
import BlogSEO from './BlogSEO';
import { siteUrl as SITE_URL } from '../../../config/site';

interface WithBlogSEOProps {
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

export const withBlogSEO = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  seoProps?: WithBlogSEOProps
) => {
  return function WithBlogSEOWrapper(props: P) {
    return (
      <>
        <BlogSEO {...seoProps} />
        <WrappedComponent {...props} />
      </>
    );
  };
};

// Helper function to generate canonical URL
export const generateCanonicalUrl = (path: string): string => {
  return `${SITE_URL}${path}`;
};