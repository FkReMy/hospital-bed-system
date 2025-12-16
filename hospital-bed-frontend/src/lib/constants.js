// src/lib/constants.js
/**
 * constants.js
 * 
 * Central repository for all application-wide constants in the HBMS frontend.
 * Keeps magic strings, numbers, enums, and configuration in one place for
 * maintainability and consistency.
 * 
 * Features:
 * - Role definitions matching backend
 * - Status enums for beds and appointments
 * - Pagination defaults
 * - Date/time formats
 * - API timeout and retry config
 * - File upload limits
 * - UI constants (debounce delays, animation durations)
 * 
 * Import and use throughout the app instead of hard-coded values
 */

export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  RECEPTION: 'reception',
};

// Array for role-based checks
export const ALL_ROLES = Object.values(ROLES);

// Bed status enum - must match backend
export const BED_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  CLEANING: 'cleaning',
  MAINTENANCE: 'maintenance',
};

// Appointment status enum - must match backend
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  LIMIT_OPTIONS: [10, 20, 50, 100],
};

// Date/time formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  FULL: 'PPP',
  TIME: 'p',
  DATE_TIME: 'PPP p',
  ISO: "yyyy-MM-dd'T'HH:mm",
};

// File upload limits
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  MAX_FILES: 5,
  ACCEPTED_TYPES: 'image/*,.pdf,.doc,.docx',
};

// Debounce delays (ms)
export const DEBOUNCE = {
  SEARCH: 500,
  FILTER: 300,
  INPUT: 200,
};

// Animation durations (ms) - match CSS if needed
export const ANIMATION = {
  FAST: 200,
  DEFAULT: 300,
  SLOW: 500,
};

// API configuration
export const API = {
  TIMEOUT_MS: 30000,
  RETRY_ATTEMPTS: 2,
};

// Notification polling
export const NOTIFICATIONS = {
  POLL_INTERVAL_MS: 30000,
  MAX_DISPLAY: 50,
};

// Routes (for navigation guards or links)
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  BEDS: '/beds',
  PATIENTS: '/patients',
  APPOINTMENTS: '/appointments',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  ACCESS_DENIED: '/access-denied',
};

// Export all for convenience
export default {
  ROLES,
  ALL_ROLES,
  BED_STATUS,
  APPOINTMENT_STATUS,
  PAGINATION,
  DATE_FORMATS,
  FILE_UPLOAD,
  DEBOUNCE,
  ANIMATION,
  API,
  NOTIFICATIONS,
  ROUTES,
};