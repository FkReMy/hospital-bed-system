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
  deleteDoc,
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
      constraints.push(where('patient_id', '==', params.patientId));
    }
    if (params.doctorId) {
      constraints.push(where('doctor_id', '==', params.doctorId));
    }
    if (params.status) {
      constraints.push(where('status', '==', params.status));
    }
    
    constraints.push(firestoreOrderBy('created_at', 'desc'));
    
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
      ...data,
      status: data.status || 'active',
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
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

    const updatedData = {
      ...data,
      updated_at: Timestamp.now(),
    };

    await updateDoc(prescriptionRef, updatedData);

    return { id, ...prescriptionDoc.data(), ...updatedData };
  } catch (error) {
    console.error('Update prescription error:', error);
    throw new Error(error.message || 'Failed to update prescription');
  }
};

/**
 * Delete prescription
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

    // Soft delete - update status
    await updateDoc(prescriptionRef, {
      status: 'deleted',
      deleted_at: Timestamp.now(),
      updated_at: Timestamp.now(),
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
