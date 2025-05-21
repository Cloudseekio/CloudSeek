import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Twitter, 
  Linkedin, 
  Github, 
  Globe, 
  UserPlus, 
  UserCheck
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Author } from '../../../models/Blog';

interface AuthorCardProps {
  author: Author;
  variant?: 'default' | 'compact' | 'profile';
  postCount?: number;
  totalViews?: number;
  className?: string;
  showStats?: boolean;
  showFollow?: boolean;
  isFollowing?: boolean;
  onFollow?: (authorId: string) => void;
}

const AuthorCard: React.FC<AuthorCardProps> = ({
  author,
  variant = 'default',
  postCount = 0,
  totalViews = 0,
  className = '',
  showStats = true,
  showFollow = true,
  isFollowing = false,
  onFollow
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onFollow) {
      onFollow(author.id);
    }
  };

  const renderSocialLinks = () => {
    if (!author.socialLinks) return null;
    
    return (
      <div className="flex items-center space-x-3 mt-3">
        {author.socialLinks.twitter && (
          <a
            href={author.socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-gray-400 hover:${isDark ? 'text-blue-400' : 'text-blue-600'}`}
            aria-label="Twitter Profile"
          >
            <Twitter size={16} />
          </a>
        )}
        {author.socialLinks.linkedin && (
          <a
            href={author.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-gray-400 hover:${isDark ? 'text-blue-400' : 'text-blue-600'}`}
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={16} />
          </a>
        )}
        {author.socialLinks.github && (
          <a
            href={author.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-gray-400 hover:${isDark ? 'text-white' : 'text-gray-900'}`}
            aria-label="GitHub Profile"
          >
            <Github size={16} />
          </a>
        )}
        {author.socialLinks.website && (
          <a
            href={author.socialLinks.website}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-gray-400 hover:${isDark ? 'text-blue-400' : 'text-blue-600'}`}
            aria-label="Personal Website"
          >
            <Globe size={16} />
          </a>
        )}
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <Link 
        to={`/blog/authors/${author.id}`}
        className={`flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
      >
        <img
          src={author.avatar || 'https://via.placeholder.com/40'}
          alt={author.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3 flex-grow">
          <h3 className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
            {author.name}
          </h3>
          {author.title && (
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {author.title}
            </p>
          )}
        </div>
        {showFollow && (
          <button
            onClick={handleFollow}
            className={`ml-2 p-1 rounded-full ${
              isFollowing
                ? isDark
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-blue-100 text-blue-600'
                : isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isFollowing ? <UserCheck size={18} /> : <UserPlus size={18} />}
          </button>
        )}
      </Link>
    );
  }

  return (
    <div 
      className={`${
        variant === 'profile'
          ? 'p-6 md:p-8'
          : 'p-4'
      } rounded-lg ${
        isDark 
          ? 'bg-gray-800/50 hover:bg-gray-800' 
          : 'bg-white hover:bg-gray-50 border border-gray-200'
      } transition-colors ${className}`}
    >
      <div className="flex items-start">
        <img
          src={author.avatar || 'https://via.placeholder.com/80'}
          alt={author.name}
          className={`rounded-full object-cover ${
            variant === 'profile' ? 'w-24 h-24' : 'w-16 h-16'
          }`}
        />
        <div className="ml-4 flex-grow">
          <div className="flex items-start justify-between">
            <div>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                {author.name}
              </h2>
              {author.title && (
                <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {author.title}
                </p>
              )}
            </div>
            {showFollow && (
              <button
                onClick={handleFollow}
                className={`flex items-center px-4 py-2 rounded-full text-sm ${
                  isFollowing
                    ? isDark
                      ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    : isDark
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck size={16} className="mr-1.5" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus size={16} className="mr-1.5" />
                    Follow
                  </>
                )}
              </button>
            )}
          </div>

          {author.bio && variant === 'profile' && (
            <p className={`mt-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {author.bio}
            </p>
          )}

          {showStats && (
            <div className="mt-4 flex items-center space-x-4">
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  {postCount}
                </span>{' '}
                posts
              </div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  {totalViews.toLocaleString()}
                </span>{' '}
                views
              </div>
            </div>
          )}

          {renderSocialLinks()}
        </div>
      </div>
    </div>
  );
};

export default AuthorCard; 