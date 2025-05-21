import React from 'react';
import DOMPurify from 'dompurify';

interface HTMLRendererProps {
  content: string;
  className?: string;
}

/**
 * HTMLRenderer component for safely rendering HTML content
 * Uses DOMPurify to sanitize HTML and prevent XSS attacks
 */
const HTMLRenderer: React.FC<HTMLRendererProps> = ({ content, className = '' }) => {
  // Sanitize HTML to prevent XSS attacks
  const sanitizedHTML = DOMPurify.sanitize(content, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel'],
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li',
      'blockquote', 'code', 'pre', 'strong', 'em', 'img', 'br', 'div', 'span'
    ]
  });

  return (
    <div
      className={`blog-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};

export default HTMLRenderer; 