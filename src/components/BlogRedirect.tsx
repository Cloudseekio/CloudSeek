import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEO from './SEO';

/**
 * This component handles redirects from /blogs/:slug to /blog/:slug
 * while maintaining proper SEO signals (301 redirect)
 */
const BlogRedirect: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the canonical URL
    navigate(`/blog/${slug}`, { replace: true });
  }, [slug, navigate]);
  
  return (
    <SEO 
      title="Redirecting..."
      noIndex={true}
      canonical={`/blog/${slug}`}
    />
  );
};

export default BlogRedirect; 