import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

interface BlogHeaderProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({
  title = 'Blog & Resources',
  subtitle = 'Insights, tutorials, and resources to help you get the most out of Salesforce and cloud technologies.',
  showSearch = false,
  searchQuery = '',
  onSearchChange
}) => {
  return (
    <section className="bg-blue-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
          {subtitle}
        </p>
        
        {showSearch && onSearchChange && (
          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-blue-300" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search articles..."
              className="py-3 pl-10 pr-4 block w-full bg-blue-700 border border-blue-500 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogHeader; 