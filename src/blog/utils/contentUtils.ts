import { Document } from '@contentful/rich-text-types';
import { TocItem } from '../types/blog';

/**
 * Extracts headings from HTML content using regex
 * @param content HTML content string
 * @returns Array of TocItem objects
 */
export function extractHeadingsFromHtml(content: string): TocItem[] {
  const headingRegex = /<h([1-3])[^>]*id="([^"]+)"[^>]*>([^<]+)<\/h\1>/g;
  const headings: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const [, level, id, text] = match;
    headings.push({
      id,
      text: text.trim(),
      level: parseInt(level, 10),
      children: []
    });
  }

  return buildTocHierarchy(headings);
}

/**
 * Extracts headings from markdown content
 * @param content Markdown content string
 * @returns Array of TocItem objects
 */
export function extractHeadingsFromMarkdown(content: string): TocItem[] {
  // Match markdown headings (## Heading)
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let headingId = 0;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const [, hashes, text] = match;
    const level = hashes.length;
    const sanitizedText = text.trim();
    // Create an ID from the heading text
    const id = `heading-${++headingId}`;
    
    headings.push({
      id,
      text: sanitizedText,
      level,
      children: []
    });
  }

  return buildTocHierarchy(headings);
}

/**
 * Extracts headings from Contentful Rich Text
 * @param document Contentful Rich Text document
 * @returns Array of TocItem objects
 */
export function extractHeadingsFromRichText(document: Document): TocItem[] {
  const headings: TocItem[] = [];
  let headingId = 0;

  // Helper function to recursively traverse the document
  const traverseNodes = (nodes: any[]): void => {
    if (!nodes || !Array.isArray(nodes)) return;
    
    for (const node of nodes) {
      if (node.nodeType && node.nodeType.startsWith('heading-')) {
        const level = parseInt(node.nodeType.split('-')[1], 10);
        
        if (level <= 3) { // Only process h1, h2, h3
          const textNode = node.content?.find((n: any) => n.nodeType === 'text');
          const text = textNode?.value || '';
          
          if (text.trim()) {
            const id = `heading-${++headingId}`;
            headings.push({
              id,
              text: text.trim(),
              level,
              children: []
            });
          }
        }
      }
      
      // Recursively process child nodes if they exist
      if (node.content) {
        traverseNodes(node.content);
      }
    }
  };

  // Start traversal with the document's content
  if (document.content) {
    traverseNodes(document.content);
  }

  return buildTocHierarchy(headings);
}

/**
 * Builds a hierarchical structure from flat list of headings
 * @param items Flat array of TocItem objects
 * @param parentLevel Starting level for the hierarchy (usually 1)
 * @returns Hierarchical array of TocItem objects
 */
export function buildTocHierarchy(items: TocItem[], parentLevel: number = 1): TocItem[] {
  const result: TocItem[] = [];
  const itemsCopy = [...items]; // Work with a copy to avoid modifying the original array
  
  while (itemsCopy.length > 0) {
    const item = itemsCopy[0];
    
    if (item.level < parentLevel) {
      break;
    }
    
    if (item.level === parentLevel) {
      itemsCopy.shift(); // Remove the item from the array
      result.push({ ...item, children: [] });
    } else {
      const lastItem = result[result.length - 1];
      if (lastItem) {
        lastItem.children = buildTocHierarchy(itemsCopy, parentLevel + 1);
      } else {
        // If there's no parent item but we have a child level heading, 
        // treat it as if it's at the parent level
        const orphanItem = itemsCopy.shift();
        if (orphanItem) {
          result.push({ ...orphanItem, level: parentLevel, children: [] });
        }
      }
    }
  }
  
  return result;
}

/**
 * Injects IDs into HTML headings for anchor links
 * @param content HTML content
 * @returns HTML content with ID attributes added to headings
 */
export function injectHeadingIds(content: string): string {
  let headingCount = 0;
  
  // Replace headings with versions that have IDs
  return content.replace(
    /<h([1-3])>([^<]+)<\/h\1>/g, 
    (match, level, text) => {
      const sanitizedText = text.trim();
      const id = `heading-${++headingCount}`;
      return `<h${level} id="${id}">${sanitizedText}</h${level}>`;
    }
  );
}

/**
 * Get the nearest heading element to the current scroll position
 * @param headings Array of heading DOM elements
 * @param scrollPosition Current scroll position
 * @returns ID of the nearest heading or null
 */
export function getNearestHeading(headings: Element[], scrollPosition: number): string | null {
  for (let i = headings.length - 1; i >= 0; i--) {
    const heading = headings[i] as HTMLElement;
    if (heading.offsetTop <= scrollPosition) {
      return heading.id;
    }
  }
  return headings.length > 0 ? headings[0].id : null;
}

