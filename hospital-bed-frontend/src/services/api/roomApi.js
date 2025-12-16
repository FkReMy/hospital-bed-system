// src/services/api/roomApi.js
/**
 * roomApi Service
 * 
 * Production-ready API client for room-related endpoints.
 * Centralizes operations for fetching rooms, room details, and beds in rooms.
 * 
 * Features:
 * - Uses axiosInstance with JWT from httpOnly cookie
 * - Consistent error handling with meaningful messages
 * - Endpoints for rooms list, single room, beds in room
 * - Unified with other api services (bedApi, departmentApi)
 * - Ready for React Query caching and invalidation
 */

import { axiosInstance } from './axiosInstance';

/**
 * Base path for room endpoints
 */
const BASE_PATH = '/api/rooms';

/**
 * Get all rooms (with optional filters)
 * @param {Object} params - query params (departmentId, includeBeds, etc.)
 * @returns {Promise<Array>} rooms
 */
export const getAll = async (params = {}) => {
  try {
    const response = await axiosInstance.get(BASE_PATH, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch rooms');
  }
};

/**
 * Get single room by ID
 * @param {string|number} id
 * @returns {Promise<Object>} room with beds
 */
export const getById = async (id) => {
  if (!id) throw new Error('Room ID is required');
  
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch room');
  }
};

/**
 * Get beds in a specific room
 * @param {string|number} roomId
 * @returns {Promise<Array>} beds in room
 */
export const getBeds = async (roomId) => {
  if (!roomId) throw new Error('Room ID is required');
  
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/${roomId}/beds`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch beds in room');
  }
};

/**
 * Get rooms in a department
 * @param {string|number} departmentId
 * @returns {Promise<Array>} rooms in department
 */
export const getByDepartment = async (departmentId) => {
  if (!departmentId) throw new Error('Department ID is required');
  
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/department/${departmentId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch rooms in department');
  }
};

// Export as named object and default
export const roomApi = {
  getAll,
  getById,
  getBeds,
  getByDepartment,
};

export default roomApi;