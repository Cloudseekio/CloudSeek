import React from 'react';
import './SkipNavigation.css';

interface SkipNavigationProps {
  /**
   * The main content ID to skip to
   */
  mainContentId?: string;
  
  /**
   * The text for the skip link
   */
  label?: string;
  
  /**
   * Additional links to include
   */
  links?: Array<{
    id: string;
    label: string;
  }>;
  
  /**
   * CSS class name
   */
  className?: string;
}

/**
 * SkipNavigation component provides links that allow keyboard users
 * to bypass navigation menus and jump directly to main content or
 * other important sections of the page.
 *
 * The links are visually hidden but become visible when focused.
 */
export const SkipNavigation: React.FC<SkipNavigationProps> = ({
  mainContentId = 'main-content',
  label = 'Skip to main content',
  links = [],
  className = '',
}) => {
  return (
    <div className={`skip-navigation ${className}`}>
      <a 
        href={`#${mainContentId}`}
        className="skip-link"
        data-testid="skip-to-main"
      >
        {label}
      </a>
      
      {links.map(link => (
        <a
          key={link.id}
          href={`#${link.id}`}
          className="skip-link"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

/**
 * MainContent component assigns the correct ID to the main content area
 */
export const MainContent: React.FC<{
  children: React.ReactNode;
  id?: string;
  className?: string;
}> = ({
  children,
  id = 'main-content',
  className = '',
}) => {
  return (
    <main 
      id={id} 
      className={className}
      tabIndex={-1} // Makes the element programmatically focusable
    >
      {children}
    </main>
  );
};

export default SkipNavigation; 