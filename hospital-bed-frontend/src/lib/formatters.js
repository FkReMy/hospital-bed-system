// src/lib/formatters.js
/**
 * formatters.js
 * 
 * Central utility library for all data formatting in the HBMS frontend.
 * Ensures consistent display of numbers, currency, phone numbers, IDs, etc.
 * 
 * Features:
 * - Phone number formatting
 * - Patient/Hospital ID formatting
 * - File size formatting
 * - Percentage and number formatting
 * - Currency formatting (if needed)
 * - Name capitalization
 * - Unified with constants and dateUtils
 * 
 * All components should import from here for consistent display
 */

import { formatFileSize as dateUtilsFileSize } from '@lib/dateUtils'; // Reuse if needed

/**
 * Format phone number (Egyptian format example: +20 100 123 4567 → +20 100 123 4567)
 * Strips non-digits and adds spaces
 * @param {string} phone
 * @returns {string}
 */
export const formatPhone = (phone) => {
  if (!phone) return 'N/A';
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Egyptian mobile format
  if (digits.startsWith('20')) {
    // +201001234567 → +20 100 123 4567
    if (digits.length === 12) {
      return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
    }
  }
  
  // International fallback
  if (digits.length >= 10) {
    return `+${digits.slice(0, digits.length - 10)} ${digits.slice(-10, -7)} ${digits.slice(-7, -4)} ${digits.slice(-4)}`;
  }
  
  return phone; // Return original if no pattern match
};

/**
 * Format patient or hospital ID (e.g., PT-2025-0001)
 * @param {string|number} id
 * @param {string} prefix - e.g., 'PT', 'BED', 'APPT'
 * @returns {string}
 */
export const formatId = (id, prefix = 'ID') => {
  if (!id) return 'N/A';
  return `${prefix}-${id.toString().padStart(6, '0')}`;
};

/**
 * Format file size (bytes → KB/MB)
 * @param {number} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 KB';
  
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

/**
 * Format percentage (0.85 → 85%)
 * @param {number} value
 * @param {number} decimals
 * @returns {string}
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return 'N/A';
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format number with thousands separator
 * @param {number} num
 * @returns {string}
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Capitalize name (first letter of each word)
 * @param {string} name
 * @returns {string}
 */
export const formatName = (name) => {
  if (!name) return 'N/A';
  return name
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format blood group (e.g., "o_positive" → "O+")
 * @param {string} bloodGroup
 * @returns {string}
 */
export const formatBloodGroup = (bloodGroup) => {
  if (!bloodGroup) return 'N/A';
  
  const map = {
    a_positive: 'A+',
    a_negative: 'A-',
    b_positive: 'B+',
    b_negative: 'B-',
    ab_positive: 'AB+',
    ab_negative: 'AB-',
    o_positive: 'O+',
    o_negative: 'O-',
  };
  
  return map[bloodGroup.toLowerCase()] || bloodGroup.toUpperCase();
};

/**
 * Format gender
 * @param {string} gender
 * @returns {string}
 */
export const formatGender = (gender) => {
  if (!gender) return 'N/A';
  return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
};