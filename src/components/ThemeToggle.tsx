import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: number;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', size = 20 }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
        theme === 'dark'
          ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
      } ${className}`}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun size={size} />
      ) : (
        <Moon size={size} />
      )}
    </button>
  );
};

export default ThemeToggle; 