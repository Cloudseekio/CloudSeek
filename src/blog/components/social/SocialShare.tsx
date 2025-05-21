import React from 'react';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
  image?: string;
}

/**
 * SocialShare component for sharing content to social media platforms
 */
const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title,
  description,
  hashtags = [],
}) => {
  // Generate social sharing URLs
  const twitterUrl = React.useMemo(() => {
    const params = new URLSearchParams({
      url,
      text: title,
      hashtags: hashtags.join(',')
    });
    return `https://twitter.com/intent/tweet?${params.toString()}`;
  }, [url, title, hashtags]);

  const facebookUrl = React.useMemo(() => {
    const params = new URLSearchParams({
      u: url
    });
    return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
  }, [url]);

  const linkedInUrl = React.useMemo(() => {
    const params = new URLSearchParams({
      url,
      title,
      summary: description || '',
    });
    return `https://www.linkedin.com/shareArticle?mini=true&${params.toString()}`;
  }, [url, title, description]);

  const openShareWindow = (socialUrl: string) => {
    window.open(socialUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div 
      className="flex items-center gap-3" 
      data-testid="social-share"
      aria-label="Share this content"
    >
      <span className="text-sm font-medium">Share:</span>
      <button
        aria-label="Share on Twitter"
        className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors"
        onClick={() => openShareWindow(twitterUrl)}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 5.8a8.6 8.6 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3c-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7.1 3.8A11.8 11.8 0 0 1 3 4.9a4.2 4.2 0 0 0 1.3 5.6c-.7 0-1.3-.2-1.9-.5a4.1 4.1 0 0 0 3.4 4.1 4 4 0 0 1-2 .1 4.1 4.1 0 0 0 3.9 2.9A8.4 8.4 0 0 1 2 19.2a11.7 11.7 0 0 0 6.4 1.9c7.8 0 12-6.5 12-12.1v-.6c.8-.6 1.5-1.3 2-2.1l.6-.5z" />
        </svg>
      </button>
      <button
        aria-label="Share on Facebook"
        className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors"
        onClick={() => openShareWindow(facebookUrl)}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 12a8 8 0 1 0-9.3 8v-5.7H8.5V12h2.2V9.8c0-2.2 1.3-3.4 3.3-3.4 1 0 2 .2 2 .2v2.1h-1.2c-1.1 0-1.5.7-1.5 1.4V12h2.5l-.4 2.3h-2.1V20A8 8 0 0 0 20 12z" />
        </svg>
      </button>
      <button
        aria-label="Share on LinkedIn"
        className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors"
        onClick={() => openShareWindow(linkedInUrl)}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8.4 17.5H6.2V9.7h2.2v7.8zM7.3 8.7a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm10.2 8.8h-2.2v-3.4c0-.8 0-1.9-1.2-1.9s-1.4.9-1.4 1.8v3.5h-2.1V9.7h2v1h.1c.3-.6 1-1.2 2.2-1.2 2.3 0 2.7 1.5 2.7 3.5v4.5z" />
        </svg>
      </button>
    </div>
  );
};

export default SocialShare; 