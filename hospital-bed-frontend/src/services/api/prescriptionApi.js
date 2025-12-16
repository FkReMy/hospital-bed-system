// src/services/api/prescriptionApi.js
/**
 * prescriptionApi Service
 * 
 * Production-ready API client for all prescription-related endpoints.
 * Centralizes HTTP requests with proper error handling, auth, and base URL.
 * 
 * Features:
 * - Uses axiosInstance with JWT from httpOnly cookie
 * - Consistent error handling with meaningful messages
 * - Endpoints for list, detail, create, update, dispense
 * - Unified with other api services (bedApi, patientApi, appointmentApi)
 * - Ready for React Query caching and invalidation
 */

import { axiosInstance } from './axiosInstance';

/**
 * Base path for prescription endpoints
 */
const BASE_PATH = '/api/prescriptions';

/**
 * Get all prescriptions (with optional filters)
 * @param {Object} params - query params (patientId, doctorId, status, date range)
 * @returns {Promise<Array>} prescriptions
 */
export const getAll = async (params = {}) => {
  try {
    const response = await axiosInstance.get(BASE_PATH, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch prescriptions');
  }
};

/**
 * Get prescriptions for a specific patient
 * @param {string|number} patientId
 * @returns {Promise<Array>} patient prescriptions
 */
export const getByPatient = async (patientId) => {
  if (!patientId) throw new Error('Patient ID is required');
  
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/patient/${patientId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch patient prescriptions');
  }
};

/**
 * Get prescription by ID
 * @param {string|number} id
 * @returns {Promise<Object>} prescription
 */
export const getById = async (id) => {
  if (!id) throw new Error('Prescription ID is required');
  
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch prescription');
  }
};

/**
 * Create new prescription
 * @param {Object} data - prescription payload
 * @returns {Promise<Object>} created prescription
 */
export const create = async (data) => {
  try {
    const response = await axiosInstance.post(BASE_PATH, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create prescription');
  }
};

/**
 * Update existing prescription
 * @param {string|number} id
 * @param {Object} data - updated fields
 * @returns {Promise<Object>} updated prescription
 */
export const update = async (id, data) => {
  if (!id) throw new Error('Prescription ID is required');
  
  try {
    const response = await axiosInstance.put(`${BASE_PATH}/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update prescription');
  }
};

/**
 * Mark prescription as dispensed
 * @param {string|number} id
 * @param {Object} payload - optional { dispensed_by?, notes? }
 * @returns {Promise<Object>}
 */
export const dispense = async (id, payload = {}) => {
  if (!id) throw new Error('Prescription ID is required');
  
  try {
    const response = await axiosInstance.post(`${BASE_PATH}/${id}/dispense`, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to mark prescription as dispensed');
  }
};

// Export as named object and default
export const prescriptionApi = {
  getAll,
  getByPatient,
  getById,
  create,
  update,
  dispense,
};

export default prescriptionApi;