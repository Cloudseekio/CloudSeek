import React from 'react';
import { Document } from '@contentful/rich-text-types';
import RichTextRenderer from './contentful/RichTextRenderer';
import MarkdownRenderer from './MarkdownRenderer';
import HTMLRenderer from './HTMLRenderer';
import { ContentFormat, TocItem } from '../types/blog';
import logger from '../../utils/logger';

interface ContentRendererProps {
  content: string | Document;
  format: ContentFormat;
  className?: string;
  onHeadingsExtracted?: (headings: TocItem[]) => void;
}

/**
 * ContentRenderer provides a unified interface for rendering different content formats
 * It simplifies the usage compared to UnifiedContentRenderer by having a more focused API
 */
const ContentRenderer: React.FC<ContentRendererProps> = ({ 
  content, 
  format, 
  className = '',
  onHeadingsExtracted
}) => {
  if (!content) {
    return <div className="text-gray-500">No content available</div>;
  }
  
  try {
    switch (format) {
      case 'richText':
        return (
          <RichTextRenderer 
            document={typeof content === 'string' ? JSON.parse(content) : content} 
            className={className}
            onHeadingsExtracted={onHeadingsExtracted}
          />
        );
      case 'markdown':
        return (
          <MarkdownRenderer 
            content={typeof content === 'string' ? content : JSON.stringify(content)} 
            className={className} 
          />
        );
      case 'html':
        return (
          <HTMLRenderer 
            content={typeof content === 'string' ? content : JSON.stringify(content)} 
            className={className} 
          />
        );
      default:
        logger.error(`Unsupported content format: ${format}`);
        return (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800">
            Unable to render content. Unsupported format: {format}
          </div>
        );
    }
  } catch (error) {
    logger.error('Error rendering content:', error);
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800">
        Error rendering content: {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }
};

export default ContentRenderer; 