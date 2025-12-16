// src/services/api/appointmentApi.js
/**
 * appointmentApi Service
 * 
 * Production-ready API client for all appointment-related endpoints.
 * Centralizes HTTP requests with proper error handling, auth, and base URL.
 * 
 * Features:
 * - Uses axiosInstance with JWT from httpOnly cookie
 * - Consistent error handling with meaningful messages
 * - Type-safe ready endpoints
 * - Unified with other api services (bedApi, patientApi, etc.)
 * - Ready for React Query integration
 */

import { axiosInstance } from './axiosInstance';

/**
 * Base path for appointment endpoints
 */
const BASE_PATH = '/api/appointments';

/**
 * Get all appointments (with optional filters)
 * @param {Object} params - query params (patientId, doctorId, date, status)
 * @returns {Promise<Array>} appointments
 */
export const getAll = async (params = {}) => {
  try {
    const response = await axiosInstance.get(BASE_PATH, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch appointments');
  }
};

/**
 * Get appointment by ID
 * @param {string|number} id
 * @returns {Promise<Object>} appointment
 */
export const getById = async (id) => {
  if (!id) throw new Error('Appointment ID is required');
  
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch appointment');
  }
};

/**
 * Create new appointment
 * @param {Object} data - appointment payload
 * @returns {Promise<Object>} created appointment
 */
export const create = async (data) => {
  try {
    const response = await axiosInstance.post(BASE_PATH, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to schedule appointment');
  }
};

/**
 * Update existing appointment
 * @param {string|number} id
 * @param {Object} data - updated fields
 * @returns {Promise<Object>} updated appointment
 */
export const update = async (id, data) => {
  if (!id) throw new Error('Appointment ID is required');
  
  try {
    const response = await axiosInstance.put(`${BASE_PATH}/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update appointment');
  }
};

/**
 * Delete/cancel appointment
 * @param {string|number} id
 * @returns {Promise<void>}
 */
export const cancel = async (id) => {
  if (!id) throw new Error('Appointment ID is required');
  
  try {
    await axiosInstance.delete(`${BASE_PATH}/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to cancel appointment');
  }
};

/**
 * Update appointment status (complete, no-show, etc.)
 * @param {string|number} id
 * @param {string} status - 'completed', 'no_show', etc.
 * @returns {Promise<Object>}
 */
export const updateStatus = async (id, status) => {
  if (!id || !status) throw new Error('Appointment ID and status are required');
  
  try {
    const response = await axiosInstance.patch(`${BASE_PATH}/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update appointment status');
  }
};

// Export as default object
export const appointmentApi = {
  getAll,
  getById,
  create,
  update,
  cancel,
  updateStatus,
};

export default appointmentApi;