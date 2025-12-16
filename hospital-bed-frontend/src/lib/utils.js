// src/lib/utils.js
/**
 * utils.js
 * 
 * Collection of general-purpose utility functions for the HBMS frontend.
 * Central place for reusable helpers that don't fit in specific domains.
 * 
 * Features:
 * - Object utilities (deep clone, isEmpty)
 * - Array utilities (unique, sortBy)
 * - String utilities (truncate, slugify, capitalize)
 * - Validation helpers
 * - DOM helpers (copy to clipboard)
 * - Error handling helpers
 * - Unified and production-ready
 */

import toast from 'react-hot-toast';

/**
 * Deep clone object/array
 * @param {any} obj
 * @returns {any}
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, deepClone(value)])
    );
  }
  return obj;
};

/**
 * Check if object is empty
 * @param {object} obj
 * @returns {boolean}
 */
export const isEmptyObject = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

/**
 * Get unique items from array (by value or key)
 * @param {array} arr
 * @param {string} key - optional key for objects
 * @returns {array}
 */
export const uniqueArray = (arr, key = null) => {
  if (!Array.isArray(arr)) return [];
  
  if (key) {
    const seen = new Set();
    return arr.filter(item => {
      const val = item[key];
      if (seen.has(val)) return false;
      seen.add(val);
      return true;
    });
  }
  
  return [...new Set(arr)];
};

/**
 * Sort array of objects by key
 * @param {array} arr
 * @param {string} key
 * @param {boolean} ascending
 * @returns {array}
 */
export const sortByKey = (arr, key, ascending = true) => {
  if (!Array.isArray(arr)) return [];
  
  return [...arr].sort((a, b) => {
    const aVal = a[key] || '';
    const bVal = b[key] || '';
    const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    return ascending ? comparison : -comparison;
  });
};

/**
 * Truncate string with ellipsis
 * @param {string} str
 * @param {number} length
 * @returns {string}
 */
export const truncateString = (str, length = 50) => {
  if (!str || str.length <= length) return str || '';
  return str.substring(0, length) + '...';
};

/**
 * Capitalize first letter
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert string to slug
 * @param {string} str
 * @returns {string}
 */
export const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Copy text to clipboard
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export const copyToClipboard = async (text) => {
  if (!text) return false;
  
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
    return true;
  } catch (err) {
    toast.error('Failed to copy');
    console.error('Copy failed:', err);
    return false;
  }
};

/**
 * Simple email validation
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Simple phone validation (basic international)
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

/**
 * Delay execution (for testing/loading simulation)
 * @param {number} ms
 * @returns {Promise}
 */
export const delay = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generate random ID
 * @param {number} length
 * @returns {string}
 */
export const generateId = (length = 8) => {
  return Math.random().toString(36).substring(2, 2 + length);
};

/**
 * Safe JSON parse
 * @param {string} str
 * @param {any} fallback
 * @returns {any}
 */
export const safeJsonParse = (str, fallback = {}) => {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

// Export all for convenience
export default {
  deepClone,
  isEmptyObject,
  uniqueArray,
  sortByKey,
  truncateString,
  capitalize,
  slugify,
  copyToClipboard,
  isValidEmail,
  isValidPhone,
  delay,
  generateId,
  safeJsonParse,
};