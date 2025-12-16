// src/services/api/bedAssignmentApi.js
/**
 * bedAssignmentApi Service
 * 
 * Production-ready API client for bed assignment-specific endpoints.
 * Centralizes operations related to patient-bed assignments (assign, discharge, history).
 * 
 * Features:
 * - Uses axiosInstance with JWT from httpOnly cookie
 * - Consistent error handling with meaningful messages
 * - Endpoints for assign, discharge, and assignment history
 * - Unified with other api services (bedApi, patientApi)
 * - Ready for React Query mutations and optimistic updates
 * 
 * Note: General bed CRUD/status is in bedApi.js
 */

import { axiosInstance } from './axiosInstance';

/**
 * Base path for bed assignment endpoints
 */
const BASE_PATH = '/api/bed-assignments';

/**
 * Assign patient to bed
 * @param {Object} payload - { bed_id, patient_id, assigned_by?, notes? }
 * @returns {Promise<Object>} assignment record
 */
export const assignPatient = async (payload) => {
  if (!payload.bed_id || !payload.patient_id) {
    throw new Error('Bed ID and Patient ID are required');
  }
  
  try {
    const response = await axiosInstance.post(BASE_PATH, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to assign patient to bed');
  }
};

/**
 * Discharge patient from bed
 * @param {string|number} assignmentId - bed assignment record ID
 * @param {Object} payload - optional { discharged_by?, notes? }
 * @returns {Promise<Object>} discharge record
 */
export const dischargePatient = async (assignmentId, payload = {}) => {
  if (!assignmentId) throw new Error('Assignment ID is required');
  
  try {
    const response = await axiosInstance.post(`${BASE_PATH}/${assignmentId}/discharge`, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to discharge patient');
  }
};

/**
 * Get assignment history for a patient
 * @param {string|number} patientId
 * @returns {Promise<Array>} assignment history
 */
export const getHistoryByPatient = async (patientId) => {
  if (!patientId) throw new Error('Patient ID is required');
  
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/patient/${patientId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch assignment history');
  }
};

/**
 * Get assignment history for a bed
 * @param {string|number} bedId
 * @returns {Promise<Array>} assignment history
 */
export const getHistoryByBed = async (bedId) => {
  if (!bedId) throw new Error('Bed ID is required');
  
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/bed/${bedId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch bed assignment history');
  }
};

/**
 * Get current active assignment for a bed
 * @param {string|number} bedId
 * @returns {Promise<Object|null>}
 */
export const getCurrentByBed = async (bedId) => {
  if (!bedId) throw new Error('Bed ID is required');
  
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/bed/${bedId}/current`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null; // No active assignment
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch current assignment');
  }
};

// Export as named object and default
export const bedAssignmentApi = {
  assignPatient,
  dischargePatient,
  getHistoryByPatient,
  getHistoryByBed,
  getCurrentByBed,
};

export default bedAssignmentApi;