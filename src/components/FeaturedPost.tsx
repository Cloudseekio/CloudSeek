import React from 'react';
import { Link } from 'react-router-dom';
import AuthorBadge from './AuthorBadge';

interface FeaturedPostProps {
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  date: string;
  author: {
    name: string;
    avatar: string;
    title: string;
  };
  readTime: string;
  link: string;
}

const FeaturedPost: React.FC<FeaturedPostProps> = ({
  title,
  excerpt,
  imageUrl,
  category,
  date,
  author,
  readTime,
  link
}) => {
  return (
    <div className="featured-post">
      <div className="featured-post-image">
        <img src={imageUrl} alt={title} />
      </div>
      <div className="featured-post-content">
        <div className="featured-post-category">{category.toUpperCase()}</div>
        <Link to={link}>
          <h2 className="featured-post-title">{title}</h2>
        </Link>
        <p className="featured-post-excerpt">{excerpt}</p>
        <div className="featured-post-meta">
          <AuthorBadge author={author} />
          <div className="featured-post-details">
            <span className="featured-post-date">{date}</span>
            <span className="featured-post-read-time">{readTime}</span>
          </div>
        </div>
        <Link to={link} className="featured-post-link">
          Read more
        </Link>
      </div>
    </div>
  );
};

export default FeaturedPost; 