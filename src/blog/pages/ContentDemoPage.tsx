import React, { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from '../../components/Tabs';
import UnifiedContentRenderer from '../components/UnifiedContentRenderer';
import TableOfContents from '../components/TableOfContents';
import { TocItem } from '../types/blog';
import { Document, BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';

const ContentDemoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [extractedHeadings, setExtractedHeadings] = useState<TocItem[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string | undefined>(undefined);

  // Markdown example content
  const markdownContent = `
# Markdown Content Example
  
This is a demonstration of the **Unified Content Renderer** with Markdown content.

## What is Markdown?

Markdown is a lightweight markup language with plain text formatting syntax.
Its design allows it to be converted to many output formats, but the original tool by the same name only supports HTML.

### Basic Syntax

Markdown offers various text formatting options:

- **Bold Text**: Wrap text with double asterisks like **this**.
- *Italic Text*: Wrap text with single asterisks like *this*.
- [Links](https://example.com): Create links like \`[text](url)\`.
- \`Code\`: Use backticks for inline code.

### Code Blocks

\`\`\`javascript
// This is a code block
function hello() {
  console.log("Hello, world!");
}
\`\`\`

## Tables in Markdown

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

## Markdown Advantages

1. Easy to learn and use
2. Plain text format - no special software required
3. Portable and future-proof
4. Widely supported across platforms

### And More Features

> This is a blockquote in Markdown.
> It can span multiple lines.

---

![Sample Image](https://via.placeholder.com/600x300?text=Sample+Image)

#### Smaller Heading

This content should appear in the table of contents as a nested item.
`;

  // HTML example content
  const htmlContent = `
<h1>HTML Content Example</h1>

<p>This is a demonstration of the <strong>Unified Content Renderer</strong> with HTML content.</p>

<h2>What is HTML?</h2>

<p>HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser.</p>

<h3>Basic HTML Elements</h3>

<p>HTML includes various elements for document structure and formatting:</p>

<ul>
  <li><strong>Paragraphs</strong>: Defined with &lt;p&gt; tags</li>
  <li><em>Text formatting</em>: Using tags like &lt;strong&gt;, &lt;em&gt;, etc.</li>
  <li><a href="https://example.com">Links</a>: Created with anchor tags</li>
  <li><code>Code snippets</code>: Using the code tag</li>
</ul>

<h3>Code Example</h3>

<pre><code class="language-html">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;Sample Page&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Hello, world!&lt;/h1&gt;
  &lt;/body&gt;
&lt;/html&gt;
</code></pre>

<h2>HTML Advantages</h2>

<ol>
  <li>Universal browser support</li>
  <li>Easy to learn basics</li>
  <li>Foundation of web development</li>
</ol>

<h3>Additional Features</h3>

<blockquote>
  <p>This is a blockquote in HTML. It represents quoted content from another source.</p>
</blockquote>

<hr>

<figure>
  <img src="https://via.placeholder.com/600x300?text=HTML+Example" alt="Sample HTML Image">
  <figcaption>A sample image with caption</figcaption>
</figure>

<h4>Smaller Section Heading</h4>

<p>This content should appear in the table of contents as a nested item.</p>
`;

  // Rich Text example content
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
                  { nodeType: 'text', value: 'Text formatting', marks: [{ type: MARKS.BOLD }], data: {} },
                  { nodeType: 'text', value: ' (bold, italic, etc.)', marks: [], data: {} }
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
                content: [
                  { nodeType: 'text', value: 'Links to ', marks: [], data: {} },
                  { 
                    nodeType: INLINES.HYPERLINK, 
                    data: { uri: 'https://example.com' },
                    content: [{ nodeType: 'text', value: 'websites', marks: [], data: {} }]
                  }
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
                content: [
                  { nodeType: 'text', value: 'Structured content with headings', marks: [], data: {} }
                ]
              }
            ]
          }
        ]
      },
      {
        nodeType: BLOCKS.HEADING_2,
        data: {},
        content: [{ nodeType: 'text', value: 'Advantages of Rich Text', marks: [], data: {} }]
      },
      {
        nodeType: BLOCKS.OL_LIST,
        data: {},
        content: [
          {
            nodeType: BLOCKS.LIST_ITEM,
            data: {},
            content: [
              {
                nodeType: BLOCKS.PARAGRAPH,
                data: {},
                content: [{ nodeType: 'text', value: 'Structured data that\'s easy to render', marks: [], data: {} }]
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
                content: [{ nodeType: 'text', value: 'Portable across different platforms', marks: [], data: {} }]
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
                content: [{ nodeType: 'text', value: 'Allows embedding of assets and entries', marks: [], data: {} }]
              }
            ]
          }
        ]
      },
      {
        nodeType: BLOCKS.HEADING_3,
        data: {},
        content: [{ nodeType: 'text', value: 'Additional Notes', marks: [], data: {} }]
      },
      {
        nodeType: BLOCKS.QUOTE,
        data: {},
        content: [
          {
            nodeType: BLOCKS.PARAGRAPH,
            data: {},
            content: [{ nodeType: 'text', value: 'This is a blockquote in Rich Text format.', marks: [], data: {} }]
          }
        ]
      },
      {
        nodeType: BLOCKS.HR,
        data: {},
        content: []
      },
      {
        nodeType: BLOCKS.HEADING_4,
        data: {},
        content: [{ nodeType: 'text', value: 'Smaller Section', marks: [], data: {} }]
      },
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          { nodeType: 'text', value: 'This content should appear in the table of contents as a nested item.', marks: [], data: {} }
        ]
      }
    ]
  };

  // Auto-detect example content
  const autoDetectContent = `
# Auto-Detection Example

This content should be automatically detected as Markdown.

## How it works

The UnifiedContentRenderer will analyze the content structure and determine the most appropriate format:

1. For content with Markdown-style formatting (like this document)
2. For HTML content with proper tags
3. For Contentful Rich Text JSON structure

### Benefits of auto-detection

- Simpler implementation
- Fewer configuration requirements
- Graceful handling of mixed content

\`\`\`javascript
// The detection looks for patterns like code blocks
function detectContent(content) {
  // Implementation details
  return 'detected-format';
}
\`\`\`
`;

  // Handle Table of Contents link clicks
  const handleTocLinkClick = (id: string) => {
    setActiveHeadingId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Unified Content Renderer Demo</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Tabs activeTab={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab>Markdown</Tab>
              <Tab>HTML</Tab>
              <Tab>Rich Text</Tab>
              <Tab>Auto-Detect</Tab>
            </TabList>
            
            <TabPanel>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <UnifiedContentRenderer 
                  content={markdownContent} 
                  contentFormat="markdown"
                  onHeadingsExtracted={setExtractedHeadings}
                />
              </div>
            </TabPanel>
            
            <TabPanel>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <UnifiedContentRenderer 
                  content={htmlContent} 
                  contentFormat="html"
                  onHeadingsExtracted={setExtractedHeadings}
                />
              </div>
            </TabPanel>
            
            <TabPanel>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <UnifiedContentRenderer 
                  content={richTextContent} 
                  contentFormat="richText"
                  onHeadingsExtracted={setExtractedHeadings}
                />
              </div>
            </TabPanel>
            
            <TabPanel>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <UnifiedContentRenderer 
                  content={autoDetectContent}
                  onHeadingsExtracted={setExtractedHeadings}
                />
              </div>
            </TabPanel>
          </Tabs>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
            <TableOfContents 
              items={extractedHeadings} 
              activeId={activeHeadingId}
              onLinkClick={handleTocLinkClick}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">How to Use</h2>
        <p className="mb-2">The Unified Content Renderer supports three different content formats:</p>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Markdown</strong>: Plain text with Markdown syntax for simple content</li>
          <li><strong>HTML</strong>: Pre-rendered HTML content</li>
          <li><strong>Rich Text</strong>: Contentful's structured rich text format</li>
        </ul>
        <p>You can also provide no format and let the renderer auto-detect the format.</p>
        
        <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mt-4 overflow-x-auto">
          <code>{`// Basic usage
<UnifiedContentRenderer 
  content={markdownContent} 
  contentFormat="markdown"
  onHeadingsExtracted={setExtractedHeadings}
/>

// Auto-detect format
<UnifiedContentRenderer 
  content={content}
  onHeadingsExtracted={setExtractedHeadings}
/>`}</code>
        </pre>
      </div>
    </div>
  );
};

export default ContentDemoPage; 