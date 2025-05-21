import React from 'react';
import { Link } from 'react-router-dom';
import AuthorBadge from './AuthorBadge';
import OptimizedImage from './OptimizedImage';

interface BlogCardProps {
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

const BlogCard: React.FC<BlogCardProps> = ({
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
    <article className="blog-card" aria-labelledby={`blog-title-${title.replace(/\s+/g, '-').toLowerCase()}`}>
      <div className="blog-card-category" role="text" aria-label={`Category: ${category}`}>
        {category.toUpperCase()}
      </div>
      
      <Link to={link} className="blog-card-image-container" aria-hidden="true">
        <OptimizedImage 
          src={imageUrl} 
          alt={`Featured image for article: ${title}`}
          className="blog-card-image"
          blurUp={true}
          lazy={true}
          objectFit="cover"
        />
      </Link>
      
      <div className="blog-card-content">
        <header>
          <Link to={link}>
            <h2 id={`blog-title-${title.replace(/\s+/g, '-').toLowerCase()}`} className="blog-card-title">
              {title}
            </h2>
          </Link>
        </header>
        
        <p className="blog-card-excerpt">{excerpt}</p>
        
        <footer className="blog-card-meta">
          <div className="blog-card-author">
            <AuthorBadge author={author} />
          </div>
          <div className="blog-card-details">
            <time dateTime={new Date(date).toISOString()} className="blog-card-date">
              {date}
            </time>
            <span className="blog-card-read-time" aria-label={`Reading time: ${readTime}`}>
              {readTime}
            </span>
          </div>
        </footer>
      </div>
    </article>
  );
};

export default BlogCard; 