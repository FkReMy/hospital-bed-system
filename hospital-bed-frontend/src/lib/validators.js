// src/lib/validators.js
/**
 * validators.js
 * 
 * Central library for all form/input validation in the HBMS frontend.
 * Provides reusable validation functions with consistent error messages.
 * 
 * Features:
 * - Required field
 * - Email format
 * - Phone number (Egyptian/international)
 * - Minimum/maximum length
 * - Number range
 * - Date validation (past/future)
 * - Custom regex patterns
 * - Unified error messages
 * 
 * Use with react-hook-form, manual forms, or inline validation
 * All validators return { isValid: boolean, message: string }
 */

import { isValidPhone as utilsIsValidPhone } from '@lib/utils';

/**
 * Required field validator
 * @param {string} value
 * @returns {{ isValid: boolean, message: string }}
 */
export const required = (value) => {
  const isValid = value !== null && value !== undefined && value.toString().trim() !== '';
  return {
    isValid,
    message: isValid ? '' : 'This field is required',
  };
};

/**
 * Email format validator
 * @param {string} value
 * @returns {{ isValid: boolean, message: string }}
 */
export const email = (value) => {
  if (!value) return required(value);
  
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = regex.test(value.trim());
  
  return {
    isValid,
    message: isValid ? '' : 'Please enter a valid email address',
  };
};

/**
 * Phone number validator (basic international + Egyptian focus)
 * @param {string} value
 * @returns {{ isValid: boolean, message: string }}
 */
export const phone = (value) => {
  if (!value) return required(value);
  
  const isValid = utilsIsValidPhone(value);
  
  return {
    isValid,
    message: isValid ? '' : 'Please enter a valid phone number',
  };
};

/**
 * Minimum length validator
 * @param {number} min
 * @returns {(value: string) => { isValid: boolean, message: string }}
 */
export const minLength = (min) => (value) => {
  if (!value) return required(value);
  
  const isValid = value.toString().trim().length >= min;
  
  return {
    isValid,
    message: isValid ? '' : `Must be at least ${min} characters`,
  };
};

/**
 * Maximum length validator
 * @param {number} max
 * @returns {(value: string) => { isValid: boolean, message: string }}
 */
export const maxLength = (max) => (value) => {
  if (!value) return { isValid: true, message: '' };
  
  const isValid = value.toString().trim().length <= max;
  
  return {
    isValid,
    message: isValid ? '' : `Must be no more than ${max} characters`,
  };
};

/**
 * Number range validator
 * @param {number} min
 * @param {number} max
 * @returns {(value: string|number) => { isValid: boolean, message: string }}
 */
export const numberRange = (min, max) => (value) => {
  if (!value) return required(value);
  
  const num = Number(value);
  const isValid = !isNaN(num) && num >= min && num <= max;
  
  return {
    isValid,
    message: isValid ? '' : `Must be between ${min} and ${max}`,
  };
};

/**
 * Positive number validator
 * @param {string|number} value
 * @returns {{ isValid: boolean, message: string }}
 */
export const positiveNumber = (value) => {
  if (!value) return required(value);
  
  const num = Number(value);
  const isValid = !isNaN(num) && num > 0;
  
  return {
    isValid,
    message: isValid ? '' : 'Must be a positive number',
  };
};

/**
 * Future date validator
 * @param {string|Date} value
 * @returns {{ isValid: boolean, message: string }}
 */
export const futureDate = (value) => {
  if (!value) return required(value);
  
  const date = new Date(value);
  const isValid = isValid(date) && date > new Date();
  
  return {
    isValid,
    message: isValid ? '' : 'Date must be in the future',
  };
};

/**
 * Past date validator
 * @param {string|Date} value
 * @returns {{ isValid: boolean, message: string }}
 */
export const pastDate = (value) => {
  if (!value) return required(value);
  
  const date = new Date(value);
  const isValid = isValid(date) && date < new Date();
  
  return {
    isValid,
    message: isValid ? '' : 'Date must be in the past',
  };
};

/**
 * Custom regex validator
 * @param {RegExp} regex
 * @param {string} message
 * @returns {(value: string) => { isValid: boolean, message: string }}
 */
export const pattern = (regex, message) => (value) => {
  if (!value) return required(value);
  
  const isValid = regex.test(value.trim());
  
  return {
    isValid,
    message: isValid ? '' : message,
  };
};

/**
 * Combine multiple validators
 * @param {...Function} validators
 * @returns {(value: any) => { isValid: boolean, message: string }}
 */
export const combine = (...validators) => (value) => {
  for (const validator of validators) {
    const result = validator(value);
    if (!result.isValid) return result;
  }
  return { isValid: true, message: '' };
};