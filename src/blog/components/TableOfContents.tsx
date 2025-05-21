import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { TocItem } from '../types/blog';

interface TableOfContentsProps {
  items: TocItem[];
  activeId?: string;
  maxDepth?: number;
  className?: string;
  onLinkClick?: (id: string) => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  items,
  activeId,
  maxDepth = 3,
  className = '',
  onLinkClick
}) => {
  const { theme } = useTheme();
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const tocRef = useRef<HTMLDivElement>(null);
  
  // Filter items based on maxDepth
  const filteredItems = items.filter(item => item.level <= maxDepth);
  
  // Setup intersection observer to track visible sections on scroll
  useEffect(() => {
    if (!activeId || items.length === 0) return;
    
    // If an activeId is provided, scroll the TOC to show the active item
    const activeElement = tocRef.current?.querySelector(`[data-id="${activeId}"]`) as HTMLElement;
    if (activeElement && tocRef.current) {
      const tocRect = tocRef.current.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();
      
      // Check if the active item is outside the visible area
      if (activeRect.top < tocRect.top || activeRect.bottom > tocRect.bottom) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
      
      // Expand parent sections if active item is nested
      if (activeElement.dataset.level && parseInt(activeElement.dataset.level) > 1) {
        const currentLevel = parseInt(activeElement.dataset.level);
        for (let i = 1; i < currentLevel; i++) {
          const parentSections = document.querySelectorAll(`[data-level="${i}"]`);
          parentSections.forEach(section => {
            const sectionId = section.getAttribute('data-id');
            if (sectionId) {
              setVisibleSections(prev => [...prev, sectionId]);
            }
          });
        }
      }
    }
  }, [activeId, items]);
  
  // Handle click to scroll to section
  const handleClick = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    
    // Find the heading element in the document
    const headingElement = document.getElementById(id);
    if (headingElement) {
      // Scroll to the heading
      headingElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Set focus on the heading for accessibility
      headingElement.setAttribute('tabindex', '-1');
      headingElement.focus({ preventScroll: true });
      
      // Optional callback
      if (onLinkClick) {
        onLinkClick(id);
      }
    }
  };
  
  // Toggle section visibility
  const toggleSection = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    setVisibleSections(prev => 
      prev.includes(id) 
        ? prev.filter(sectionId => sectionId !== id) 
        : [...prev, id]
    );
  };
  
  // Toggle entire TOC on mobile
  const toggleToc = () => {
    setIsExpanded(prev => !prev);
  };
  
  // Check if an item has children
  const hasChildren = (item: TocItem) => {
    return items.some(child => 
      child.level > item.level && 
      child.id.startsWith(item.id) || 
      child.id.includes(`${item.id}-`)
    );
  };

  // Render TOC items recursively
  const renderItems = (filteredItems: TocItem[], parentLevel = 1) => {
    // Get items at the current level
    const currentLevelItems = filteredItems.filter(item => item.level === parentLevel);
    
    if (currentLevelItems.length === 0) return null;
    
    return (
      <ul className={`space-y-1 ${parentLevel > 1 ? 'pl-3 mt-1 border-l border-gray-200 dark:border-gray-700' : ''}`}>
        {currentLevelItems.map(item => {
          const hasNestedChildren = hasChildren(item);
          const isVisible = visibleSections.includes(item.id);
    const isActive = activeId === item.id;

    return (
            <li key={item.id} className="relative">
              <div className="flex items-center space-x-1">
                {hasNestedChildren && (
            <button
                    type="button"
                    onClick={(e) => toggleSection(item.id, e)}
                    className={`w-4 h-4 inline-flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
                    aria-label={isVisible ? "Collapse section" : "Expand section"}
                  >
                    <svg 
                      className={`w-3 h-3 transform ${isVisible ? 'rotate-90' : ''} transition-transform`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
            </button>
          )}
                
                {!hasNestedChildren && <div className="w-4"></div>}
                
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(item.id, e)}
                  className={`block py-1 px-1 flex-1 text-sm rounded transition-colors relative ${
              isActive
                      ? `font-medium ${theme === 'dark' ? 'text-blue-400 bg-blue-900/20' : 'text-blue-700 bg-blue-100'}` 
                      : `${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`
                  }`}
                  data-id={item.id}
                  data-level={item.level}
            aria-current={isActive ? 'location' : undefined}
          >
            {item.text}
                </a>
        </div>
              
              {/* Nested items */}
              {hasNestedChildren && isVisible && renderItems(
                filteredItems.filter(child => 
                  child.level === parentLevel + 1 && 
                  (child.id.startsWith(item.id) || child.id.includes(`${item.id}-`))
                ),
                parentLevel + 1
              )}
            </li>
          );
        })}
      </ul>
    );
  };
  
  // Mobile toggle button
  const MobileToggle = () => {
    return (
      <button
        type="button"
        onClick={toggleToc}
        className={`md:hidden flex items-center justify-between w-full p-2 text-sm rounded-lg ${
          theme === 'dark' 
            ? 'bg-gray-800 text-white hover:bg-gray-700' 
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        <span className="font-medium">Table of Contents</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
    );
  };
  
  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <nav
      className={`toc ${className}`}
      aria-label="Table of contents"
    >
      <MobileToggle />
      
      <div 
        ref={tocRef}
        className={`overflow-y-auto max-h-[calc(100vh-250px)] transition-all duration-300 ${
          isExpanded ? 'max-h-[calc(100vh-250px)]' : 'max-h-0 md:max-h-[calc(100vh-250px)]'
        }`}
      >
        {renderItems(filteredItems)}
      </div>
    </nav>
  );
};

export default TableOfContents; 