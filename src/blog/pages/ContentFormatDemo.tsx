import React, { useState } from 'react';
import { Document, BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import UnifiedContentRenderer from '../components/UnifiedContentRenderer';
import { Tabs } from '../../components/Tabs';
import { TocItem } from '../types/blog';
import { useTheme } from '../../context/ThemeContext';

/**
 * A demo page to showcase the rendering of different content formats using
 * the UnifiedContentRenderer component. This page displays the same content
 * in three different formats: Rich Text, Markdown, and HTML.
 */
const ContentFormatDemo: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState(0);
  const [extractedHeadings, setExtractedHeadings] = useState<TocItem[]>([]);

  // Rich Text content (Contentful format)
  const richTextContent: Document = {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.HEADING_1,
        data: {},
        content: [{ nodeType: 'text', value: 'Rich Text Content Example', marks: [], data: {} }]
      },
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          { nodeType: 'text', value: 'This is a demonstration of the ', marks: [], data: {} },
          { nodeType: 'text', value: 'Unified Content Renderer', marks: [{ type: MARKS.BOLD }], data: {} },
          { nodeType: 'text', value: ' with Contentful Rich Text content.', marks: [], data: {} }
        ]
      },
      {
        nodeType: BLOCKS.HEADING_2,
        data: {},
        content: [{ nodeType: 'text', value: 'What is Rich Text?', marks: [], data: {} }]
      },
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          { 
            nodeType: 'text', 
            value: 'Rich Text is a format used by Contentful CMS that combines the structure of JSON with the formatting capabilities of traditional text editors.', 
            marks: [], 
            data: {} 
          }
        ]
      },
      {
        nodeType: BLOCKS.HEADING_3,
        data: {},
        content: [{ nodeType: 'text', value: 'Rich Text Features', marks: [], data: {} }]
      },
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          { nodeType: 'text', value: 'Rich Text includes various formatting options:', marks: [], data: {} }
        ]
      },
      {
        nodeType: BLOCKS.UL_LIST,
        data: {},
        content: [
          {
            nodeType: BLOCKS.LIST_ITEM,
            data: {},
            content: [
              {
                nodeType: BLOCKS.PARAGRAPH,
                data: {},
                content: [
                  { nodeType: 'text', value: 'Bold, ', marks: [{ type: MARKS.BOLD }], data: {} },
                  { nodeType: 'text', value: 'italic, ', marks: [{ type: MARKS.ITALIC }], data: {} },
                  { nodeType: 'text', value: 'and underlined text', marks: [{ type: MARKS.UNDERLINE }], data: {} }
                ]
              }
            ]
          },
          {
            nodeType: BLOCKS.LIST_ITEM,
            data: {},
            content: [
              {
                nodeType: BLOCKS.PARAGRAPH,
                data: {},
                content: [{ nodeType: 'text', value: 'Hierarchical headings (H1-H6)', marks: [], data: {} }]
              }
            ]
          },
          {
            nodeType: BLOCKS.LIST_ITEM,
            data: {},
            content: [
              {
                nodeType: BLOCKS.PARAGRAPH,
                data: {},
                content: [{ nodeType: 'text', value: 'Ordered and unordered lists', marks: [], data: {} }]
              }
            ]
          }
        ]
      },
      {
        nodeType: BLOCKS.HEADING_2,
        data: {},
        content: [{ nodeType: 'text', value: 'Code Example', marks: [], data: {} }]
      },
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          { nodeType: 'text', value: 'Here is an example of inline code: ', marks: [], data: {} },
          { nodeType: 'text', value: 'const renderer = new UnifiedContentRenderer()', marks: [{ type: MARKS.CODE }], data: {} }
        ]
      },
      {
        nodeType: BLOCKS.QUOTE,
        data: {},
        content: [
          {
            nodeType: BLOCKS.PARAGRAPH,
            data: {},
            content: [
              { nodeType: 'text', value: 'The unified content renderer is a powerful tool for displaying content in various formats.', marks: [], data: {} }
            ]
          }
        ]
      },
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          { nodeType: 'text', value: 'Learn more about Contentful at ', marks: [], data: {} },
          { 
            nodeType: INLINES.HYPERLINK,
            data: { uri: 'https://www.contentful.com' },
            content: [{ nodeType: 'text', value: 'Contentful.com', marks: [], data: {} }]
          }
        ]
      }
    ]
  };

  // Markdown content (equivalent to the Rich Text example)
  const markdownContent = `# Markdown Content Example

This is a demonstration of the **Unified Content Renderer** with Markdown content.

## What is Markdown?

Markdown is a lightweight markup language with plain text formatting syntax, designed to be converted to HTML and other formats.

### Markdown Features

Markdown includes various formatting options:

* **Bold**, *italic*, and __underlined text__
* Hierarchical headings (# to ######)
* Ordered and unordered lists

## Code Example

Here is an example of inline code: \`const renderer = new UnifiedContentRenderer()\`

Or a code block:

\`\`\`typescript
// Example code block
const renderContent = (content: string, format: ContentFormat) => {
  return <UnifiedContentRenderer content={content} contentFormat={format} />;
};
\`\`\`

> The unified content renderer is a powerful tool for displaying content in various formats.

Learn more about Markdown at [Markdown Guide](https://www.markdownguide.org/)
`;

  // HTML content (equivalent to the other examples)
  const htmlContent = `
<h1>HTML Content Example</h1>

<p>This is a demonstration of the <strong>Unified Content Renderer</strong> with HTML content.</p>

<h2>What is HTML?</h2>

<p>HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser.</p>

<h3>HTML Features</h3>

<p>HTML includes various formatting options:</p>

<ul>
  <li><strong>Bold</strong>, <em>italic</em>, and <u>underlined text</u></li>
  <li>Hierarchical headings (h1-h6)</li>
  <li>Ordered and unordered lists</li>
</ul>

<h2>Code Example</h2>

<p>Here is an example of inline code: <code>const renderer = new UnifiedContentRenderer()</code></p>

<pre><code class="language-typescript">
// Example code block
const renderContent = (content: string, format: ContentFormat) => {
  return &lt;UnifiedContentRenderer content={content} contentFormat={format} /&gt;;
};
</code></pre>

<blockquote>
  <p>The unified content renderer is a powerful tool for displaying content in various formats.</p>
</blockquote>

<p>Learn more about HTML at <a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank">MDN Web Docs</a></p>
`;

  // Handle headings extraction for Table of Contents
  const handleHeadingsExtracted = (headings: TocItem[]) => {
    setExtractedHeadings(headings);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Content Format Demo
      </h1>
      
      <div className="grid md:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="mb-6">
            <Tabs
              activeTab={activeTab}
              onChange={setActiveTab}
            >
              <Tabs.TabList>
                <Tabs.Tab>Rich Text</Tabs.Tab>
                <Tabs.Tab>Markdown</Tabs.Tab>
                <Tabs.Tab>HTML</Tabs.Tab>
              </Tabs.TabList>

              <Tabs.TabPanel>
                <div className={`p-6 rounded-md ${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}>
                  <UnifiedContentRenderer
                    content={richTextContent}
                    contentFormat="richText"
                    onHeadingsExtracted={handleHeadingsExtracted}
                  />
                </div>
              </Tabs.TabPanel>

              <Tabs.TabPanel>
                <div className={`p-6 rounded-md ${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}>
                  <UnifiedContentRenderer
                    content={markdownContent}
                    contentFormat="markdown"
                    onHeadingsExtracted={handleHeadingsExtracted}
                  />
                </div>
              </Tabs.TabPanel>

              <Tabs.TabPanel>
                <div className={`p-6 rounded-md ${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}>
                  <UnifiedContentRenderer
                    content={htmlContent}
                    contentFormat="html"
                    onHeadingsExtracted={handleHeadingsExtracted}
                  />
                </div>
              </Tabs.TabPanel>
            </Tabs>
          </div>
        </div>
        
        {/* Table of Contents Sidebar */}
        <div>
          <div className={`p-4 rounded-md ${isDark ? 'bg-gray-800' : 'bg-white'} shadow sticky top-4`}>
            <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Table of Contents
            </h2>
            {extractedHeadings.length > 0 ? (
              <nav>
                <ul className="space-y-1">
                  {extractedHeadings.map((heading) => (
                    <li 
                      key={heading.id} 
                      className={`${
                        heading.level === 1 ? 'ml-0' : 
                        heading.level === 2 ? 'ml-3' : 
                        'ml-6'
                      }`}
                    >
                      <a
                        href={`#${heading.id}`}
                        className={`${isDark ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : (
              <p className="text-gray-500">No headings found</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Format Source */}
      <div className="mt-8">
        <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Content Source
        </h2>
        <div className={`p-4 rounded-md ${isDark ? 'bg-gray-800' : 'bg-gray-100'} overflow-auto`}>
          <pre className="text-sm">
            {activeTab === 0 ? (
              JSON.stringify(richTextContent, null, 2)
            ) : activeTab === 1 ? (
              markdownContent
            ) : (
              htmlContent
            )}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ContentFormatDemo; 