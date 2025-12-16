// src/services/firebase/bedAssignmentFirebase.js
/**
 * Firebase Bed Assignment Management Service
 * 
 * Firebase adapter for bed assignment-related operations.
 * Replaces the .NET backend bed assignment endpoints with Firestore.
 * 
 * Features:
 * - CRUD operations for bed assignments
 * - Assignment history tracking
 * - Compatible with existing bedAssignmentApi interface
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

const BED_ASSIGNMENTS_COLLECTION = 'bedAssignments';

/**
 * Get all bed assignments with optional filters
 * @param {Object} params - optional filters (bedId, patientId, status)
 * @returns {Promise<Array>} bed assignments
 */
export const getAll = async (params = {}) => {
  try {
    let assignmentsQuery = collection(db, BED_ASSIGNMENTS_COLLECTION);
    
    const constraints = [];
    
    if (params.bedId) {
      constraints.push(where('bedId', '==', params.bedId));
    }
    if (params.patientId) {
      constraints.push(where('patientId', '==', params.patientId));
    }
    if (params.status) {
      constraints.push(where('status', '==', params.status));
    }
    
    constraints.push(firestoreOrderBy('assignedAt', 'desc'));
    
    if (constraints.length > 0) {
      assignmentsQuery = query(assignmentsQuery, ...constraints);
    }

    const snapshot = await getDocs(assignmentsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Get bed assignments error:', error);
    throw new Error(error.message || 'Failed to fetch bed assignments');
  }
};

/**
 * Get bed assignment by ID
 * @param {string} id
 * @returns {Promise<Object>} bed assignment
 */
export const getById = async (id) => {
  if (!id) throw new Error('Bed assignment ID is required');
  
  try {
    const assignmentDoc = await getDoc(doc(db, BED_ASSIGNMENTS_COLLECTION, id));
    
    if (!assignmentDoc.exists()) {
      throw new Error('Bed assignment not found');
    }

    return { id: assignmentDoc.id, ...assignmentDoc.data() };
  } catch (error) {
    console.error('Get bed assignment error:', error);
    throw new Error(error.message || 'Failed to fetch bed assignment');
  }
};

/**
 * Get assignment history for a bed
 * @param {string} bedId
 * @returns {Promise<Array>} assignment history
 */
export const getHistoryByBedId = async (bedId) => {
  if (!bedId) throw new Error('Bed ID is required');
  
  try {
    const historyQuery = query(
      collection(db, BED_ASSIGNMENTS_COLLECTION),
      where('bedId', '==', bedId),
      firestoreOrderBy('assignedAt', 'desc')
    );

    const snapshot = await getDocs(historyQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Get bed assignment history error:', error);
    throw new Error(error.message || 'Failed to fetch bed assignment history');
  }
};

/**
 * Get assignment history for a patient
 * @param {string} patientId
 * @returns {Promise<Array>} assignment history
 */
export const getHistoryByPatientId = async (patientId) => {
  if (!patientId) throw new Error('Patient ID is required');
  
  try {
    const historyQuery = query(
      collection(db, BED_ASSIGNMENTS_COLLECTION),
      where('patientId', '==', patientId),
      firestoreOrderBy('assignedAt', 'desc')
    );

    const snapshot = await getDocs(historyQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Get patient assignment history error:', error);
    throw new Error(error.message || 'Failed to fetch patient assignment history');
  }
};

/**
 * Create new bed assignment
 * @param {Object} data - assignment payload
 * @returns {Promise<Object>} created assignment
 */
export const create = async (data) => {
  try {
    const assignmentRef = doc(collection(db, BED_ASSIGNMENTS_COLLECTION));
    
    const newAssignment = {
      patientId: data.patientId || data.patient_id,
      bedId: data.bedId || data.bed_id,
      assignedBy: data.assignedBy || data.assigned_by || 'system',
      notes: data.notes || null,
      assignedAt: Timestamp.now(),
      dischargedAt: null,
    };

    await setDoc(assignmentRef, newAssignment);

    return { id: assignmentRef.id, ...newAssignment };
  } catch (error) {
    console.error('Create bed assignment error:', error);
    throw new Error(error.message || 'Failed to create bed assignment');
  }
};

/**
 * Update bed assignment
 * @param {string} id
 * @param {Object} data - updated fields
 * @returns {Promise<Object>} updated assignment
 */
export const update = async (id, data) => {
  if (!id) throw new Error('Bed assignment ID is required');
  
  try {
    const assignmentRef = doc(db, BED_ASSIGNMENTS_COLLECTION, id);
    const assignmentDoc = await getDoc(assignmentRef);
    
    if (!assignmentDoc.exists()) {
      throw new Error('Bed assignment not found');
    }

    // Convert snake_case to camelCase for updates
    const updatedData = {
      ...(data.patientId && { patientId: data.patientId }),
      ...(data.patient_id && { patientId: data.patient_id }),
      ...(data.bedId && { bedId: data.bedId }),
      ...(data.bed_id && { bedId: data.bed_id }),
      ...(data.assignedBy && { assignedBy: data.assignedBy }),
      ...(data.assigned_by && { assignedBy: data.assigned_by }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.dischargedAt !== undefined && { dischargedAt: data.dischargedAt }),
      ...(data.discharged_at !== undefined && { dischargedAt: data.discharged_at }),
    };

    await updateDoc(assignmentRef, updatedData);

    return { id, ...assignmentDoc.data(), ...updatedData };
  } catch (error) {
    console.error('Update bed assignment error:', error);
    throw new Error(error.message || 'Failed to update bed assignment');
  }
};

// Export as named object and default
export const bedAssignmentFirebase = {
  getAll,
  getById,
  getHistoryByBedId,
  getHistoryByPatientId,
  create,
  update,
};

export default bedAssignmentFirebase;