/**
 * Calculate reading time based on content length
 * @param content The content to calculate reading time for
 * @param wordsPerMinute Average reading speed (default: 200)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute)); // Minimum 1 minute
}

/**
 * Generate an excerpt from content
 * @param content The content to extract excerpt from
 * @param maxLength Maximum length of excerpt (default: 160)
 * @returns Excerpt string
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  // Remove HTML tags and trim whitespace
  const text = content.replace(/<[^>]*>/g, '').trim();
  
  if (text.length <= maxLength) return text;
  
  // Find the last space within the character limit
  const truncated = text.substr(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace === -1) return truncated + '...';
  
  return truncated.substr(0, lastSpace) + '...';
}

/**
 * Transforms blog content from any format (Markdown, Rich Text, HTML) into HTML
 * with consistent features like heading IDs for TOC, syntax highlighting, etc.
 */
export async function transformContent(
  content: string | Document,
  contentFormat: ContentFormat,
  options?: {
    assetTransformer?: (id: string) => Promise<{ url: string; alt: string; contentType: string }>;
    entryTransformer?: (id: string, type: string) => Promise<any>;
    syntaxHighlighter?: (code: string, language: string) => string;
    baseUrl?: string;
  }
): Promise<string> {
  const opts = {
    assetTransformer: options?.assetTransformer,
    entryTransformer: options?.entryTransformer,
    syntaxHighlighter: options?.syntaxHighlighter || ((code, lang) => code),
    baseUrl: options?.baseUrl || '',
  };

  try {
    // Process based on content format
    let html = '';
    
    if (contentFormat === 'richText' && !isString(content)) {
      html = await transformRichTextToHtml(content as Document, opts);
    } else if (contentFormat === 'markdown' && isString(content)) {
      html = await transformMarkdownToHtml(content as string, opts);
    } else if (contentFormat === 'html' && isString(content)) {
      html = transformHtml(content as string, opts);
    } else {
      throw new Error(`Invalid content format or content type mismatch: ${contentFormat}`);
    }

    // Add additional processing for all formats
    html = injectHeadingIds(html);
    html = makeExternalLinksSecure(html);
    html = addLazyLoadingToImages(html);
    
    return html;
  } catch (error) {
    console.error('Error transforming content:', error);
    return `<div class="error-message">
      <p>Error rendering content. Please try again later.</p>
      ${process.env.NODE_ENV === 'development' ? `<pre>${error instanceof Error ? error.message : String(error)}</pre>` : ''}
    </div>`;
  }
}

/**
 * Helper to transform Rich Text Document to HTML
 */
