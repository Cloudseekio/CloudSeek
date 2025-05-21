import React from 'react';

interface RichTextRendererProps {
  content: any;
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content }) => {
  return (
    <div data-testid="rich-text-content">
      Mocked Rich Text
    </div>
  );
};

export default RichTextRenderer; 