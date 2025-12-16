// src/services/api/bedAssignmentApi.js
/**
 * bedAssignmentApi Service
 * 
 * Production-ready API client for bed assignment-specific endpoints.
 * Now uses Firebase Firestore instead of .NET backend.
 * 
 * Features:
 * - Firebase Firestore for bed assignment data
 * - Consistent interface with previous implementation
 * - Compatible with existing bed management components
 */

import bedAssignmentFirebase from '../firebase/bedAssignmentFirebase';

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
    return await bedAssignmentFirebase.create(payload);
  } catch (error) {
    throw new Error(error.message || 'Failed to assign patient to bed');
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
    return await bedAssignmentFirebase.update(assignmentId, {
      status: 'discharged',
      discharged_by: payload.discharged_by || 'system',
      discharged_at: new Date().toISOString(),
      notes: payload.notes || '',
    });
  } catch (error) {
    throw new Error(error.message || 'Failed to discharge patient');
  }
};

/**
 * Get assignment history for a patient
 * @param {string|number} patientId
 * @returns {Promise<Array>} assignment history
 */
export const getHistoryByPatient = bedAssignmentFirebase.getHistoryByPatientId;

/**
 * Get assignment history for a bed
 * @param {string|number} bedId
 * @returns {Promise<Array>} assignment history
 */
export const getHistoryByBed = bedAssignmentFirebase.getHistoryByBedId;

/**
 * Get current active assignment for a bed
 * @param {string|number} bedId
 * @returns {Promise<Object|null>}
 */
export const getCurrentByBed = async (bedId) => {
  if (!bedId) throw new Error('Bed ID is required');
  
  try {
    const history = await bedAssignmentFirebase.getHistoryByBedId(bedId);
    const activeAssignment = history.find(assignment => assignment.status === 'active');
    return activeAssignment || null;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch current assignment');
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