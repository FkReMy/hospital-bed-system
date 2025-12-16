// src/services/api/patientApi.js
/**
 * patientApi Service
 * 
 * Production-ready API client for all patient-related endpoints.
 * Centralizes HTTP requests with proper error handling, auth, and base URL.
 * 
 * Features:
 * - Uses axiosInstance with JWT from httpOnly cookie
 * - Consistent error handling with meaningful messages
 * - Endpoints for patients list, detail, search, create/update
 * - Nested data support (current_bed, appointments, prescriptions)
 * - Unified with other api services (bedApi, appointmentApi)
 * - Ready for React Query caching and invalidation
 */

import { axiosInstance } from './axiosInstance';

/**
 * Base path for patient endpoints
 */
const BASE_PATH = '/api/patients';

/**
 * Get all patients (with optional filters and pagination)
 * @param {Object} params - query params (search, departmentId, status, page, limit)
 * @returns {Promise<Array|Object>} patients or paginated response
 */
export const getAll = async (params = {}) => {
  try {
    const response = await axiosInstance.get(BASE_PATH, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch patients');
  }
};

/**
 * Search patients by name, ID, phone, etc.
 * @param {string} query - search term
 * @param {Object} params - additional filters
 * @returns {Promise<Array>} matching patients
 */
export const search = async (query, params = {}) => {
  if (!query?.trim()) throw new Error('Search query is required');
  
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/search`, { 
      params: { q: query.trim(), ...params } 
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Patient search failed');
  }
};

/**
 * Get patient by ID with full nested relations
 * @param {string|number} id
 * @returns {Promise<Object>} patient with current_bed, appointments, prescriptions
 */
export const getById = async (id) => {
  if (!id) throw new Error('Patient ID is required');
  
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch patient');
  }
};

/**
 * Create new patient
 * @param {Object} data - patient payload
 * @returns {Promise<Object>} created patient
 */
export const create = async (data) => {
  try {
    const response = await axiosInstance.post(BASE_PATH, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create patient');
  }
};

/**
 * Update existing patient
 * @param {string|number} id
 * @param {Object} data - updated fields
 * @returns {Promise<Object>} updated patient
 */
export const update = async (id, data) => {
  if (!id) throw new Error('Patient ID is required');
  
  try {
    const response = await axiosInstance.put(`${BASE_PATH}/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update patient');
  }
};

/**
 * Delete patient (soft delete or permanent - per backend)
 * @param {string|number} id
 * @returns {Promise<void>}
 */
export const remove = async (id) => {
  if (!id) throw new Error('Patient ID is required');
  
  try {
    await axiosInstance.delete(`${BASE_PATH}/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete patient');
  }
};

// Export as named object and default
export const patientApi = {
  getAll,
  search,
  getById,
  create,
  update,
  remove,
};

export default patientApi;