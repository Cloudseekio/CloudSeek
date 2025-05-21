import React from 'react';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS, Document } from '@contentful/rich-text-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../../../context/ThemeContext';
import { AlertCircle } from 'lucide-react';
import { TocItem } from '../../types/blog';
import logger from '../../../utils/logger';

// Type definitions to improve type safety
interface RichTextRendererProps {
  document: Document;
  className?: string;
  onHeadingsExtracted?: (headings: TocItem[]) => void;
  baseUrl?: string; // For internal link resolution
}

// Define a proper type for node with content
interface NodeWithChildren {
  nodeType: string;
  content?: NodeWithChildren[];
  data?: Record<string, unknown>;
  value?: string;
  marks?: { type: string }[];
}

/**
 * Error boundary component to catch and gracefully handle rendering errors
 */
class RenderErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    logger.error('Error rendering rich text content:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="text-red-500 border border-red-300 rounded p-2 my-2 flex items-center bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="mr-2" size={18} />
          <span>Content rendering error</span>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * RichTextRenderer component to render Contentful Rich Text content
 * This component handles all node types defined in the Contentful Rich Text model
 */
const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  document,
  className = '',
  onHeadingsExtracted,
  baseUrl = ''
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Extract headings for TOC if callback provided
  React.useEffect(() => {
    if (onHeadingsExtracted && document) {
      const headings: TocItem[] = [];
      const extractHeadings = (nodes: NodeWithChildren[]) => {
        if (!nodes) return;
        
        nodes.forEach(node => {
          if (node.nodeType.startsWith('heading-')) {
            const level = parseInt(node.nodeType.split('-')[1], 10);
            if (level <= 3) { // Only include h1, h2, h3 in TOC
              const textContent = node.content
                ?.filter(n => n.nodeType === 'text')
                .map(n => n.value || '')
                .join('') || '';
                
              if (textContent.trim()) {
                const id = textContent
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, '')
                  .replace(/\s+/g, '-');
                  
                headings.push({
                  id,
                  text: textContent,
                  level
                });
              }
            }
          }
          
          if (node.content) {
            extractHeadings(node.content);
          }
        });
      };
      
      extractHeadings(document.content as NodeWithChildren[]);
      onHeadingsExtracted(headings);
    }
  }, [document, onHeadingsExtracted]);

  // Define rendering options based on theme
  const options: Options = {
    renderMark: {
      [MARKS.BOLD]: (text) => <strong className="font-bold">{text}</strong>,
      [MARKS.ITALIC]: (text) => <em className="italic">{text}</em>,
      [MARKS.UNDERLINE]: (text) => <span className="underline">{text}</span>,
      [MARKS.CODE]: (text) => (
        <code className="px-1.5 py-0.5 text-sm bg-gray-100 dark:bg-gray-800 rounded font-mono">
          {text}
        </code>
      ),
    },
    renderNode: {
      // Basic text components
      [BLOCKS.PARAGRAPH]: (_node, children) => (
        <p className="mb-4 last:mb-0">{children}</p>
      ),
      [BLOCKS.HEADING_1]: (node, children) => {
        const id = children?.toString()
          ?.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
          
        return (
          <h1 id={id} className="text-3xl font-bold mt-8 mb-4">
            {children}
          </h1>
        );
      },
      [BLOCKS.HEADING_2]: (node, children) => {
        const id = children?.toString()
          ?.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
          
        return (
          <h2 id={id} className="text-2xl font-bold mt-6 mb-3">
            {children}
          </h2>
        );
      },
      [BLOCKS.HEADING_3]: (node, children) => {
        const id = children?.toString()
          ?.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
          
        return (
          <h3 id={id} className="text-xl font-semibold mt-5 mb-3">
            {children}
          </h3>
        );
      },
      [BLOCKS.HEADING_4]: (_node, children) => (
        <h4 className="text-lg font-semibold mt-4 mb-2">{children}</h4>
      ),
      [BLOCKS.HEADING_5]: (_node, children) => (
        <h5 className="text-base font-semibold mt-4 mb-2">{children}</h5>
      ),
      [BLOCKS.HEADING_6]: (_node, children) => (
        <h6 className="text-sm font-semibold mt-4 mb-2 uppercase tracking-wider">{children}</h6>
      ),
      
      // Lists
      [BLOCKS.UL_LIST]: (_node, children) => (
        <ul className="list-disc ml-6 mb-4 space-y-1">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (_node, children) => (
        <ol className="list-decimal ml-6 mb-4 space-y-1">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (_node, children) => (
        <li className="mb-1">{children}</li>
      ),
      
      // Quotes and horizontal rules
      [BLOCKS.QUOTE]: (_node, children) => (
        <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-1 my-4 italic text-gray-700 dark:text-gray-300">
          {children}
        </blockquote>
      ),
      [BLOCKS.HR]: () => (
        <hr className="my-8 border-t border-gray-300 dark:border-gray-700" />
      ),
      
      // Embedded Assets (Images, etc)
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        // Error handling for missing asset
        if (!node?.data?.target?.sys?.id) {
          return (
            <div className="p-4 my-4 border border-yellow-300 rounded bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300">
              <p>Missing asset reference</p>
            </div>
          );
        }
        
        try {
          const asset = node.data.target;
          // Handle case where file field might be undefined
          if (!asset.fields?.file) {
            return (
              <div className="p-4 my-4 border border-yellow-300 rounded bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300">
                <p>Asset is missing file information</p>
              </div>
            );
          }
          
          const { file } = asset.fields;
          const { url, contentType } = file;
          
          // Image assets
          if (contentType.startsWith('image/')) {
            return (
              <div className="my-6">
                <img
                  src={url}
                  alt={asset.fields.title || 'Embedded image'}
                  className="mx-auto rounded-lg max-h-96 w-auto object-contain"
                  loading="lazy"
                />
                {asset.fields.description && (
                  <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    {asset.fields.description}
                  </p>
                )}
              </div>
            );
          }
          
          // Other asset types (PDFs, etc.)
          return (
            <div className="my-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center space-x-2">
                <span className="material-icons text-gray-500">description</span>
                <div>
                  <p className="font-medium">{asset.fields.title || file.fileName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{file.contentType}</p>
                </div>
              </div>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
              >
                Download
              </a>
            </div>
          );
        } catch (error) {
          logger.error('Error rendering embedded asset:', error);
          return (
            <div className="p-4 my-4 border border-red-300 rounded bg-red-50 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
              <p>Error rendering asset</p>
            </div>
          );
        }
      },
      
      // Embedded Entries (Code Blocks, etc.)
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        // Error handling for missing entry
        if (!node?.data?.target?.sys?.id) {
          return (
            <div className="p-4 my-4 border border-yellow-300 rounded bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300">
              <p>Missing entry reference</p>
            </div>
          );
        }
        
        try {
          const entry = node.data.target;
          const contentType = entry.sys.contentType?.sys.id;
          
          // Code block entry
          if (contentType === 'codeBlock') {
            const code = entry.fields.code || '';
            const language = entry.fields.language || 'javascript';
            
            return (
              <div className="my-6">
                <SyntaxHighlighter
                  language={language}
                  style={isDark ? tomorrow : prism}
                  showLineNumbers
                  className="rounded-md overflow-hidden"
                >
                  {code}
                </SyntaxHighlighter>
                
                {entry.fields.caption && (
                  <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    {entry.fields.caption}
                  </p>
                )}
              </div>
            );
          }
          
          // Quote entry
          if (contentType === 'quote') {
            return (
              <div className="my-6 px-6 py-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-blue-500 dark:border-blue-400 rounded-r-lg">
                <blockquote className="text-lg italic font-medium text-gray-700 dark:text-gray-300">
                  "{entry.fields.quote}"
                </blockquote>
                
                {entry.fields.author && (
                  <p className="mt-2 text-right text-gray-600 dark:text-gray-400">
                    — {entry.fields.author}
                    {entry.fields.source && <span>, {entry.fields.source}</span>}
                  </p>
                )}
              </div>
            );
          }
          
          // Default embedded entry display
          return (
            <div className="p-4 my-4 border border-blue-200 rounded bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
              <p className="font-medium">{contentType || 'Custom'} content</p>
              <p className="text-sm">(ID: {entry.sys.id})</p>
            </div>
          );
        } catch (error) {
          logger.error('Error rendering embedded entry:', error);
          return (
            <div className="p-4 my-4 border border-red-300 rounded bg-red-50 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
              <p>Error rendering entry</p>
            </div>
          );
        }
      },
      
      // Hyperlinks
      [INLINES.HYPERLINK]: (node, children) => {
        const href = node.data.uri;
        // Determine if this is an internal or external link
        const isExternal = href.startsWith('http') && !href.includes(baseUrl);
        
        return (
          <a 
            href={href} 
            className="text-blue-600 dark:text-blue-400 hover:underline"
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
        );
      },
      
      // Entry hyperlinks
      [INLINES.ENTRY_HYPERLINK]: (node, children) => {
        try {
          const entry = node.data.target;
          const contentType = entry.sys.contentType?.sys.id;
          
          if (contentType === 'blogPost' || contentType === 'cloudSeekBlogPost' || contentType === 'clousdSeekBlogPost') {
            const slug = entry.fields.slug;
            return (
              <a href={`/blog/${slug}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                {children}
              </a>
            );
          }
          
          return <span className="underline">{children}</span>;
        } catch (error) {
          logger.error('Error rendering entry hyperlink:', error);
          return <span className="underline">{children}</span>;
        }
      },
      
      // Asset hyperlinks
      [INLINES.ASSET_HYPERLINK]: (node, children) => {
        try {
          const asset = node.data.target;
          // Handle case where file field might be undefined
          if (!asset.fields?.file) {
            return <span className="underline">{children}</span>;
          }
          
          return (
            <a 
              href={asset.fields.file.url} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
        >
          {children}
        </a>
          );
        } catch (error) {
          logger.error('Error rendering asset hyperlink:', error);
          return <span className="underline">{children}</span>;
        }
      },
    }
  };

  // Safeguard against bad document structure
  if (!document || !document.content) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded my-4">
        <div className="flex items-center mb-2">
          <AlertCircle className="mr-2" size={20} />
          <h3 className="font-medium">Invalid document structure</h3>
        </div>
        <p>The rich text content could not be rendered due to an invalid structure.</p>
      </div>
    );
  }

  return (
    <RenderErrorBoundary>
    <div className={`rich-text-content ${className}`}>
        {document && documentToReactComponents(document, options)}
    </div>
    </RenderErrorBoundary>
  );
};

export default RichTextRenderer; 