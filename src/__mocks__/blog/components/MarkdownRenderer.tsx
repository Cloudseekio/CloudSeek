import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div data-testid="markdown-content">
      {content}
    </div>
  );
};

export default MarkdownRenderer; 