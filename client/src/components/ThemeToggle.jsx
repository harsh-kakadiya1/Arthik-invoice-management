import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const { theme, toggleTheme, isTransitioning } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative flex items-center justify-center w-12 h-12 rounded-full
        bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600
        text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        focus:ring-offset-white dark:focus:ring-offset-gray-800
        ${isTransitioning ? 'scale-95' : 'scale-100'}
        group
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Sun Icon */}
      <FiSun 
        className={`
          absolute w-5 h-5 transition-all duration-300 ease-in-out
          ${theme === 'light' 
            ? 'opacity-100 rotate-0 scale-100' 
            : 'opacity-0 rotate-90 scale-75'
          }
        `}
      />
      
      {/* Moon Icon */}
      <FiMoon 
        className={`
          absolute w-5 h-5 transition-all duration-300 ease-in-out
          ${theme === 'dark' 
            ? 'opacity-100 rotate-0 scale-100' 
            : 'opacity-0 -rotate-90 scale-75'
          }
        `}
      />
      
      {/* Ripple effect */}
      <div 
        className={`
          absolute inset-0 rounded-full
          bg-blue-500 dark:bg-blue-400
          opacity-0 group-active:opacity-20
          transition-opacity duration-150 ease-out
          scale-0 group-active:scale-100
        `}
      />
    </button>
  );
};

export default ThemeToggle;
