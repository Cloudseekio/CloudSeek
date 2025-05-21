import React from 'react';

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  return (
    <div data-testid="table-of-contents">
      <h3>Table of Contents</h3>
      <ul>
        {items.map(item => (
          <li key={item.id} style={{ marginLeft: `${(item.level - 1) * 16}px` }}>
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents; 