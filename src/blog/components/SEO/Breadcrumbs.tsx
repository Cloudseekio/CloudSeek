import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { BlogPost, BlogCategory, Author } from '../../../models/Blog';

interface BreadcrumbsProps {
  items: {
    label: string;
    href: string;
  }[];
  post?: BlogPost;
  category?: BlogCategory;
  author?: Author;
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  post,
  category,
  author,
  className = ''
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Generate structured data
  const getStructuredData = () => {
    const itemListElement = items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement
    };
  };

  return (
    <>
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>

      {/* Visual Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className={`${className} ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
      >
        <ol className="flex items-center space-x-2 text-sm">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  size={16}
                  className={`mx-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                />
              )}
              {index === items.length - 1 ? (
                <span className={isDark ? 'text-gray-100' : 'text-gray-900'}>
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className={`hover:${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  } transition-colors`}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>

        {/* Additional Context */}
        {(post || category || author) && (
          <div className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {post && (
              <div className="flex items-center space-x-2">
                <span>Published:</span>
                <time dateTime={post.publishDate}>
                  {new Date(post.publishDate).toLocaleDateString()}
                </time>
                {post.modifiedDate && (
                  <>
                    <span>•</span>
                    <span>Updated:</span>
                    <time dateTime={post.modifiedDate}>
                      {new Date(post.modifiedDate).toLocaleDateString()}
                    </time>
                  </>
                )}
              </div>
            )}
            {category && (
              <div>
                {category.description}
              </div>
            )}
            {author && (
              <div>
                {author.bio}
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Breadcrumbs; 