import React from 'react';

interface AuthorBadgeProps {
  author: {
    name: string;
    avatar: string;
    title: string;
  };
}

const AuthorBadge: React.FC<AuthorBadgeProps> = ({ author }) => {
  return (
    <div className="author-badge">
      <img 
        src={author.avatar} 
        alt={author.name} 
        className="author-avatar" 
      />
      <div className="author-info">
        <div className="author-name">{author.name}</div>
        <div className="author-title">{author.title}</div>
      </div>
    </div>
  );
};

export default AuthorBadge; 