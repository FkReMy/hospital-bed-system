// src/services/api/authApi.js
/**
 * authApi Service
 * 
 * Production-ready API client for authentication endpoints.
 * Centralizes login, logout, me (current user), and token refresh operations.
 * 
 * Features:
 * - Uses axiosInstance with httpOnly cookie authentication
 * - Consistent error handling
 * - Unified with other api services
 * - No token storage on client (secure)
 * - Ready for React Query (useAuth hook)
 */

import { axiosInstance } from './axiosInstance';

/**
 * Base path for auth endpoints
 */
const BASE_PATH = '/api/auth';

/**
 * Login - sends credentials, backend sets httpOnly JWT cookie
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} user data
 */
export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post(`${BASE_PATH}/login`, credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
  }
};

/**
 * Logout - clears httpOnly cookie on backend
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await axiosInstance.post(`${BASE_PATH}/logout`);
  } catch (error) {
    // Continue logout even if API fails (cookie might already be cleared)
    console.warn('Logout API error:', error);
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};

/**
 * Get current authenticated user
 * @returns {Promise<Object>} user with roles
 */
export const me = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/me`);
    return response.data;
  } catch (error) {
    // 401 means not authenticated - expected on fresh load
    if (error.response?.status === 401) {
      return null;
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch user data');
  }
};

/**
 * Refresh token - called automatically by axios interceptors if needed
 * @returns {Promise<void>}
 */
export const refresh = async () => {
  try {
    await axiosInstance.post(`${BASE_PATH}/refresh`);
  } catch (error) {
    throw new Error('Session expired. Please log in again.');
  }
};

// Export as named object and default
export const authApi = {
  login,
  logout,
  me,
  refresh,
};

export default authApi;