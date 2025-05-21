import { Entry, Asset } from 'contentful';
import { Document as RichTextDocument } from '@contentful/rich-text-types';
import { BlogPost, BlogCategory, BlogTag, Author, BlogImage } from '../../models/Blog';
import { 
  ContentfulFields, 
  AuthorFields, 
  CategoryFields, 
  TagFields,
  isRichText,
  isAsset,
  isAuthorEntry,
  isCategoryEntry,
  isTagEntry,
  validateBlogPost
} from '../types/contentful';

class ContentfulTransformer {
  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  private generateExcerpt(content: string, maxLength = 160): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  }

  private transformAsset(asset: Asset | undefined): BlogImage | undefined {
    if (!asset?.fields?.file) return undefined;

    return {
      url: `https:${asset.fields.file.url}`,
      alt: asset.fields.description || asset.fields.title || '',
      width: asset.fields.file.details.image?.width,
      height: asset.fields.file.details.image?.height
    };
  }

  private async transformAuthor(entry: Entry<AuthorFields>): Promise<Author> {
    if (!entry.fields.name) {
      throw new Error(`Invalid author: Missing required field 'name'. Author ID: ${entry.sys.id}`);
    }

    return {
      id: entry.sys.id,
      name: entry.fields.name,
      bio: entry.fields.bio || undefined,
      avatar: this.transformAsset(entry.fields.avatar),
      email: entry.fields.email,
      social: entry.fields.social || {}
    };
  }

  private transformCategory(entry: Entry<CategoryFields>): BlogCategory {
    if (!entry.fields.name || !entry.fields.slug) {
      throw new Error(`Invalid category: Missing required fields. Category ID: ${entry.sys.id}`);
    }

    return {
      id: entry.sys.id,
      name: entry.fields.name,
      slug: entry.fields.slug,
      description: entry.fields.description
    };
  }

  private transformTag(entry: Entry<TagFields>): BlogTag {
    if (!entry.fields.name || !entry.fields.slug) {
      throw new Error(`Invalid tag: Missing required fields. Tag ID: ${entry.sys.id}`);
    }

    return {
      id: entry.sys.id,
      name: entry.fields.name,
      slug: entry.fields.slug
    };
  }

  private async transformContent(content: string | RichTextDocument | undefined): Promise<string> {
    if (!content) return '';
    
    if (typeof content === 'string') {
      return content;
    }
    
    if (isRichText(content)) {
      // The actual rich text transformation will be handled by the RichTextRenderer component
      return JSON.stringify(content);
    }
    
    return '';
  }

  async transformEntry(entry: Entry<ContentfulFields>): Promise<BlogPost> {
    try {
      // Validate basic structure
      const basePost = validateBlogPost(entry);
      const fields = entry.fields;

      // Transform content
      const content = await this.transformContent(fields.content);

      // Transform authors
      const authors: Author[] = [];
      if (Array.isArray(fields.authors)) {
        for (const authorEntry of fields.authors) {
          if (isAuthorEntry(authorEntry)) {
            const author = await this.transformAuthor(authorEntry);
            authors.push(author);
          }
        }
      }

      // Transform category
      let category: BlogCategory | undefined;
      if (fields.category && isCategoryEntry(fields.category)) {
        category = this.transformCategory(fields.category);
      }

      // Transform tags
      const tags: BlogTag[] = [];
      if (Array.isArray(fields.tags)) {
        for (const tagEntry of fields.tags) {
          if (isTagEntry(tagEntry)) {
            const tag = this.transformTag(tagEntry);
            tags.push(tag);
          }
        }
      }

      // Build the complete blog post
      return {
        ...basePost,
        content,
        authors,
        category,
        tags,
        excerpt: fields.excerpt || this.generateExcerpt(content),
        coverImage: this.transformAsset(fields.coverImage),
        readingTime: fields.readingTime || this.calculateReadTime(content)
      };
    } catch (error) {
      console.error('Error transforming Contentful entry:', error);
      throw new Error(`Failed to transform blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const contentfulTransformer = new ContentfulTransformer();
export default ContentfulTransformer; 