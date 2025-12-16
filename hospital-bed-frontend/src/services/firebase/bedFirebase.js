// src/services/firebase/bedFirebase.js
/**
 * Firebase Bed Management Service
 * 
 * Firebase adapter for bed-related operations.
 * Replaces the .NET backend bed endpoints with Firestore.
 * 
 * Features:
 * - CRUD operations for beds
 * - Bed assignment and discharge
 * - Real-time bed status updates
 * - Compatible with existing bedApi interface
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
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const BEDS_COLLECTION = 'beds';
const DEPARTMENTS_COLLECTION = 'departments';
const BED_ASSIGNMENTS_COLLECTION = 'bed_assignments';

/**
 * Get all beds with optional filters
 * @param {Object} params - optional filters (departmentId, status, etc.)
 * @returns {Promise<Array>} beds
 */
export const getAll = async (params = {}) => {
  try {
    let bedsQuery = collection(db, BEDS_COLLECTION);
    
    // Apply filters if provided
    const constraints = [];
    if (params.departmentId) {
      constraints.push(where('department_id', '==', params.departmentId));
    }
    if (params.status) {
      constraints.push(where('status', '==', params.status));
    }
    if (params.roomId) {
      constraints.push(where('room_id', '==', params.roomId));
    }
    
    if (constraints.length > 0) {
      bedsQuery = query(bedsQuery, ...constraints);
    }

    const snapshot = await getDocs(bedsQuery);
    const beds = [];

    for (const docSnap of snapshot.docs) {
      const bed = { id: docSnap.id, ...docSnap.data() };
      
      // Fetch related data if needed
      if (bed.current_patient_id) {
        const patientDoc = await getDoc(doc(db, 'patients', bed.current_patient_id));
        if (patientDoc.exists()) {
          bed.current_patient = { id: patientDoc.id, ...patientDoc.data() };
        }
      }
      
      beds.push(bed);
    }

    return beds;
  } catch (error) {
    console.error('Get beds error:', error);
    throw new Error(error.message || 'Failed to fetch beds');
  }
};

/**
 * Get departments (for grouping/filters)
 * @returns {Promise<Array>} departments
 */
export const getDepartments = async () => {
  try {
    const snapshot = await getDocs(collection(db, DEPARTMENTS_COLLECTION));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Get departments error:', error);
    throw new Error(error.message || 'Failed to fetch departments');
  }
};

/**
 * Get bed by ID
 * @param {string} bedId
 * @returns {Promise<Object>} bed
 */
export const getById = async (bedId) => {
  if (!bedId) throw new Error('Bed ID is required');
  
  try {
    const bedDoc = await getDoc(doc(db, BEDS_COLLECTION, bedId));
    
    if (!bedDoc.exists()) {
      throw new Error('Bed not found');
    }

    const bed = { id: bedDoc.id, ...bedDoc.data() };
    
    // Fetch current patient if assigned
    if (bed.current_patient_id) {
      const patientDoc = await getDoc(doc(db, 'patients', bed.current_patient_id));
      if (patientDoc.exists()) {
        bed.current_patient = { id: patientDoc.id, ...patientDoc.data() };
      }
    }

    return bed;
  } catch (error) {
    console.error('Get bed error:', error);
    throw new Error(error.message || 'Failed to fetch bed');
  }
};

/**
 * Assign bed to patient
 * @param {Object} payload - { bed_id, patient_id, assigned_by }
 * @returns {Promise<Object>} assignment record
 */
export const assign = async (payload) => {
  const { bed_id, patient_id, assigned_by } = payload;
  
  if (!bed_id || !patient_id) {
    throw new Error('Bed ID and Patient ID are required');
  }
  
  try {
    const bedRef = doc(db, BEDS_COLLECTION, bed_id);
    const bedDoc = await getDoc(bedRef);
    
    if (!bedDoc.exists()) {
      throw new Error('Bed not found');
    }

    const bedData = bedDoc.data();
    
    if (bedData.status === 'occupied') {
      throw new Error('Bed is already occupied');
    }

    // Create assignment record
    const assignmentId = `${bed_id}_${patient_id}_${Date.now()}`;
    const assignmentRef = doc(db, BED_ASSIGNMENTS_COLLECTION, assignmentId);
    
    const assignmentData = {
      bed_id,
      patient_id,
      assigned_by: assigned_by || 'system',
      assigned_at: Timestamp.now(),
      status: 'active',
      created_at: Timestamp.now(),
    };

    await setDoc(assignmentRef, assignmentData);

    // Update bed status
    await updateDoc(bedRef, {
      status: 'occupied',
      current_patient_id: patient_id,
      updated_at: Timestamp.now(),
    });

    // Update patient record
    const patientRef = doc(db, 'patients', patient_id);
    await updateDoc(patientRef, {
      current_bed_id: bed_id,
      updated_at: Timestamp.now(),
    });

    return { id: assignmentId, ...assignmentData };
  } catch (error) {
    console.error('Assign bed error:', error);
    throw new Error(error.message || 'Failed to assign bed');
  }
};

