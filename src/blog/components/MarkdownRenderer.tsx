import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../../context/ThemeContext';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * MarkdownRenderer component for rendering Markdown content
 * Uses react-markdown with customized components
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Code block component for syntax highlighting
  const CodeBlock = ({ language, value }: { language: string; value: string }) => {
    return (
      <div className="relative rounded-md overflow-hidden my-4">
        <SyntaxHighlighter
          language={language || 'javascript'}
          style={isDark ? tomorrow : prism}
          showLineNumbers
        >
          {value}
        </SyntaxHighlighter>
      </div>
    );
  };

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown 
        components={{
          code: ({className, children, ...props}) => {
            const match = /language-(\w+)/.exec(className || '');
            return !className?.includes('inline') && match ? (
              <CodeBlock
                language={match[1]}
                value={String(children).replace(/\n$/, '')}
              />
            ) : (
              <code className="px-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
          a: (props) => (
            <a 
              {...props} 
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target={props.href?.startsWith('http') ? '_blank' : undefined}
              rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            />
          ),
          h1: (props) => <h1 {...props} className="text-3xl font-bold mt-8 mb-4" />,
          h2: (props) => <h2 {...props} className="text-2xl font-bold mt-6 mb-3" />,
          h3: (props) => <h3 {...props} className="text-xl font-semibold mt-5 mb-3" />,
          h4: (props) => <h4 {...props} className="text-lg font-semibold mt-5 mb-2" />,
          h5: (props) => <h5 {...props} className="text-base font-semibold mt-4 mb-2" />,
          h6: (props) => <h6 {...props} className="text-sm font-semibold mt-4 mb-2 uppercase tracking-wider" />,
          p: (props) => <p {...props} className="mb-4 last:mb-0" />,
          ul: (props) => <ul {...props} className="list-disc pl-6 mb-4 space-y-1" />,
          ol: (props) => <ol {...props} className="list-decimal pl-6 mb-4 space-y-1" />,
          li: (props) => <li {...props} className="mb-1" />,
          blockquote: (props) => (
            <blockquote 
              {...props} 
              className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-1 my-4 italic text-gray-700 dark:text-gray-300" 
            />
          ),
          hr: (props) => <hr {...props} className="my-8 border-t border-gray-300 dark:border-gray-700" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 