// src/services/firebase/prescriptionFirebase.js
/**
 * Firebase Prescription Management Service
 * 
 * Firebase adapter for prescription-related operations.
 * Replaces the .NET backend prescription endpoints with Firestore.
 * 
 * Features:
 * - CRUD operations for prescriptions
 * - Compatible with existing prescriptionApi interface
 */

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc,
  query,
  where,
  orderBy as firestoreOrderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const PRESCRIPTIONS_COLLECTION = 'prescriptions';

/**
 * Get all prescriptions with optional filters
 * @param {Object} params - optional filters (patientId, doctorId, status)
 * @returns {Promise<Array>} prescriptions
 */
export const getAll = async (params = {}) => {
  try {
    let prescriptionsQuery = collection(db, PRESCRIPTIONS_COLLECTION);
    
    const constraints = [];
    
    if (params.patientId) {
      constraints.push(where('patientId', '==', params.patientId));
    }
    if (params.doctorId) {
      constraints.push(where('doctorId', '==', params.doctorId));
    }
    if (params.status) {
      constraints.push(where('status', '==', params.status));
    }
    
    constraints.push(firestoreOrderBy('prescribedAt', 'desc'));
    
    if (constraints.length > 0) {
      prescriptionsQuery = query(prescriptionsQuery, ...constraints);
    }

    const snapshot = await getDocs(prescriptionsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Get prescriptions error:', error);
    throw new Error(error.message || 'Failed to fetch prescriptions');
  }
};

/**
 * Get prescription by ID
 * @param {string} id
 * @returns {Promise<Object>} prescription
 */
export const getById = async (id) => {
  if (!id) throw new Error('Prescription ID is required');
  
  try {
    const prescriptionDoc = await getDoc(doc(db, PRESCRIPTIONS_COLLECTION, id));
    
    if (!prescriptionDoc.exists()) {
      throw new Error('Prescription not found');
    }

    return { id: prescriptionDoc.id, ...prescriptionDoc.data() };
  } catch (error) {
    console.error('Get prescription error:', error);
    throw new Error(error.message || 'Failed to fetch prescription');
  }
};

/**
 * Create new prescription
 * @param {Object} data - prescription payload
 * @returns {Promise<Object>} created prescription
 */
export const create = async (data) => {
  try {
    const prescriptionRef = doc(collection(db, PRESCRIPTIONS_COLLECTION));
    
    const newPrescription = {
      patientId: data.patientId || data.patient_id,
      doctorId: data.doctorId || data.doctor_id,
      appointmentId: data.appointmentId || data.appointment_id || null,
      prescribedAt: Timestamp.now(),
      medicationName: data.medicationName || data.medication_name,
      dosage: data.dosage,
      frequency: data.frequency,
      duration: data.duration || null,
      instructions: data.instructions || null,
      isDispensed: data.isDispensed || data.is_dispensed || false,
    };

    await setDoc(prescriptionRef, newPrescription);

    return { id: prescriptionRef.id, ...newPrescription };
  } catch (error) {
    console.error('Create prescription error:', error);
    throw new Error(error.message || 'Failed to create prescription');
  }
};

/**
 * Update existing prescription
 * @param {string} id
 * @param {Object} data - updated fields
 * @returns {Promise<Object>} updated prescription
 */
export const update = async (id, data) => {
  if (!id) throw new Error('Prescription ID is required');
  
  try {
    const prescriptionRef = doc(db, PRESCRIPTIONS_COLLECTION, id);
    const prescriptionDoc = await getDoc(prescriptionRef);
    
    if (!prescriptionDoc.exists()) {
      throw new Error('Prescription not found');
    }

    // Convert snake_case to camelCase for updates
    const updatedData = {
      ...(data.patientId && { patientId: data.patientId }),
      ...(data.patient_id && { patientId: data.patient_id }),
      ...(data.doctorId && { doctorId: data.doctorId }),
      ...(data.doctor_id && { doctorId: data.doctor_id }),
      ...(data.appointmentId && { appointmentId: data.appointmentId }),
      ...(data.appointment_id && { appointmentId: data.appointment_id }),
      ...(data.medicationName && { medicationName: data.medicationName }),
      ...(data.medication_name && { medicationName: data.medication_name }),
      ...(data.dosage !== undefined && { dosage: data.dosage }),
      ...(data.frequency !== undefined && { frequency: data.frequency }),
      ...(data.duration !== undefined && { duration: data.duration }),
      ...(data.instructions !== undefined && { instructions: data.instructions }),
      ...(data.isDispensed !== undefined && { isDispensed: data.isDispensed }),
      ...(data.is_dispensed !== undefined && { isDispensed: data.is_dispensed }),
    };

    await updateDoc(prescriptionRef, updatedData);

    return { id, ...prescriptionDoc.data(), ...updatedData };
  } catch (error) {
    console.error('Update prescription error:', error);
    throw new Error(error.message || 'Failed to update prescription');
  }
};

/**
 * Delete prescription (mark as cancelled, not dispensed)
 * Note: In the new schema, we don't have a separate delete status
 * Setting isDispensed to false effectively cancels the prescription
 * @param {string} id
 * @returns {Promise<void>}
 */
export const remove = async (id) => {
  if (!id) throw new Error('Prescription ID is required');
  
  try {
    const prescriptionRef = doc(db, PRESCRIPTIONS_COLLECTION, id);
    const prescriptionDoc = await getDoc(prescriptionRef);
    
    if (!prescriptionDoc.exists()) {
      throw new Error('Prescription not found');
    }

    // Mark as not dispensed (effectively cancels the prescription)
    await updateDoc(prescriptionRef, {
      isDispensed: false,
    });
  } catch (error) {
    console.error('Delete prescription error:', error);
    throw new Error(error.message || 'Failed to delete prescription');
  }
};

// Export as named object and default
export const prescriptionFirebase = {
  getAll,
  getById,
  create,
  update,
  remove,
};

export default prescriptionFirebase;
