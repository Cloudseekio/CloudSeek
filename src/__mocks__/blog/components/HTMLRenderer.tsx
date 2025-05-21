import React from 'react';

interface HTMLRendererProps {
  content: string;
}

const HTMLRenderer: React.FC<HTMLRendererProps> = ({ content }) => {
  return (
    <div 
      data-testid="html-content" 
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default HTMLRenderer; 