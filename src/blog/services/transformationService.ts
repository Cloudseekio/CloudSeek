import { Asset } from 'contentful';
import { Document } from '@contentful/rich-text-types';
import { BlogPost, BlogCategory, BlogTag, Author, BlogImage } from '../types/blog';
import { BlogPostEntry, CategoryEntry, TagEntry, AuthorEntry } from '../types/contentful';
import { ValidationService } from './validationService';
import logger from '../../utils/logger';

export class TransformationError extends Error {
  constructor(message: string, public field?: string, public originalError?: Error) {
    super(message);
    this.name = 'TransformationError';
  }
}

export class TransformationService {
  private static instance: TransformationService;
  private validationService: ValidationService;

  private constructor() {
    this.validationService = ValidationService.getInstance();
  }

  static getInstance(): TransformationService {
    if (!TransformationService.instance) {
      TransformationService.instance = new TransformationService();
    }
    return TransformationService.instance;
  }

  transformBlogPost(entry: BlogPostEntry): BlogPost {
    try {
      const fields = entry.fields;
      
      const blogPost: BlogPost = {
        id: entry.sys.id,
        title: fields.title,
        slug: fields.slug,
        excerpt: fields.excerpt ?? '',
        content: typeof fields.content === 'string' ? fields.content : JSON.stringify(fields.content),
        rawContent: fields.content,
        contentFormat: fields.contentFormat,
        publishDate: new Date(entry.sys.createdAt).toISOString(),
        modifiedDate: new Date(entry.sys.updatedAt).toISOString(),
        authors: this.transformAuthors(fields.authors),
        category: this.transformCategory(fields.category),
        tags: this.transformTags(fields.tags),
        coverImage: fields.coverImage ? this.transformImage(fields.coverImage) : undefined,
        readingTime: this.calculateReadingTime(fields.content),
        featured: fields.featured ?? false,
        status: fields.status,
        tocItems: this.generateTableOfContents(fields.content as Document)
      };

      const validation = this.validationService.validateBlogPost(blogPost);
      if (!validation.success) {
        throw new TransformationError(
          'Failed to validate transformed blog post',
          undefined,
          new Error(validation.errors?.message)
        );
      }

      return blogPost;
    } catch (error) {
      logger.error('Error transforming blog post:', error);
      throw new TransformationError(
        'Failed to transform blog post',
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  transformCategory(entry: CategoryEntry): BlogCategory {
    try {
      const fields = entry.fields;
      
      const category: BlogCategory = {
        id: entry.sys.id,
        name: fields.name,
        slug: fields.slug,
        description: fields.description ?? ''
      };

      const validation = this.validationService.validateBlogCategory(category);
      if (!validation.success) {
        throw new TransformationError(
          'Failed to validate transformed category',
          undefined,
          new Error(validation.errors?.message)
        );
      }

      return category;
    } catch (error) {
      logger.error('Error transforming category:', error);
      throw new TransformationError(
        'Failed to transform category',
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  transformTag(entry: TagEntry): BlogTag {
    try {
      const fields = entry.fields;
      
      const tag: BlogTag = {
        id: entry.sys.id,
        name: fields.name,
        slug: fields.slug
      };

      const validation = this.validationService.validateBlogTag(tag);
      if (!validation.success) {
        throw new TransformationError(
          'Failed to validate transformed tag',
          undefined,
          new Error(validation.errors?.message)
        );
      }

      return tag;
    } catch (error) {
      logger.error('Error transforming tag:', error);
      throw new TransformationError(
        'Failed to transform tag',
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  transformAuthor(entry: AuthorEntry): Author {
    try {
      const fields = entry.fields;
      
      const author: Author = {
        id: entry.sys.id,
        name: fields.name,
        bio: fields.bio ?? '',
        avatar: fields.avatar ? this.transformImage(fields.avatar) : undefined,
        email: fields.email ?? '',
        social: this.transformSocialLinks(fields.social ?? {})
      };

      const validation = this.validationService.validateAuthor(author);
      if (!validation.success) {
        throw new TransformationError(
          'Failed to validate transformed author',
          undefined,
          new Error(validation.errors?.message)
        );
      }

      return author;
    } catch (error) {
      logger.error('Error transforming author:', error);
      throw new TransformationError(
        'Failed to transform author',
        undefined,
        error instanceof Error ? error : undefined
      );
    }
  }

  private transformAuthors(authors: AuthorEntry[]): Author[] {
    return authors?.map(author => this.transformAuthor(author)) ?? [];
  }

  private transformTags(tags: TagEntry[]): BlogTag[] {
    return tags?.map(tag => this.transformTag(tag)) ?? [];
  }

  private transformImage(asset: Asset): BlogImage | undefined {
    if (!asset || !asset.fields) return undefined;

    return {
      url: asset.fields.file.url,
      alt: asset.fields.description || '',
      width: asset.fields.file.details?.image?.width,
      height: asset.fields.file.details?.image?.height,
      source: 'contentful',
      caption: asset.fields.title
    };
  }

  private transformSocialLinks(social: Record<string, string>): Record<string, string> {
    if (!social) return {};
    
    const validatedLinks: Record<string, string> = {};
    Object.entries(social).forEach(([platform, url]) => {
      if (this.validationService.validateUrl(url)) {
        validatedLinks[platform] = url;
      } else {
        logger.warn(`Invalid social media URL for platform ${platform}`);
      }
    });
    
    return validatedLinks;
  }

  private calculateReadingTime(content: string | Document): number {
    const wordsPerMinute = 200;
    let wordCount = 0;

    if (typeof content === 'string') {
      wordCount = content.trim().split(/\s+/).length;
    } else if (content && typeof content === 'object') {
      const plainText = this.extractTextFromRichText(content);
      wordCount = plainText.trim().split(/\s+/).length;
    }

    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  private extractTextFromRichText(document: Document): string {
    const extractText = (node: Document | { nodeType: string; value?: string; content?: any[] }): string => {
      if (node.nodeType === 'text') {
        return (node as { value: string }).value;
      }
      if ('content' in node && Array.isArray(node.content)) {
        return node.content.map(n => extractText(n)).join(' ');
      }
      return '';
    };

    return document.content.map(node => extractText(node)).join(' ');
  }

  private generateTableOfContents(content: Document): BlogPost['tocItems'] {
    if (!content || !content.content) return [];

    const tocItems: BlogPost['tocItems'] = [];
    const processNode = (node: { nodeType: string; content?: any[] }) => {
      if (node.nodeType.startsWith('heading-')) {
        const level = parseInt(node.nodeType.split('-')[1]);
        const text = node.content
          ?.filter(n => n.nodeType === 'text')
          .map(n => n.value)
          .join('') ?? '';
        
        tocItems.push({
          id: `heading-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          text,
          level
        });
      }
      
      if (node.content) {
        node.content.forEach(processNode);
      }
    };

    content.content.forEach(processNode);
    return tocItems;
  }
} 