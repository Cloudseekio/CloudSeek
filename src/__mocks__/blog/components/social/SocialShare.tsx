import React from 'react';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title, description }) => {
  return (
    <div data-testid="social-share">
      <h3>Share: {title}</h3>
      <div className="social-buttons">
        <button aria-label="Share on Twitter">Twitter</button>
        <button aria-label="Share on Facebook">Facebook</button>
        <button aria-label="Share on LinkedIn">LinkedIn</button>
      </div>
      {description && <p>{description}</p>}
    </div>
  );
};

export default SocialShare; 