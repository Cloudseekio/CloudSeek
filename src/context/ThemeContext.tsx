import * as React from 'react';
const { createContext, useContext, useState, useEffect } = React;

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// Create a default theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to safely get initial theme
const getInitialTheme = (): Theme => {
  // Check if we're in the browser environment
  if (typeof window === 'undefined') {
    return 'light'; // Default to light in SSR/non-browser environments
  }
  
  try {
    // Check if theme was previously saved to localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    
    // Otherwise check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (error) {
    console.error('Error accessing localStorage or matchMedia:', error);
    // Fall back to light theme if there are any errors
  }
  
  return 'light';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the helper function for initialization
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Listen for changes in system preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
      };
      
      // Some browsers don't support addEventListener on mediaQuery
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.addListener) {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    } catch (error) {
      console.error('Error setting up media query listener:', error);
    }
  }, []);

  // Apply theme to body element
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    try {
      document.documentElement.setAttribute('data-theme', theme);
      
      // Safely use localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', theme);
      }
      
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Provide a fallback if context is undefined
    console.warn('useTheme was used outside of ThemeProvider - using fallback values');
    return {
      theme: 'light',
      setTheme: () => {},
      toggleTheme: () => {}
    };
  }
  return context;
}; 