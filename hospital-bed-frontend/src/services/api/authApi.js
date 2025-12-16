// src/services/api/authApi.js
/**
 * authApi Service
 * 
 * Production-ready API client for authentication endpoints.
 * Now uses Firebase Authentication instead of .NET backend.
 * 
 * Features:
 * - Firebase Authentication (Email/Password)
 * - Firestore for user profiles
 * - Consistent interface with previous implementation
 * - Compatible with existing useAuth hook
 */

import authFirebase from '../firebase/authFirebase';

/**
 * Login - authenticates with Firebase
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} user data
 */
export const login = authFirebase.login;

/**
 * Logout - signs out from Firebase
 * @returns {Promise<void>}
 */
export const logout = authFirebase.logout;

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>} user with roles
 */
export const me = authFirebase.me;

/**
 * Refresh token - Firebase handles this automatically
 * @returns {Promise<void>}
 */
export const refresh = authFirebase.refresh;

/**
 * Register new user (exposed for completeness)
 * @param {Object} userData - user registration data
 * @returns {Promise<Object>} created user
 */
export const register = authFirebase.register;

// Export as named object and default
export const authApi = {
  login,
  logout,
  me,
  refresh,
  register,
};

export default authApi;