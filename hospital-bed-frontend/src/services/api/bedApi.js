// src/services/api/bedApi.js
/**
 * bedApi Service
 * 
 * Production-ready API client for all bed-related endpoints.
 * Now uses Firebase Firestore instead of .NET backend.
 * 
 * Features:
 * - Firebase Firestore for bed data
 * - Consistent interface with previous implementation
 * - Compatible with existing useBedManagement hook
 */

import bedFirebase from '../firebase/bedFirebase';

/**
 * Get all beds with nested relations (room, department, current_patient)
 * @param {Object} params - optional filters (departmentId, status, etc.)
 * @returns {Promise<Array>} beds
 */
export const getAll = bedFirebase.getAll;

/**
 * Get departments (for grouping/filters)
 * @returns {Promise<Array>} departments
 */
export const getDepartments = bedFirebase.getDepartments;

/**
 * Assign bed to patient
 * @param {Object} payload - { bed_id, patient_id, assigned_by }
 * @returns {Promise<Object>} assignment record
 */
export const assign = bedFirebase.assign;

/**
 * Discharge patient from bed
 * @param {string|number} bedId
 * @returns {Promise<Object>} discharge record
 */
export const discharge = bedFirebase.discharge;

/**
 * Update bed status (maintenance, cleaning, etc.)
 * @param {string|number} bedId
 * @param {string} status - 'available', 'maintenance', 'cleaning'
 * @returns {Promise<Object>}
 */
export const updateStatus = bedFirebase.updateStatus;

export const subscribeToBeds = bedFirebase.subscribeToBeds;

// Export as named object and default
export const bedApi = {
  getAll,
  getDepartments,
  assign,
  discharge,
  updateStatus,
  subscribeToBeds, 
};

export default bedApi;