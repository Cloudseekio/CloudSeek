import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export interface TextFormat {
  type: 'bold' | 'italic' | 'underline' | 'link' | 'code' | 'quote' | 
        'heading-1' | 'heading-2' | 'heading-3' | 'list' | 'ordered-list' |
        'align-left' | 'align-center' | 'align-right';
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
}

interface RichTextToolbarProps {
  onFormat: (format: TextFormat['type']) => void;
  onImageUpload: () => void;
  activeFormats: TextFormat['type'][];
  className?: string;
}

const RichTextToolbar: React.FC<RichTextToolbarProps> = ({
  onFormat,
  onImageUpload,
  activeFormats,
  className = ''
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const formats: TextFormat[] = [
    { type: 'heading-1', icon: <Heading1 size={18} />, label: 'Heading 1', shortcut: '# ' },
    { type: 'heading-2', icon: <Heading2 size={18} />, label: 'Heading 2', shortcut: '## ' },
    { type: 'heading-3', icon: <Heading3 size={18} />, label: 'Heading 3', shortcut: '### ' },
    { type: 'bold', icon: <Bold size={18} />, label: 'Bold', shortcut: 'Ctrl+B' },
    { type: 'italic', icon: <Italic size={18} />, label: 'Italic', shortcut: 'Ctrl+I' },
    { type: 'underline', icon: <Underline size={18} />, label: 'Underline', shortcut: 'Ctrl+U' },
    { type: 'list', icon: <List size={18} />, label: 'Bullet List', shortcut: '* ' },
    { type: 'ordered-list', icon: <ListOrdered size={18} />, label: 'Numbered List', shortcut: '1. ' },
    { type: 'quote', icon: <Quote size={18} />, label: 'Quote', shortcut: '> ' },
    { type: 'code', icon: <Code size={18} />, label: 'Code', shortcut: '```' },
    { type: 'link', icon: <Link size={18} />, label: 'Link', shortcut: 'Ctrl+K' },
    { type: 'align-left', icon: <AlignLeft size={18} />, label: 'Align Left' },
    { type: 'align-center', icon: <AlignCenter size={18} />, label: 'Align Center' },
    { type: 'align-right', icon: <AlignRight size={18} />, label: 'Align Right' }
  ];

  return (
    <div className={`flex flex-wrap items-center gap-1 p-2 border rounded-lg ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } ${className}`}>
      {formats.map((format) => (
        <button
          key={format.type}
          onClick={() => onFormat(format.type)}
          className={`p-2 rounded hover:bg-opacity-10 transition-colors ${
            activeFormats.includes(format.type)
              ? isDark
                ? 'bg-blue-500 text-white'
                : 'bg-blue-100 text-blue-600'
              : isDark
              ? 'text-gray-300 hover:bg-gray-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          title={format.shortcut ? `${format.label} (${format.shortcut})` : format.label}
          aria-label={format.label}
          aria-pressed={activeFormats.includes(format.type)}
        >
          {format.icon}
        </button>
      ))}
      <div className="h-6 w-px mx-1 bg-gray-300 dark:bg-gray-600" />
      <button
        onClick={onImageUpload}
        className={`p-2 rounded hover:bg-opacity-10 transition-colors ${
          isDark
            ? 'text-gray-300 hover:bg-gray-700'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        title="Insert Image"
        aria-label="Insert Image"
      >
        <ImageIcon size={18} />
      </button>
    </div>
  );
};

export default RichTextToolbar; 