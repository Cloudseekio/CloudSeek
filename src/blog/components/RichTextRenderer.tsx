import React from 'react';
import { RichTextContent, RichTextNode } from '../../models/Blog';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../../context/ThemeContext';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface RichTextRendererProps {
  content: RichTextContent | RichTextNode;
  className?: string;
}

interface AssetFields {
  file?: {
    contentType?: string;
    url?: string;
  };
  title?: string;
  description?: string;
}

interface EmbeddedAssetData {
  target?: {
    fields?: AssetFields;
  };
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = '' }) => {
  const { theme } = useTheme();
  
  if (!content) {
    return null;
  }

  // Handle text nodes
  if (content.nodeType === 'text') {
    const textContent = content.value || '';
    
    // Apply text marks (bold, italic, etc.)
    const nodeAsRichTextNode = content as RichTextNode;
    if (nodeAsRichTextNode.marks && nodeAsRichTextNode.marks.length > 0) {
      return (
        <>
          {nodeAsRichTextNode.marks.reduce((result: React.ReactNode, mark) => {
            switch (mark.type) {
              case 'bold':
                return <strong key={`bold-${Date.now()}`}>{result}</strong>;
              case 'italic':
                return <em key={`italic-${Date.now()}`}>{result}</em>;
              case 'underline':
                return <u key={`underline-${Date.now()}`}>{result}</u>;
              case 'code':
                return <code key={`code-${Date.now()}`} className={`${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800'} px-1 py-0.5 rounded`}>{result}</code>;
              default:
                return result;
            }
          }, textContent)}
        </>
      );
    }
    
    return <>{textContent}</>;
  }

  // Handle Code Blocks
  if (content.nodeType === 'code-block') {
    const code = content.content?.map(node => node.value || '').join('') || '';
    const language = (content.data?.language as string) || 'javascript';
    
    return (
      <CodeBlock 
        code={code} 
        language={language} 
        theme={theme === 'dark' ? 'dark' : 'light'} 
      />
    );
  }

  // Handle Embedded Assets (images, videos, etc.)
  if (content.nodeType === 'embedded-asset-block') {
    const assetData = content.data as EmbeddedAssetData;
    const fields = assetData?.target?.fields;
    
    if (!fields) return null;
    
    const contentType = fields.file?.contentType || '';
    const url = fields.file?.url || '';
    const title = fields.title || '';
    const description = fields.description || '';
    
    // Handle images
    if (contentType.startsWith('image/')) {
      return (
        <figure className="my-6">
          <img 
            src={url} 
            alt={title || description}
            className="w-full h-auto rounded-lg"
            loading="lazy"
          />
          {description && (
            <figcaption className={`text-center text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {description}
            </figcaption>
          )}
        </figure>
      );
    }
    
    // Handle videos
    if (contentType.startsWith('video/') || url.includes('youtube.com') || url.includes('vimeo.com')) {
      // YouTube or Vimeo
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.includes('youtube.com') 
          ? url.split('v=')[1]?.split('&')[0] 
          : url.split('youtu.be/')[1];
          
        return (
          <div className="my-6 aspect-w-16 aspect-h-9">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={title || 'YouTube video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
        );
      }
      
      // Regular video
      return (
        <div className="my-6">
          <video 
            src={url}
            controls
            className="w-full rounded-lg"
            title={title || description}
          >
            Your browser does not support the video tag.
          </video>
          {description && (
            <p className={`text-center text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {description}
            </p>
          )}
        </div>
      );
    }
    
    // Handle other embeds with a placeholder
    return (
      <div className={`my-6 p-4 border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'} rounded-lg`}>
        <p className="flex items-center">
          <ExternalLink size={16} className="mr-2" />
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
          >
            {title || 'Embedded content'}
          </a>
        </p>
        {description && (
          <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {description}
          </p>
        )}
      </div>
    );
  }

  // Handle links
  if (content.nodeType === 'hyperlink') {
    const url = (content.data?.uri as string) || '#';
    const isExternal = url.startsWith('http');
    
    return (
      <a 
        href={url}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} underline`}
      >
        {content.content?.map((node, i) => (
          <RichTextRenderer key={i} content={node} />
        ))}
        {isExternal && <ExternalLink size={14} className="inline-block ml-1" />}
      </a>
    );
  }

  // Process container elements recursively
  type ContainerElementFunction = (children: React.ReactNode) => JSX.Element;
  
  const containerElements: Record<string, ContainerElementFunction> = {
    'document': (children) => <div className={className}>{children}</div>,
    'paragraph': (children) => <p className="mb-6">{children}</p>,
    'heading-1': (children) => <h1 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{children}</h1>,
    'heading-2': (children) => <h2 id={createHeadingId(children)} className={`text-3xl font-bold mt-8 mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} scroll-mt-20`}>{children}</h2>,
    'heading-3': (children) => <h3 id={createHeadingId(children)} className={`text-2xl font-bold mt-6 mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} scroll-mt-20`}>{children}</h3>,
    'heading-4': (children) => <h4 id={createHeadingId(children)} className={`text-xl font-bold mt-4 mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} scroll-mt-20`}>{children}</h4>,
    'heading-5': (children) => <h5 className={`text-lg font-bold mt-4 mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{children}</h5>,
    'heading-6': (children) => <h6 className={`text-base font-bold mt-4 mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{children}</h6>,
    'blockquote': (children) => (
      <blockquote className={`border-l-4 pl-4 italic my-6 ${theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700'}`}>
        {children}
      </blockquote>
    ),
    'unordered-list': (children) => <ul className="list-disc pl-6 mb-6">{children}</ul>,
    'ordered-list': (children) => <ol className="list-decimal pl-6 mb-6">{children}</ol>,
    'list-item': (children) => <li className="mb-2">{children}</li>,
    'hr': () => <hr className={`my-8 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`} />,
    'table': (children) => (
      <div className="overflow-x-auto mb-6">
        <table className={`min-w-full border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
          {children}
        </table>
      </div>
    ),
    'table-row': (children) => <tr>{children}</tr>,
    'table-cell': (children) => <td className={`border px-4 py-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>{children}</td>,
    'table-header-cell': (children) => (
      <th className={`border px-4 py-2 font-bold ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-100'}`}>
        {children}
      </th>
    ),
  };

  // Helper to create IDs for headings (for table of contents)
  function createHeadingId(children: React.ReactNode): string {
    if (typeof children === 'string') {
      return children.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
    }
    
    if (Array.isArray(children)) {
      return children
        .map(child => {
          if (typeof child === 'string') {
            return child;
          }
          // Handle React elements
          if (React.isValidElement(child)) {
            const props = child.props as { children?: React.ReactNode };
            if (props.children) {
              return createHeadingId(props.children);
            }
          }
          return '';
        })
        .join('')
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    }
    
    return '';
  }

  // If this node type is in our mapping, use it to create a container
  const Container = containerElements[content.nodeType];
  
  if (Container && content.content) {
    const childrenArray = content.content.map((node, i) => (
      <RichTextRenderer key={i} content={node} />
    ));
    
    return Container(childrenArray);
  }

  // For unhandled node types, render children recursively
  if (content.content) {
    return (
      <>
        {content.content.map((node, i) => (
          <RichTextRenderer key={i} content={node} />
        ))}
      </>
    );
  }

  // Fallback for any other node type
  return null;
};

// Reusable code block component with syntax highlighting and copy button
interface CodeBlockProps {
  code: string;
  language: string;
  theme: 'light' | 'dark';
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, theme }) => {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="relative group my-6">
      <SyntaxHighlighter
        language={language}
        style={theme === 'dark' ? tomorrow : prism}
        customStyle={{
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          margin: '0',
          padding: '1rem'
        }}
      >
        {code}
      </SyntaxHighlighter>
      <div className="absolute top-2 right-2 flex space-x-2">
        <span className={`text-xs px-2 py-1 rounded ${
          theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
        }`}>
          {language}
        </span>
        <button
          onClick={handleCopy}
          className={`p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none ${
            theme === 'dark' 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
          title="Copy code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
};

export default RichTextRenderer; 