async function transformRichTextToHtml(
  document: Document,
  options: {
    assetTransformer?: (id: string) => Promise<{ url: string; alt: string; contentType: string }>;
    entryTransformer?: (id: string, type: string) => Promise<any>;
    syntaxHighlighter: (code: string, language: string) => string;
    baseUrl: string;
  }
): Promise<string> {
  const { documentToHtmlString } = await import('@contentful/rich-text-html-renderer');
  const { BLOCKS, INLINES, MARKS } = await import('@contentful/rich-text-types');
  
  // Create rendering options
  const renderOptions = {
    renderMark: {
      [MARKS.BOLD]: (text: string) => `<strong>${text}</strong>`,
      [MARKS.ITALIC]: (text: string) => `<em>${text}</em>`,
      [MARKS.UNDERLINE]: (text: string) => `<u>${text}</u>`,
      [MARKS.CODE]: (text: string) => `<code class="inline-code">${text}</code>`,
    },
    renderNode: {
      // Paragraphs
      [BLOCKS.PARAGRAPH]: (node: any, next: any) => `<p>${next(node.content)}</p>`,
      
      // Headings
      [BLOCKS.HEADING_1]: (node: any, next: any) => {
        const text = next(node.content);
        return `<h1>${text}</h1>`;
      },
      [BLOCKS.HEADING_2]: (node: any, next: any) => {
        const text = next(node.content);
        return `<h2>${text}</h2>`;
      },
      [BLOCKS.HEADING_3]: (node: any, next: any) => {
        const text = next(node.content);
        return `<h3>${text}</h3>`;
      },
      [BLOCKS.HEADING_4]: (node: any, next: any) => {
        const text = next(node.content);
        return `<h4>${text}</h4>`;
      },
      [BLOCKS.HEADING_5]: (node: any, next: any) => {
        const text = next(node.content);
        return `<h5>${text}</h5>`;
      },
      [BLOCKS.HEADING_6]: (node: any, next: any) => {
        const text = next(node.content);
        return `<h6>${text}</h6>`;
      },
      
      // Lists
      [BLOCKS.UL_LIST]: (node: any, next: any) => `<ul class="list-disc list-inside my-4">${next(node.content)}</ul>`,
      [BLOCKS.OL_LIST]: (node: any, next: any) => `<ol class="list-decimal list-inside my-4">${next(node.content)}</ol>`,
      [BLOCKS.LIST_ITEM]: (node: any, next: any) => `<li class="mb-2">${next(node.content)}</li>`,
      
      // Blockquotes
      [BLOCKS.QUOTE]: (node: any, next: any) => `<blockquote class="border-l-4 border-gray-300 pl-4 my-4 italic">${next(node.content)}</blockquote>`,
      
      // Horizontal rule
      [BLOCKS.HR]: () => `<hr class="my-8 border-t border-gray-300" />`,
      
      // Code blocks
      [BLOCKS.EMBEDDED_ASSET]: async (node: any) => {
        // If no asset transformer provided, show placeholder
        if (!options.assetTransformer) {
          return '<div class="embedded-asset-placeholder">Embedded Asset</div>';
        }
        
        try {
          const assetId = node.data?.target?.sys?.id;
          if (!assetId) return '<div class="embedded-asset-error">Invalid asset reference</div>';
          
          const asset = await options.assetTransformer(assetId);
          
          if (!asset) {
            return '<div class="embedded-asset-error">Asset not found</div>';
          }
          
          // Render based on content type
          if (asset.contentType.startsWith('image/')) {
            return `
              <figure class="my-6 text-center">
                <img 
                  src="${asset.url}" 
                  alt="${asset.alt}" 
                  class="max-w-full h-auto rounded-lg mx-auto" 
                />
                ${asset.alt ? `<figcaption class="mt-2 text-sm text-gray-600 dark:text-gray-400">${asset.alt}</figcaption>` : ''}
              </figure>
            `;
          }
          
          if (asset.contentType.startsWith('video/')) {
            return `
              <div class="my-6">
                <video src="${asset.url}" controls class="w-full rounded-lg" title="${asset.alt}">
                  Your browser does not support the video tag.
                </video>
                ${asset.alt ? `<p class="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">${asset.alt}</p>` : ''}
              </div>
            `;
          }
          
          // For other file types
          return `
            <div class="my-6 p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
              <a 
                href="${asset.url}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
              >
                <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                ${asset.alt || 'Download file'}
              </a>
            </div>
          `;
        } catch (error) {
          console.error('Error rendering embedded asset:', error);
          return '<div class="embedded-asset-error">Failed to load asset</div>';
        }
      },
      
      // Embedded entries (like code blocks, quotes, etc.)
      [BLOCKS.EMBEDDED_ENTRY]: async (node: any) => {
        if (!options.entryTransformer) {
          return '<div class="embedded-entry-placeholder">Embedded Entry</div>';
        }
        
        try {
          const entryId = node.data?.target?.sys?.id;
          const contentType = node.data?.target?.sys?.contentType?.sys?.id;
          
          if (!entryId || !contentType) {
            return '<div class="embedded-entry-error">Invalid entry reference</div>';
          }
          
          const entry = await options.entryTransformer(entryId, contentType);
          
          if (!entry) {
            return '<div class="embedded-entry-error">Entry not found</div>';
          }
          
          // Render based on content type
          switch (contentType) {
            case 'codeBlock':
              const code = entry.code || '';
              const language = entry.language || 'javascript';
              const highlightedCode = options.syntaxHighlighter(code, language);
              
              return `
                <div class="code-block my-6">
                  <div class="code-header flex items-center justify-between px-4 py-2 bg-gray-800 text-white rounded-t-lg">
                    <span>${language}</span>
                    <button class="copy-button text-sm" data-code="${Buffer.from(code).toString('base64')}">
                      Copy
                    </button>
                  </div>
                  <pre class="language-${language} p-4 bg-gray-900 rounded-b-lg overflow-x-auto"><code>${highlightedCode}</code></pre>
                </div>
              `;
            
            case 'quote':
              const quote = entry.quote || '';
              const author = entry.author || '';
              const source = entry.source || '';
              
              return `
                <blockquote class="my-6 px-4 py-3 border-l-4 border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
                  <p class="italic">${quote}</p>
                  ${author ? `<footer class="mt-2 text-sm">— ${author}${source ? `, <cite>${source}</cite>` : ''}</footer>` : ''}
                </blockquote>
              `;
            
            default:
              return `<div class="embedded-entry">${JSON.stringify(entry)}</div>`;
          }
        } catch (error) {
          console.error('Error rendering embedded entry:', error);
          return '<div class="embedded-entry-error">Failed to load entry</div>';
        }
      },
      
      // Hyperlinks
      [INLINES.HYPERLINK]: (node: any, next: any) => {
        const uri = node.data.uri;
        const isExternal = uri.startsWith('http') && !uri.startsWith(options.baseUrl);
        const externalAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
        
        return `<a href="${uri}"${externalAttrs} class="text-blue-600 hover:underline dark:text-blue-400">${next(node.content)}</a>`;
      },
      
      // Default handling for any other node types
      [BLOCKS.DOCUMENT]: (node: any, next: any) => next(node.content),
      [BLOCKS.TABLE]: (node: any, next: any) => `<div class="table-responsive"><table class="table-auto w-full border-collapse my-4">${next(node.content)}</table></div>`,
      [BLOCKS.TABLE_ROW]: (node: any, next: any) => `<tr>${next(node.content)}</tr>`,
      [BLOCKS.TABLE_CELL]: (node: any, next: any) => `<td class="border px-4 py-2">${next(node.content)}</td>`,
      [BLOCKS.TABLE_HEADER_CELL]: (node: any, next: any) => `<th class="border px-4 py-2 font-bold">${next(node.content)}</th>`,
    }
  };
  
  // Custom document to HTML string implementation to handle async renderers
  const customRendering = async (document: Document): Promise<string> => {
    // THIS IS A SIMPLIFIED VERSION - actual implementation would need to traverse nodes recursively
    const html = documentToHtmlString(document, renderOptions as any);
    return html;
  };
  
  return await customRendering(document);
}

