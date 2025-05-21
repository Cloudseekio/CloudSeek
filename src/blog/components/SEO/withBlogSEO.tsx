import React from 'react';
import { BlogPost, Author } from '../../../models/Blog';
import BlogSEO from './BlogSEO';

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
  const baseUrl = 'https://cloudseek.com'; // Replace with your domain
  return `${baseUrl}${path}`;
}; 