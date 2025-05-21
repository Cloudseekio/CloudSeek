import { BlogPost } from '../../models/Blog';

interface ShareEvent {
  url: string;
  platform: string;
  title: string;
  timestamp: string;
}

interface ShareCount {
  facebook: number;
  twitter: number;
  linkedin: number;
  total: number;
}

class SocialService {
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getShareCount(url: string): Promise<ShareCount> {
    await this.delay();
    // Mock implementation - in production, you would call actual social APIs
    return {
      facebook: Math.floor(Math.random() * 100),
      twitter: Math.floor(Math.random() * 100),
      linkedin: Math.floor(Math.random() * 100),
      total: Math.floor(Math.random() * 300)
    };
  }

  async trackShare(url: string, platform: string): Promise<void> {
    try {
      await fetch('/api/track-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          platform,
          timestamp: new Date().toISOString()
        })
      });
    } catch (err) {
      console.error('Failed to track share:', err);
    }
  }

  async generateEmbedCode(post: BlogPost, siteUrl: string): Promise<string> {
    return `<iframe
      src="${siteUrl}/blog/embed/${post.slug}"
      width="100%"
      height="400"
      frameborder="0"
      scrolling="no"
      title="${post.title}"
      style="border: 1px solid #E5E7EB; border-radius: 8px; max-width: 100%;"
    ></iframe>`;
  }

  getShareUrl(url: string, platform: string, options: {
    title?: string;
    description?: string;
    tags?: string[];
    via?: string;
  } = {}): string {
    const { title, description, tags, via } = options;

    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?${new URLSearchParams({
          text: title || '',
          url: url,
          ...(via && { via }),
          ...(tags?.length && { hashtags: tags.join(',') })
        })}`;

      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({
          u: url
        })}`;

      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({
          url: url
        })}`;

      case 'email':
        return `mailto:?${new URLSearchParams({
          subject: title || '',
          body: `${description || ''}\n\n${url}`
        })}`;

      default:
        return url;
    }
  }

  async autoPost(post: BlogPost, platforms: string[]): Promise<void> {
    await this.delay();
    // Mock implementation - in production, you would integrate with social media APIs
    console.log('Auto-posting to platforms:', platforms, 'Post:', post.title);
  }
}

export const socialService = new SocialService(); 