/**
 * Helper to transform Markdown to HTML
 */
async function transformMarkdownToHtml(
  markdown: string,
  options: {
    syntaxHighlighter: (code: string, language: string) => string;
    baseUrl: string;
  }
): Promise<string> {
  try {
    // Use a markdown parser like Marked or Remark, preferably allowing async operation
    // For simplicity, we're using a basic approach here
    
    // Convert headings
    let html = markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\n/gim, '<br>');
    
    // Handle code blocks - in real implementation, use a proper markdown parser
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/gm;
    html = html.replace(codeBlockRegex, (match, language, code) => {
      const lang = language || 'plaintext';
      const highlightedCode = options.syntaxHighlighter(code, lang);
      
      return `
        <div class="code-block my-6">
          <div class="code-header flex items-center justify-between px-4 py-2 bg-gray-800 text-white rounded-t-lg">
            <span>${lang}</span>
            <button class="copy-button text-sm" data-code="${Buffer.from(code).toString('base64')}">
              Copy
            </button>
          </div>
          <pre class="language-${lang} p-4 bg-gray-900 rounded-b-lg overflow-x-auto"><code>${highlightedCode}</code></pre>
        </div>
      `;
    });
    
    return html;
  } catch (error) {
    console.error('Error transforming markdown:', error);
    return `<div class="error-message">Error rendering markdown content</div>`;
  }
}

/**
 * Helper to enhance HTML content
 */
function transformHtml(
  html: string,
  options: {
    baseUrl: string;
  }
): string {
  return html;
}

/**
 * Makes external links secure by adding appropriate attributes
 */
function makeExternalLinksSecure(html: string): string {
  const linkRegex = /<a\s+(?:[^>]*?\s+)?href="(http[s]?:\/\/[^"]+)"([^>]*)>/gi;
  return html.replace(linkRegex, (match, url, attrs) => {
    if (!attrs.includes('rel=')) {
      attrs += ' rel="noopener noreferrer"';
    }
    if (!attrs.includes('target=')) {
      attrs += ' target="_blank"';
    }
    return `<a href="${url}"${attrs}>`;
  });
}

/**
 * Adds lazy loading to images
 */
function addLazyLoadingToImages(html: string): string {
  return html.replace(/<img\s+([^>]*)>/gi, (match, attrs) => {
    if (!attrs.includes('loading=')) {
      return `<img ${attrs} loading="lazy">`;
    }
    return match;
  });
}

/**
 * Helper method to check if a value is a string
 */
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Checks if an entry is a blog post (supports multiple content type IDs)
 * @param entry Contentful entry
 * @returns boolean indicating if the entry is a blog post
 */
export function isBlogPostEntry(entry: unknown): boolean {
  if (!entry || typeof entry !== 'object') return false;
  
  const contentType = (entry as any)?.sys?.contentType?.sys?.id;
  // Check for both the new content type ID 'blogpost' and any legacy IDs
  return contentType === 'blogpost' || contentType === 'CloudsSeek BlogPost';
} 