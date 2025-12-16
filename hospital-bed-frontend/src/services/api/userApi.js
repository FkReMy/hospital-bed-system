// src/services/api/userApi.js
/**
 * userApi Service
 * 
 * Production-ready API client for user/staff management endpoints (admin only).
 * Now uses Firebase Firestore instead of .NET backend.
 * 
 * Features:
 * - Firebase Firestore for user data
 * - Consistent interface with previous implementation
 * - Compatible with existing user management components
 */

import userFirebase from '../firebase/userFirebase';

/**
 * Get all staff users
 * @param {Object} params - optional filters (role, search, page, limit)
 * @returns {Promise<Array|Object>} users or paginated response
 */
export const getAll = userFirebase.getAll;

/**
 * Get user by ID
 * @param {string|number} id
 * @returns {Promise<Object>} user with roles
 */
export const getById = userFirebase.getById;

/**
 * Create new staff user
 * @param {Object} data - user payload (email, full_name, role, password, etc.)
 * @returns {Promise<Object>} created user
 */
export const create = userFirebase.create;

/**
 * Update existing staff user
 * @param {string|number} id
 * @param {Object} data - updated fields
 * @returns {Promise<Object>} updated user
 */
export const update = userFirebase.update;

/**
 * Delete/disable staff user
 * @param {string|number} id
 * @returns {Promise<void>}
 */
export const remove = userFirebase.remove;

/**
 * Update user roles (admin only)
 * @param {string|number} id
 * @param {Array<string>} roles - array of role names
 * @returns {Promise<Object>}
 */
export const updateRoles = userFirebase.updateRoles;

/**
 * Reset user password (admin only)
 * @param {string|number} id
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPassword = userFirebase.resetPassword;

// Export as named object and default
export const userApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  updateRoles,
  resetPassword,
};

export default userApi;