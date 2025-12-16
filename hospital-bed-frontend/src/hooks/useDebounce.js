// src/hooks/useDebounce.js
/**
 * useDebounce Hook
 * 
 * Production-ready custom hook for debouncing values (typically search inputs).
 * Prevents excessive API calls or re-renders during rapid user input.
 * 
 * Features:
 * - Configurable delay (default 500ms)
 * - Immediate option for first change
 * - Cleanup on unmount
 * - TypeScript-ready (generic type)
 * - Unified across the application (search bars, filters, live previews)
 * 
 * Used in:
 * - Patient search
 * - Bed filters
 * - Appointment filters
 * - Any rapid-input field
 */

import { useState, useEffect } from 'react';

/**
 * @template T
 * @param {T} value - The value to debounce
 * @param {number} delay - Debounce delay in milliseconds (default: 500)
 * @param {boolean} immediate - Trigger on first change immediately (default: false)
 * @returns {T} Debounced value
 */
export const useDebounce = (value, delay = 500, immediate = false) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Immediate trigger on first change
    if (immediate && debouncedValue === undefined) {
      setDebouncedValue(value);
      return;
    }

    // Set up timer
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timer on value change or unmount
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, immediate, debouncedValue]);

  return debouncedValue;
};