/**
 * Discharge patient from bed
 * @param {string} bedId
 * @returns {Promise<Object>} discharge record
 */
export const discharge = async (bedId) => {
  if (!bedId) throw new Error('Bed ID is required');
  
  try {
    const bedRef = doc(db, BEDS_COLLECTION, bedId);
    const bedDoc = await getDoc(bedRef);
    
    if (!bedDoc.exists()) {
      throw new Error('Bed not found');
    }

    const bedData = bedDoc.data();
    
    if (bedData.status !== 'occupied') {
      throw new Error('Bed is not occupied');
    }

    const patientId = bedData.current_patient_id;

    // Update bed status
    await updateDoc(bedRef, {
      status: 'available',
      current_patient_id: null,
      updated_at: Timestamp.now(),
    });

    // Update patient record if exists
    if (patientId) {
      const patientRef = doc(db, 'patients', patientId);
      const patientDoc = await getDoc(patientRef);
      if (patientDoc.exists()) {
        await updateDoc(patientRef, {
          current_bed_id: null,
          updated_at: Timestamp.now(),
        });
      }

      // Find and close active assignment
      const assignmentsQuery = query(
        collection(db, BED_ASSIGNMENTS_COLLECTION),
        where('bed_id', '==', bedId),
        where('patient_id', '==', patientId),
        where('status', '==', 'active')
      );
      
      const assignmentsSnapshot = await getDocs(assignmentsQuery);
      for (const assignmentDoc of assignmentsSnapshot.docs) {
        await updateDoc(doc(db, BED_ASSIGNMENTS_COLLECTION, assignmentDoc.id), {
          status: 'discharged',
          discharged_at: Timestamp.now(),
          updated_at: Timestamp.now(),
        });
      }
    }

    return {
      bed_id: bedId,
      patient_id: patientId,
      discharged_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Discharge bed error:', error);
    throw new Error(error.message || 'Failed to discharge patient');
  }
};

/**
 * Update bed status (maintenance, cleaning, etc.)
 * @param {string} bedId
 * @param {string} status - 'available', 'maintenance', 'cleaning'
 * @returns {Promise<Object>}
 */
export const updateStatus = async (bedId, status) => {
  if (!bedId || !status) throw new Error('Bed ID and status are required');
  
  try {
    const bedRef = doc(db, BEDS_COLLECTION, bedId);
    const bedDoc = await getDoc(bedRef);
    
    if (!bedDoc.exists()) {
      throw new Error('Bed not found');
    }

    await updateDoc(bedRef, {
      status,
      updated_at: Timestamp.now(),
    });

    return { id: bedId, status };
  } catch (error) {
    console.error('Update bed status error:', error);
    throw new Error(error.message || 'Failed to update bed status');
  }
};

/**
 * Create a new bed
 * @param {Object} bedData - bed data
 * @returns {Promise<Object>} created bed
 */
export const create = async (bedData) => {
  try {
    const bedRef = doc(collection(db, BEDS_COLLECTION));
    const newBed = {
      ...bedData,
      status: bedData.status || 'available',
      current_patient_id: null,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };

    await setDoc(bedRef, newBed);

    return { id: bedRef.id, ...newBed };
  } catch (error) {
    console.error('Create bed error:', error);
    throw new Error(error.message || 'Failed to create bed');
  }
};

// Export as named object and default
export const bedFirebase = {
  getAll,
  getDepartments,
  getById,
  assign,
  discharge,
  updateStatus,
  create,
};

export default bedFirebase;
