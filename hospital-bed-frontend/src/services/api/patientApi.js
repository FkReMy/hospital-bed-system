// src/services/api/patientApi.js
/**
 * patientApi Service
 * 
 * Production-ready API client for all patient-related endpoints.
 * Now uses Firebase Firestore instead of .NET backend.
 * 
 * Features:
 * - Firebase Firestore for patient data
 * - Consistent interface with previous implementation
 * - Compatible with existing patient management hooks
 */

import patientFirebase from '../firebase/patientFirebase';

/**
 * Get all patients (with optional filters and pagination)
 * @param {Object} params - query params (search, departmentId, status, page, limit)
 * @returns {Promise<Array|Object>} patients or paginated response
 */
export const getAll = patientFirebase.getAll;

/**
 * Search patients by name, ID, phone, etc.
 * @param {string} query - search term
 * @param {Object} params - additional filters
 * @returns {Promise<Array>} matching patients
 */
export const search = patientFirebase.search;

/**
 * Get patient by ID with full nested relations
 * @param {string|number} id
 * @returns {Promise<Object>} patient with current_bed, appointments, prescriptions
 */
export const getById = patientFirebase.getById;

/**
 * Create new patient
 * @param {Object} data - patient payload
 * @returns {Promise<Object>} created patient
 */
export const create = patientFirebase.create;

/**
 * Update existing patient
 * @param {string|number} id
 * @param {Object} data - updated fields
 * @returns {Promise<Object>} updated patient
 */
export const update = patientFirebase.update;

/**
 * Delete patient (soft delete or permanent - per backend)
 * @param {string|number} id
 * @returns {Promise<void>}
 */
export const remove = patientFirebase.remove;

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