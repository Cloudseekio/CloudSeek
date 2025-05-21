import React from 'react';
import { Link } from 'react-router-dom';

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  imageUrl: string;
  slug: string;
  isFeatured?: boolean;
}

export default function BlogCard({
  title,
  excerpt,
  date,
  author,
  category,
  imageUrl,
  slug,
  isFeatured = false,
}: BlogCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-[1.02]">
      <Link to={`/blog/${slug}`} className="block">
        <div className="relative h-48 w-full">
          <img
            src={imageUrl}
            alt={title}
            className="object-cover w-full h-full"
          />
          {isFeatured && (
            <span className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </span>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <span className="text-sm text-blue-600 font-medium">{category}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-sm text-gray-500">{date}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{excerpt}</p>
          <div className="flex items-center">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="ml-2 text-sm text-gray-600">{author.name}</span>
          </div>
        </div>
      </Link>
    </article>
  );
} 