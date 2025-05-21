import React from 'react';
import { Twitter, Facebook, Linkedin, Link2, Mail } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  tags?: string[];
  className?: string;
  showCount?: boolean;
  source?: string;
  medium?: string;
  campaign?: string;
}

interface ShareCount {
  platform: string;
  count: number;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  url,
  title,
  description = '',
  tags = [],
  className = '',
  showCount = false,
  source = 'blog',
  medium = 'social',
  campaign = 'content_share'
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [shareCounts, setShareCounts] = React.useState<ShareCount[]>([]);

  // Add UTM parameters to URL
  const getShareUrl = (platform: string): string => {
    const utmParams = new URLSearchParams({
      utm_source: platform,
      utm_medium: medium,
      utm_campaign: campaign,
      utm_content: source
    });
    return `${url}?${utmParams.toString()}`;
  };

  // Share count fetching (mock implementation)
  React.useEffect(() => {
    if (showCount) {
      // In a real implementation, you would fetch actual share counts from an API
      setShareCounts([
        { platform: 'twitter', count: Math.floor(Math.random() * 100) },
        { platform: 'facebook', count: Math.floor(Math.random() * 150) },
        { platform: 'linkedin', count: Math.floor(Math.random() * 75) }
      ]);
    }
  }, [showCount, url]);

  const handleShare = async (platform: string) => {
    const shareUrl = getShareUrl(platform);
    const hashtags = tags.map(tag => tag.replace(/\s+/g, '')).join(',');

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}&hashtags=${hashtags}`,
          'TwitterShare',
          'width=550,height=400'
        );
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          'FacebookShare',
          'width=550,height=400'
        );
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          'LinkedInShare',
          'width=550,height=400'
        );
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + '\n\n' + shareUrl)}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl);
          // You might want to show a toast notification here
        } catch (err) {
          console.error('Failed to copy URL:', err);
        }
        break;
    }

    // Track share event
    try {
      await fetch('/api/track-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: shareUrl,
          platform,
          title,
          timestamp: new Date().toISOString()
        })
      });
    } catch (err) {
      console.error('Failed to track share:', err);
    }
  };

  const getShareCount = (platform: string): number => {
    return shareCounts.find(count => count.platform === platform)?.count || 0;
  };

  const buttonClasses = `inline-flex items-center px-3 py-2 rounded-lg transition-colors ${
    isDark
      ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
  }`;

  const countClasses = `ml-2 text-sm ${
    isDark ? 'text-gray-400' : 'text-gray-500'
  }`;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <button
        onClick={() => handleShare('twitter')}
        className={`${buttonClasses} bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20`}
        aria-label="Share on Twitter"
      >
        <Twitter size={18} />
        {showCount && <span className={countClasses}>{getShareCount('twitter')}</span>}
      </button>

      <button
        onClick={() => handleShare('facebook')}
        className={`${buttonClasses} bg-[#4267B2]/10 hover:bg-[#4267B2]/20`}
        aria-label="Share on Facebook"
      >
        <Facebook size={18} />
        {showCount && <span className={countClasses}>{getShareCount('facebook')}</span>}
      </button>

      <button
        onClick={() => handleShare('linkedin')}
        className={`${buttonClasses} bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20`}
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={18} />
        {showCount && <span className={countClasses}>{getShareCount('linkedin')}</span>}
      </button>

      <button
        onClick={() => handleShare('email')}
        className={buttonClasses}
        aria-label="Share via Email"
      >
        <Mail size={18} />
      </button>

      <button
        onClick={() => handleShare('copy')}
        className={buttonClasses}
        aria-label="Copy link"
      >
        <Link2 size={18} />
      </button>
    </div>
  );
};

export default ShareButtons; 