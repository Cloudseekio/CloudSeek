import React from 'react';
import { Twitter } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface TweetQuoteProps {
  quote: string;
  url: string;
  via?: string;
  related?: string[];
  className?: string;
}

const TweetQuote: React.FC<TweetQuoteProps> = ({
  quote,
  url,
  via,
  related = [],
  className = ''
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleTweetClick = () => {
    const tweetParams = new URLSearchParams({
      text: quote,
      url: url,
      ...(via && { via }),
      ...(related.length > 0 && { related: related.join(',') })
    });

    window.open(
      `https://twitter.com/intent/tweet?${tweetParams.toString()}`,
      'TwitterShare',
      'width=550,height=400'
    );
  };

  return (
    <blockquote
      className={`relative border-l-4 border-blue-500 pl-4 pr-8 py-2 my-4 ${
        isDark ? 'bg-gray-800/50' : 'bg-gray-50'
      } ${className}`}
    >
      <p className={`text-lg italic ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {quote}
      </p>
      <button
        onClick={handleTweetClick}
        className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
          isDark
            ? 'text-blue-400 hover:bg-blue-500/20'
            : 'text-blue-500 hover:bg-blue-100'
        }`}
        aria-label="Tweet this quote"
      >
        <Twitter size={18} />
      </button>
    </blockquote>
  );
};

export default TweetQuote; 