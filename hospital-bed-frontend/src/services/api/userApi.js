// src/services/api/userApi.js
/**
 * userApi Service
 * 
 * Production-ready API client for user/staff management endpoints (admin only).
 * Centralizes operations for fetching, creating, updating, and managing staff users.
 * 
 * Features:
 * - Uses axiosInstance with JWT from httpOnly cookie
 * - Consistent error handling with meaningful messages
 * - Endpoints for list, detail, create, update, delete, role management
 * - Unified with other api services (authApi, patientApi, bedApi)
 * - Ready for React Query caching and invalidation
 * 
 * NOTE: These endpoints are admin-only - protected by AdminRoute
 */

import { axiosInstance } from './axiosInstance';

/**
 * Base path for user management endpoints
 */
const BASE_PATH = '/api/users';

/**
 * Get all staff users
 * @param {Object} params - optional filters (role, search, page, limit)
 * @returns {Promise<Array|Object>} users or paginated response
 */
export const getAll = async (params = {}) => {
  try {
    const response = await axiosInstance.get(BASE_PATH, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

/**
 * Get user by ID
 * @param {string|number} id
 * @returns {Promise<Object>} user with roles
 */
export const getById = async (id) => {
  if (!id) throw new Error('User ID is required');
  
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user');
  }
};

/**
 * Create new staff user
 * @param {Object} data - user payload (email, full_name, role, password, etc.)
 * @returns {Promise<Object>} created user
 */
export const create = async (data) => {
  try {
    const response = await axiosInstance.post(BASE_PATH, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create user');
  }
};

/**
 * Update existing staff user
 * @param {string|number} id
 * @param {Object} data - updated fields
 * @returns {Promise<Object>} updated user
 */
export const update = async (id, data) => {
  if (!id) throw new Error('User ID is required');
  
  try {
    const response = await axiosInstance.put(`${BASE_PATH}/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
};

/**
 * Delete/disable staff user
 * @param {string|number} id
 * @returns {Promise<void>}
 */
export const remove = async (id) => {
  if (!id) throw new Error('User ID is required');
  
  try {
    await axiosInstance.delete(`${BASE_PATH}/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
};

/**
 * Update user roles (admin only)
 * @param {string|number} id
 * @param {Array<string>} roles - array of role names
 * @returns {Promise<Object>}
 */
export const updateRoles = async (id, roles) => {
  if (!id) throw new Error('User ID is required');
  if (!Array.isArray(roles)) throw new Error('Roles must be an array');
  
  try {
    const response = await axiosInstance.patch(`${BASE_PATH}/${id}/roles`, { roles });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update user roles');
  }
};

/**
 * Reset user password (admin only)
 * @param {string|number} id
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPassword = async (id, newPassword) => {
  if (!id) throw new Error('User ID is required');
  if (!newPassword) throw new Error('New password is required');
  
  try {
    await axiosInstance.post(`${BASE_PATH}/${id}/reset-password`, { newPassword });
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
};

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