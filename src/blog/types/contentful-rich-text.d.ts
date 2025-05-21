import { Asset, Entry } from 'contentful';
import { Document, Node } from '@contentful/rich-text-types';

declare module '@contentful/rich-text-html-renderer' {
  export interface RenderNode {
    [key: string]: (node: Node) => string | Promise<string>;
  }

  export interface Options {
    renderNode?: {
      [key: string]: (node: Node & { 
        data: { 
          target: Asset | Entry<any>;
        };
      }) => string | Promise<string>;
    };
    renderMark?: {
      [key: string]: (text: string) => string;
    };
  }

  export function documentToHtmlString(
    document: Document,
    options?: Partial<Options>
  ): string;
} 