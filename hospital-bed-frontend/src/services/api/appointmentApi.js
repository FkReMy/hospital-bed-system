// src/services/api/appointmentApi.js
/**
 * appointmentApi Service
 * 
 * Production-ready API client for all appointment-related endpoints.
 * Now uses Firebase Firestore instead of .NET backend.
 * 
 * Features:
 * - Firebase Firestore for appointment data
 * - Consistent interface with previous implementation
 * - Compatible with existing appointment management hooks
 */

import appointmentFirebase from '../firebase/appointmentFirebase';

/**
 * Get all appointments (with optional filters)
 * @param {Object} params - query params (patientId, doctorId, date, status)
 * @returns {Promise<Array>} appointments
 */
export const getAll = appointmentFirebase.getAll;

/**
 * Get appointment by ID
 * @param {string|number} id
 * @returns {Promise<Object>} appointment
 */
export const getById = appointmentFirebase.getById;

/**
 * Create new appointment
 * @param {Object} data - appointment payload
 * @returns {Promise<Object>} created appointment
 */
export const create = appointmentFirebase.create;

/**
 * Update existing appointment
 * @param {string|number} id
 * @param {Object} data - updated fields
 * @returns {Promise<Object>} updated appointment
 */
export const update = appointmentFirebase.update;

/**
 * Delete/cancel appointment
 * @param {string|number} id
 * @returns {Promise<void>}
 */
export const cancel = appointmentFirebase.cancel;

/**
 * Update appointment status (complete, no-show, etc.)
 * @param {string|number} id
 * @param {string} status - 'completed', 'no_show', etc.
 * @returns {Promise<Object>}
 */
export const updateStatus = appointmentFirebase.updateStatus;

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