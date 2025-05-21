import React, { useEffect, useState, useCallback } from 'react';
import { Document } from '@contentful/rich-text-types';
import ReactMarkdown from 'react-markdown';
import { RefreshCw, XCircle } from 'lucide-react';
import { isRichTextDocument, TocItem, ContentFormat } from '../types/blog';
import { extractHeadingsFromHtml, extractHeadingsFromMarkdown, extractHeadingsFromRichText } from '../utils/contentUtils';
import RichTextRenderer from './contentful/RichTextRenderer';
import ContentfulErrorBoundary from './error/ContentfulErrorBoundary';

// Maximum number of retry attempts
const MAX_RETRIES = 3;
// Base delay for exponential backoff (in milliseconds)
const BASE_RETRY_DELAY = 1000;

interface ErrorState {
  message: string;
  code?: string;
  details?: string;
  timestamp: number;
  retryCount: number;
}

interface ErrorDisplayProps {
  error: Error;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => (
  <div className="p-4 border rounded-md bg-red-50 dark:bg-red-900/20">
    <div className="flex items-center gap-2 mb-2">
      <XCircle className="w-5 h-5 text-red-500" />
      <h3 className="font-semibold text-red-700 dark:text-red-400">Error Loading Content</h3>
    </div>
    <p className="mb-4 text-sm text-red-600 dark:text-red-300">{error.message}</p>
    <button
      onClick={onRetry}
      className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
    >
      <RefreshCw className="w-4 h-4" />
      Retry
    </button>
  </div>
);

interface UnifiedContentRendererProps {
  content: string | Document;
  contentFormat?: ContentFormat;
  format?: ContentFormat;
  className?: string;
  onHeadingsExtracted?: (headings: TocItem[]) => void;
  baseUrl?: string;
  onError?: (error: Error) => void;
}

/**
 * Unified Content Renderer component that supports multiple content formats:
 * - Rich Text (Contentful)
 * - Markdown
 * - HTML
 */
const UnifiedContentRenderer: React.FC<UnifiedContentRendererProps> = ({
  content,
  contentFormat: providedContentFormat,
  format: simplifiedFormat,
  className = '',
  onHeadingsExtracted,
  onError
}) => {
  const providedFormat = simplifiedFormat || providedContentFormat;
  const [detectedFormat, setDetectedFormat] = useState<ContentFormat | null>(null);
  const [processedContent, setProcessedContent] = useState<string>('');
  const [richTextDocument, setRichTextDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorState, setErrorState] = useState<ErrorState | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Function to detect content format
  const detectFormat = useCallback(() => {
    if (isRichTextDocument(content)) {
      setDetectedFormat('richText');
    } else if (typeof content === 'string') {
      try {
        // Try to parse as JSON to check if it's a stringified rich text document
        const parsed = JSON.parse(content);
        if (parsed && parsed.nodeType === 'document' && Array.isArray(parsed.content)) {
          setDetectedFormat('richText');
          return;
        }
      } catch {
        // Not JSON, continue with other format detection
      }

      // Check for HTML or Markdown
      if (content.trim().startsWith('<') || content.includes('</')) {
        setDetectedFormat('html');
      } else {
        setDetectedFormat('markdown');
      }
    } else {
      setError('Unsupported content format');
    }
  }, [content]);
  
  // Handle retry when ContentfulErrorBoundary triggers a retry
  const handleRetry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setErrorState(null);
    
    if (providedFormat) {
      setDetectedFormat(providedFormat);
    } else {
      detectFormat();
    }
  }, [providedFormat, detectFormat]);
  
  // Auto-detect content format if not provided
  useEffect(() => {
    if (providedFormat) {
      setDetectedFormat(providedFormat);
    } else {
      detectFormat();
    }
  }, [content, providedFormat, detectFormat]);

  // Process content based on format with improved handling for rich text
  const processContent = useCallback(async () => {
    if (!content) return;

    try {
      setIsLoading(true);
      setError(null);

      let headings: TocItem[] = [];
      
      if (detectedFormat === 'richText') {
        const doc = typeof content === 'string' ? JSON.parse(content) : content;
        setRichTextDocument(doc);
        headings = extractHeadingsFromRichText(doc);
      } else if (detectedFormat === 'html') {
        setProcessedContent(content as string);
        headings = extractHeadingsFromHtml(content as string);
      } else if (detectedFormat === 'markdown') {
        setProcessedContent(content as string);
        headings = extractHeadingsFromMarkdown(content as string);
      }

      if (onHeadingsExtracted) {
        onHeadingsExtracted(headings);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message);
      if (onError) onError(error);
    } finally {
      setIsLoading(false);
    }
  }, [content, detectedFormat, onHeadingsExtracted, onError]);

  // Process content when format is detected or changes
  useEffect(() => {
    if (detectedFormat) {
      processContent();
    }
  }, [detectedFormat, processContent]);

  const renderContent = () => {
    if (isLoading) {
      return <div className="animate-pulse">Loading content...</div>;
    }

    if (error) {
      return <ErrorDisplay error={new Error(error)} onRetry={handleRetry} />;
    }

    if (detectedFormat === 'richText' && richTextDocument) {
      return <RichTextRenderer document={richTextDocument} />;
    }

    if (detectedFormat === 'markdown') {
      return <ReactMarkdown>{processedContent}</ReactMarkdown>;
    }

    if (detectedFormat === 'html') {
      return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
    }

    return null;
  };

  return (
    <ContentfulErrorBoundary
      fallback={
        <ErrorDisplay
          error={new Error("Failed to render content")}
          onRetry={handleRetry}
        />
      }
    >
      <div className={className}>
        {renderContent()}
      </div>
    </ContentfulErrorBoundary>
  );
};

export default UnifiedContentRenderer;