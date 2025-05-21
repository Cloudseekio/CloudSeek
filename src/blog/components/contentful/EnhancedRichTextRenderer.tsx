import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS, Document, Node, Block, Text } from '@contentful/rich-text-types';
import { Entry, EntrySkeletonType, EntryFields, Asset, AssetCollection, ChainModifiers, EntrySys } from 'contentful';
import { useTheme } from '../../../context/ThemeContext';
import { ContentfulFields, isAsset } from '../../types/contentful';
import { TocItem } from '../../types/blog';
import { extractHeadingsFromRichText } from '../../utils/contentUtils';

interface RichTextRendererProps {
  document: Document;
  className?: string;
  onError?: (error: Error) => void;
  onHeadingsExtracted?: (headings: TocItem[]) => void;
}

interface RenderOptions {
  isDark: boolean;
  onError?: (error: Error) => void;
}

interface EmbeddedAssetNode extends Node {
  data: {
    target: {
      sys: {
        type: 'Asset';
        id: string;
      };
      fields: {
        title?: string;
        description?: string;
        file: {
          url: string;
          contentType: string;
          fileName: string;
        };
      };
    };
  };
}

interface HeadingNode extends Block {
  content: Text[];
  nodeType: 'heading-1' | 'heading-2' | 'heading-3' | 'heading-4' | 'heading-5' | 'heading-6';
}

interface CodeBlockFields {
  code: string;
  language?: string;
}

interface QuoteFields {
  quote: string;
  author?: string;
  source?: string;
}

interface CustomEntrySys extends Partial<EntrySys> {
  contentType: {
    sys: {
      id: string;
    };
  };
}

interface CodeBlockEntry {
  sys: CustomEntrySys;
  fields: CodeBlockFields;
}

interface QuoteEntry {
  sys: CustomEntrySys;
  fields: QuoteFields;
}

interface EmbeddedEntryNode extends Node {
  data: {
    target: Entry<ContentfulFields> | CodeBlockEntry | QuoteEntry;
  };
}

interface HyperlinkNode extends Node {
  data: {
    uri: string;
  };
}

class RichTextErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError?: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500">Failed to render content</div>;
    }
    return this.props.children;
  }
}

