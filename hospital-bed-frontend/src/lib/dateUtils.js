// src/lib/dateUtils.js
/**
 * dateUtils.js
 * 
 * Central utility library for all date/time operations in the HBMS frontend.
 * Ensures consistent formatting, parsing, and calculations across the application.
 * 
 * Features:
 * - Standardized formatting functions
 * - Relative time helpers
 * - Date validation
 * - Timezone-safe operations (using date-fns)
 * - Unified with constants.DATE_FORMATS
 * 
 * All components should import from here instead of using date-fns directly
 */

import { 
  format as fnsFormat,
  formatDistanceToNow as fnsDistanceToNow,
  parseISO,
  isValid,
  isAfter,
  isBefore,
  startOfDay,
  endOfDay,
  addDays,
  subDays,
} from 'date-fns';
import { DATE_FORMATS } from '@lib/constants';

/**
 * Format date to display string
 * @param {Date|string|number} date - Date to format
 * @param {string} formatStr - Format key from DATE_FORMATS or custom
 * @returns {string} Formatted date or 'N/A'
 */
export const formatDate = (date, formatStr = DATE_FORMATS.DISPLAY) => {
  if (!date) return 'N/A';
  
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return 'Invalid Date';
  
  return fnsFormat(parsed, formatStr);
};

/**
 * Format date and time
 * @param {Date|string|number} date
 * @returns {string}
 */
export const formatDateTime = (date) => formatDate(date, DATE_FORMATS.DATE_TIME);

/**
 * Format time only
 * @param {Date|string|number} date
 * @returns {string}
 */
export const formatTime = (date) => formatDate(date, DATE_FORMATS.TIME);

/**
 * Relative time from now (e.g., "3 days ago")
 * @param {Date|string|number} date
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(parsed)) return 'Invalid Date';
  
  return fnsDistanceToNow(parsed, { addSuffix: true });
};

/**
 * Check if date is in the future
 * @param {Date|string|number} date
 * @returns {boolean}
 */
export const isFutureDate = (date) => {
  if (!date) return false;
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsed) && isAfter(parsed, new Date());
};

/**
 * Check if date is in the past
 * @param {Date|string|number} date
 * @returns {boolean}
 */
export const isPastDate = (date) => {
  if (!date) return false;
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsed) && isBefore(parsed, new Date());
};

/**
 * Get start of day (00:00:00)
 * @param {Date} date
 * @returns {Date}
 */
export const getStartOfDay = (date = new Date()) => startOfDay(date);

/**
 * Get end of day (23:59:59)
 * @param {Date} date
 * @returns {Date}
 */
export const getEndOfDay = (date = new Date()) => endOfDay(date);

/**
 * Add days to date
 * @param {Date} date
 * @param {number} days
 * @returns {Date}
 */
export const addDaysToDate = (date, days) => addDays(date, days);

/**
 * Subtract days from date
 * @param {Date} date
 * @param {number} days
 * @returns {Date}
 */
export const subtractDaysFromDate = (date, days) => subDays(date, days);

/**
 * Parse ISO string safely
 * @param {string} dateString
 * @returns {Date|null}
 */
export const safeParseISO = (dateString) => {
  if (!dateString) return null;
  const parsed = parseISO(dateString);
  return isValid(parsed) ? parsed : null;
};