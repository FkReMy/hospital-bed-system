// src/services/api/departmentApi.js
/**
 * departmentApi Service
 * 
 * Production-ready API client for department-related endpoints.
 * Centralizes operations for fetching departments, rooms, and department statistics.
 * 
 * Features:
 * - Uses axiosInstance with JWT from httpOnly cookie
 * - Consistent error handling with meaningful messages
 * - Endpoints for departments list, single department, rooms in department
 * - Unified with other api services (bedApi, patientApi, appointmentApi)
 * - Ready for React Query caching and invalidation
 */

import { axiosInstance } from './axiosInstance';

/**
 * Base path for department endpoints
 */
const BASE_PATH = '/api/departments';

/**
 * Get all departments (with optional bed/room counts)
 * @param {Object} params - optional query params (includeStats, etc.)
 * @returns {Promise<Array>} departments
 */
export const getAll = async (params = {}) => {
  try {
    const response = await axiosInstance.get(BASE_PATH, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch departments');
  }
};

/**
 * Get single department by ID
 * @param {string|number} id
 * @returns {Promise<Object>} department with rooms/beds
 */
export const getById = async (id) => {
  if (!id) throw new Error('Department ID is required');
  
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch department');
  }
};

/**
 * Get rooms in a department
 * @param {string|number} departmentId
 * @returns {Promise<Array>} rooms
 */
export const getRooms = async (departmentId) => {
  if (!departmentId) throw new Error('Department ID is required');
  
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/${departmentId}/rooms`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch rooms');
  }
};

/**
 * Get department statistics (bed count, occupancy, etc.)
 * @param {string|number} departmentId
 * @returns {Promise<Object>} stats
 */
export const getStats = async (departmentId) => {
  if (!departmentId) throw new Error('Department ID is required');
  
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/${departmentId}/stats`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch department statistics');
  }
};

// Export as named object and default
export const departmentApi = {
  getAll,
  getById,
  getRooms,
  getStats,
};

export default departmentApi;