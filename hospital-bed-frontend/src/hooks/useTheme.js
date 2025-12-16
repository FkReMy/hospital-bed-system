// src/hooks/useTheme.js
/**
 * useTheme Hook
 * 
 * Production-ready theme management hook for the HBMS application.
 * Handles light/dark/system theme preference with persistence and real-time updates.
 * 
 * Features:
 * - Supports 'light', 'dark', and 'system' modes
 * - Persists user preference in localStorage
 * - Respects OS system preference when 'system' is selected
 * - Applies theme class to document root
 * - Cleanup on unmount
 * - Unified across the entire application via ThemeProvider
 * - Matches your glassmorphic dashboard aesthetic
 * 
 * Usage: Wrap app with <ThemeProvider> in main.jsx
 */

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Load saved theme or default to 'light'
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Remove previous theme classes
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      // Use system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(systemPrefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }

    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen to system preference changes when in 'system' mode
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  const value = {
    theme,
    setTheme,
    isDark: document.documentElement.classList.contains('dark'),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for consuming theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};