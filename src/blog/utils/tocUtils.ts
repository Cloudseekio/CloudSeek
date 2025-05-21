import { Document } from '@contentful/rich-text-types';

export interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

interface RichTextNode {
  nodeType: string;
  content?: RichTextNode[];
  value?: string;
}

// Parse HTML content for headings
export const parseHtmlContent = (content: string): TocItem[] => {
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

  return buildHierarchy(headings);
};

// Parse Contentful Rich Text content for headings
export const parseRichTextContent = (document: Document): TocItem[] => {
  const headings: TocItem[] = [];
  let headingId = 0;

  const traverse = (node: RichTextNode) => {
    if (node.nodeType && node.nodeType.startsWith('heading-')) {
      const level = parseInt(node.nodeType.split('-')[1], 10);
      if (level <= 3) {
        const text = node.content?.[0]?.value || '';
        const id = `heading-${headingId++}`;
        
        headings.push({
          id,
          text: text.trim(),
          level,
          children: []
        });
      }
    }

    if (node.content) {
      node.content.forEach(traverse);
    }
  };

  traverse(document as RichTextNode);
  return buildHierarchy(headings);
};

// Build hierarchy from flat list of headings
const buildHierarchy = (items: TocItem[], parentLevel: number = 1): TocItem[] => {
  const result: TocItem[] = [];
  
  while (items.length > 0) {
    const item = items[0];
    
    if (item.level < parentLevel) {
      break;
    }
    
    if (item.level === parentLevel) {
      result.push({ ...items.shift()!, children: [] });
    } else {
      const lastItem = result[result.length - 1];
      if (lastItem) {
        lastItem.children = buildHierarchy(items, parentLevel + 1);
      }
    }
  }
  
  return result;
};

// Get the nearest heading element to a scroll position
export const getNearestHeading = (headings: Element[], scrollPosition: number): string | null => {
  for (let i = headings.length - 1; i >= 0; i--) {
    const heading = headings[i] as HTMLElement;
    if (heading.offsetTop <= scrollPosition) {
      return heading.id;
    }
  }
  return null;
}; 