const EnhancedRichTextRenderer: React.FC<RichTextRendererProps> = ({
  document,
  className = '',
  onError,
  onHeadingsExtracted
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Extract headings for table of contents
  React.useEffect(() => {
    if (document && onHeadingsExtracted) {
      const headings = extractHeadingsFromRichText(document);
      onHeadingsExtracted(headings);
    }
  }, [document, onHeadingsExtracted]);

  const options = getRenderOptions({ isDark, onError });

  return (
    <RichTextErrorBoundary onError={onError}>
      <div className={className}>
        {documentToReactComponents(document, options)}
      </div>
    </RichTextErrorBoundary>
  );
};

const getRenderOptions = ({ isDark, onError }: RenderOptions) => ({
  renderMark: {
    [MARKS.BOLD]: (text: React.ReactNode) => (
      <strong className={isDark ? 'text-white' : 'text-gray-900'}>{text}</strong>
    ),
    [MARKS.ITALIC]: (text: React.ReactNode) => <em>{text}</em>,
    [MARKS.UNDERLINE]: (text: React.ReactNode) => <u>{text}</u>,
    [MARKS.CODE]: (text: React.ReactNode) => (
      <code className={`px-1 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {text}
      </code>
    ),
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: Node, children: React.ReactNode) => (
      <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node: Block, children: React.ReactNode) => {
      const headingNode = node as HeadingNode;
      const text = headingNode.content
        .filter((n): n is Text => n.nodeType === 'text')
        .map(n => n.value)
        .join('');
      const id = text.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
      return (
        <h1 id={id} className={`text-4xl font-bold mb-6 scroll-mt-20 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {children}
        </h1>
      );
    },
    [BLOCKS.HEADING_2]: (node: Block, children: React.ReactNode) => {
      const headingNode = node as HeadingNode;
      const text = headingNode.content
        .filter((n): n is Text => n.nodeType === 'text')
        .map(n => n.value)
        .join('');
      const id = text.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
      return (
        <h2 id={id} className={`text-3xl font-bold mb-5 scroll-mt-20 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {children}
        </h2>
      );
    },
    [BLOCKS.HEADING_3]: (node: Block, children: React.ReactNode) => {
      const headingNode = node as HeadingNode;
      const text = headingNode.content
        .filter((n): n is Text => n.nodeType === 'text')
        .map(n => n.value)
        .join('');
      const id = text.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
      return (
        <h3 id={id} className={`text-2xl font-bold mb-4 scroll-mt-20 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {children}
        </h3>
      );
    },
    [BLOCKS.HEADING_4]: (node: Block, children: React.ReactNode) => {
      const headingNode = node as HeadingNode;
      const text = headingNode.content
        .filter((n): n is Text => n.nodeType === 'text')
        .map(n => n.value)
        .join('');
      const id = text.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
      return (
        <h4 id={id} className={`text-xl font-bold mb-3 scroll-mt-20 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {children}
        </h4>
      );
    },
    [BLOCKS.HEADING_5]: (node: Node, children: React.ReactNode) => (
      <h5 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {children}
      </h5>
    ),
    [BLOCKS.HEADING_6]: (node: Node, children: React.ReactNode) => (
      <h6 className={`text-base font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {children}
      </h6>
    ),
    [BLOCKS.UL_LIST]: (node: Node, children: React.ReactNode) => (
      <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: Node, children: React.ReactNode) => (
      <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: Node, children: React.ReactNode) => (
      <li className={isDark ? 'text-gray-300' : 'text-gray-700'}>{children}</li>
    ),
    [BLOCKS.QUOTE]: (node: Node, children: React.ReactNode) => (
      <blockquote
        className={`border-l-4 pl-4 my-4 italic ${
          isDark ? 'border-blue-500 text-gray-400' : 'border-blue-600 text-gray-600'
        }`}
      >
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className={`my-8 ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />,
    [BLOCKS.EMBEDDED_ASSET]: (node: Node) => {
      try {
        const assetNode = node as EmbeddedAssetNode;
        const asset = assetNode.data.target;
        
        if (!isAsset(asset) || !asset.fields.file) {
          return <div className="text-red-500">Invalid asset</div>;
        }

        const { file } = asset.fields;
        const description = String(asset.fields.description || '');
        const title = String(asset.fields.title || '');
        const alt = description || title;

        if (file.contentType && file.contentType.startsWith('image/')) {
          return (
            <figure className="my-4">
              <img
                src={`https:${file.url}`}
                alt={alt}
                className="max-w-full h-auto rounded"
                loading="lazy"
              />
              {description && (
                <figcaption className={`mt-2 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {description}
                </figcaption>
              )}
            </figure>
          );
        }

        if (file.contentType && file.contentType.startsWith('video/')) {
          return (
            <div className="my-4">
              <video controls className="w-full">
                <source src={`https:${file.url}`} type={file.contentType} />
                Your browser does not support the video tag.
              </video>
              {description && (
                <p className={`mt-2 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {description}
                </p>
              )}
            </div>
          );
        }

        return (
          <a
            href={`https:${file.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center ${
              isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
            }`}
          >
            {title || file.fileName || 'Download file'}
          </a>
        );
      } catch (error) {
        onError?.(error as Error);
        return <div className="text-red-500">Failed to load asset</div>;
      }
    },
    [BLOCKS.EMBEDDED_ENTRY]: (node: Node) => {
      try {
        const entryNode = node as EmbeddedEntryNode;
        const entry = entryNode.data.target;

        if (!entry?.fields || !entry.sys?.contentType?.sys?.id) {
          return <div className="text-red-500">Invalid entry</div>;
        }

        if (isCodeBlockEntry(entry)) {
          const code = entry.fields.code || '';
          return (
            <pre className={`p-4 rounded-lg overflow-x-auto ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <code>{code}</code>
            </pre>
          );
        }

        if (isQuoteEntry(entry)) {
          const quote = entry.fields.quote || '';
          const author = entry.fields.author || '';
          const source = entry.fields.source || '';

          return (
            <blockquote className={`border-l-4 pl-4 my-4 ${
              isDark ? 'border-blue-500 text-gray-400' : 'border-blue-600 text-gray-600'
            }`}>
              <p className="italic">{quote}</p>
              {author && (
                <footer className="mt-2 text-sm">
                  — {author}
                  {source && ` (${source})`}
                </footer>
              )}
            </blockquote>
          );
        }

        return <div className="text-yellow-500">Unsupported entry type</div>;
      } catch (error) {
        onError?.(error as Error);
        return <div className="text-red-500">Failed to load entry</div>;
      }
    },
    [INLINES.HYPERLINK]: (node: Node, children: React.ReactNode) => {
      try {
        const hyperlinkNode = node as HyperlinkNode;
        return (
          <a
            href={hyperlinkNode.data.uri}
            target="_blank"
            rel="noopener noreferrer"
            className={`${
              isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
            } underline`}
          >
            {children}
          </a>
        );
      } catch (error) {
        onError?.(error as Error);
        return <span className="text-red-500">{children}</span>;
      }
    },
  },
});

const isCodeBlockEntry = (entry: Entry<EntrySkeletonType>): entry is CodeBlockEntry => {
  return entry.sys.contentType.sys.id === 'codeBlock';
};

const isQuoteEntry = (entry: Entry<EntrySkeletonType>): entry is QuoteEntry => {
  return entry.sys.contentType.sys.id === 'quote';
};

export default EnhancedRichTextRenderer; 