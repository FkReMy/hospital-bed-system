// src/hooks/useMediaQuery.js
/**
 * useMediaQuery Hook
 * 
 * Production-ready custom hook for responsive media queries.
 * Allows components to react to breakpoint changes (mobile, tablet, desktop).
 * 
 * Features:
 * - Uses window.matchMedia for accurate, real-time detection
 * - Server-side rendering safe (no window error)
 * - Cleanup on unmount
 * - Matches your SCSS breakpoint variables
 * - Unified across the application for consistent responsive logic
 * 
 * Breakpoints (must match _variables.scss):
 * - sm: 640px
 * - md: 768px
 * - lg: 1024px
 * - xl: 1280px
 * - 2xl: 1536px
 * 
 * Usage: const isMobile = useMediaQuery('(max-width: 767px)')
 */

import { useState, useEffect } from 'react';

export const useMediaQuery = (query) => {
  // Initial state - false on server, correct value on client
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Safety check for SSR
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handler);

    // Cleanup
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

/**
 * Pre-defined breakpoint hooks for convenience
 */
export const useBreakpoint = () => {
  const isSm = useMediaQuery('(max-width: 639px)');
  const isMd = useMediaQuery('(min-width: 640px) and (max-width: 767px)');
  const isLg = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isXl = useMediaQuery('(min-width: 1024px) and (max-width: 1279px)');
  const is2Xl = useMediaQuery('(min-width: 1280px)');

  return {
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    isMobile: isSm || isMd,
    isTablet: isMd || isLg,
    isDesktop: isXl || is2Xl,
  };
};