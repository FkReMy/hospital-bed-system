// src/services/api/bedApi.js
/**
 * bedApi Service
 * 
 * Production-ready API client for all bed-related endpoints.
 * Centralizes HTTP requests with proper error handling, auth, and base URL.
 * 
 * Features:
 * - Uses axiosInstance with JWT from httpOnly cookie
 * - Consistent error handling with meaningful messages
 * - Endpoints for beds, departments, rooms, assignment/discharge
 * - Unified with other api services (authApi, patientApi, appointmentApi)
 * - Ready for React Query integration (useBedManagement hook)
 */

import { axiosInstance } from './axiosInstance';

/**
 * Base path for bed endpoints
 */
const BASE_PATH = '/api/beds';

/**
 * Get all beds with nested relations (room, department, current_patient)
 * @param {Object} params - optional filters (departmentId, status, etc.)
 * @returns {Promise<Array>} beds
 */
export const getAll = async (params = {}) => {
  try {
    const response = await axiosInstance.get(BASE_PATH, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch beds');
  }
};

/**
 * Get departments (for grouping/filters)
 * @returns {Promise<Array>} departments
 */
export const getDepartments = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/departments`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch departments');
  }
};

/**
 * Assign bed to patient
 * @param {Object} payload - { bed_id, patient_id, assigned_by }
 * @returns {Promise<Object>} assignment record
 */
export const assign = async (payload) => {
  if (!payload.bed_id || !payload.patient_id) {
    throw new Error('Bed ID and Patient ID are required');
  }
  
  try {
    const response = await axiosInstance.post(`${BASE_PATH}/assign`, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to assign bed');
  }
};

/**
 * Discharge patient from bed
 * @param {string|number} bedId
 * @returns {Promise<Object>} discharge record
 */
export const discharge = async (bedId) => {
  if (!bedId) throw new Error('Bed ID is required');
  
  try {
    const response = await axiosInstance.post(`${BASE_PATH}/${bedId}/discharge`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to discharge patient');
  }
};

/**
 * Update bed status (maintenance, cleaning, etc.)
 * @param {string|number} bedId
 * @param {string} status - 'available', 'maintenance', 'cleaning'
 * @returns {Promise<Object>}
 */
export const updateStatus = async (bedId, status) => {
  if (!bedId || !status) throw new Error('Bed ID and status are required');
  
  try {
    const response = await axiosInstance.patch(`${BASE_PATH}/${bedId}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update bed status');
  }
};

// Export as named object and default
export const bedApi = {
  getAll,
  getDepartments,
  assign,
  discharge,
  updateStatus,
};

export default bedApi;