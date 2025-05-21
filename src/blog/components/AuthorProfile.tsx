import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Author } from '../types/blog';
import { 
  Twitter, 
  Linkedin, 
  Github, 
  Link as LinkIcon, 
  Mail,
  ExternalLink 
} from 'lucide-react';

interface AuthorProfileProps {
  author: Author;
  className?: string;
  showFullBio?: boolean;
  showAvatar?: boolean;
  avatarSize?: 'small' | 'medium' | 'large';
}

const getSocialIcon = (platform: string, size: number = 16) => {
  switch (platform.toLowerCase()) {
    case 'twitter':
      return <Twitter size={size} />;
    case 'linkedin':
      return <Linkedin size={size} />;
    case 'github':
      return <Github size={size} />;
    case 'email':
    case 'mail':
      return <Mail size={size} />;
    case 'website':
    default:
      return <LinkIcon size={size} />;
  }
};

/**
 * A component to display author information in the blog sidebar
 */
const AuthorProfile: React.FC<AuthorProfileProps> = ({ 
  author, 
  className = '',
  showFullBio = true,
  showAvatar = true,
  avatarSize = 'medium'
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Get avatar size class
  const getAvatarSizeClass = () => {
    switch (avatarSize) {
      case 'small':
        return 'w-10 h-10';
      case 'large':
        return 'w-20 h-20';
      case 'medium':
      default:
        return 'w-14 h-14';
    }
  };
  
  // Default avatar if none is provided
  const defaultAvatar = 'https://images.pexels.com/photos/7242908/pexels-photo-7242908.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150';
  
  // Get social links if available
  const socialLinks = author.social ? 
    Object.entries(author.social).filter(([, url]) => url) : 
    [];
  
  return (
    <div className={`flex items-start ${className}`}>
      {/* Author avatar */}
      {showAvatar && (
        <div className="flex-shrink-0 mr-4">
          <img 
            src={author.avatar || defaultAvatar} 
            alt={`${author.name}'s profile picture`} 
            className={`${getAvatarSizeClass()} rounded-full object-cover border ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}
          />
        </div>
      )}
      
      {/* Author info */}
      <div className="flex-grow">
        {/* Name and title */}
        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {author.name}
        </h4>
        
        {author.bio && (
          <p className={`mt-1 text-sm ${
            showFullBio 
              ? '' 
              : 'line-clamp-2'
          } ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {author.bio}
          </p>
        )}
        
        {/* Social links */}
        {socialLinks.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-3">
            {socialLinks.map(([platform, url]) => (
              <a 
                key={platform}
                href={url as string}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm flex items-center transition-colors ${
                  isDark 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-800'
                }`}
                aria-label={`${author.name}'s ${platform}`}
              >
                <span className="flex items-center">
                  {getSocialIcon(platform)}
                  <span className="ml-1 capitalize">{platform}</span>
                  <ExternalLink size={12} className="ml-1" />
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorProfile; 