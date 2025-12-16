// src/services/api/prescriptionApi.js
/**
 * prescriptionApi Service
 * 
 * Production-ready API client for all prescription-related endpoints.
 * Now uses Firebase Firestore instead of .NET backend.
 * 
 * Features:
 * - Firebase Firestore for prescription data
 * - Consistent interface with previous implementation
 * - Compatible with existing prescription management components
 */

import prescriptionFirebase from '../firebase/prescriptionFirebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

/**
 * Get all prescriptions (with optional filters)
 * @param {Object} params - query params (patientId, doctorId, status, date range)
 * @returns {Promise<Array>} prescriptions
 */
export const getAll = prescriptionFirebase.getAll;

/**
 * Get prescriptions for a specific patient
 * @param {string|number} patientId
 * @returns {Promise<Array>} patient prescriptions
 */
export const getByPatient = async (patientId) => {
  if (!patientId) throw new Error('Patient ID is required');
  
  try {
    const prescriptionsQuery = query(
      collection(db, 'prescriptions'),
      where('patient_id', '==', patientId)
    );
    const snapshot = await getDocs(prescriptionsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch patient prescriptions');
  }
};

/**
 * Get prescription by ID
 * @param {string|number} id
 * @returns {Promise<Object>} prescription
 */
export const getById = prescriptionFirebase.getById;

/**
 * Create new prescription
 * @param {Object} data - prescription payload
 * @returns {Promise<Object>} created prescription
 */
export const create = prescriptionFirebase.create;

/**
 * Update existing prescription
 * @param {string|number} id
 * @param {Object} data - updated fields
 * @returns {Promise<Object>} updated prescription
 */
export const update = prescriptionFirebase.update;

/**
 * Mark prescription as dispensed
 * @param {string|number} id
 * @param {Object} payload - optional { dispensed_by?, notes? }
 * @returns {Promise<Object>}
 */
export const dispense = async (id, payload = {}) => {
  if (!id) throw new Error('Prescription ID is required');
  
  try {
    return await prescriptionFirebase.update(id, {
      status: 'dispensed',
      dispensed_by: payload.dispensed_by || 'system',
      dispensed_at: new Date().toISOString(),
      notes: payload.notes || '',
    });
  } catch (error) {
    throw new Error(error.message || 'Failed to mark prescription as dispensed');
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