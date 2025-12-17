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
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const BEDS_COLLECTION = 'beds';
const DEPARTMENTS_COLLECTION = 'departments';
const ROOMS_COLLECTION = 'rooms';
const PATIENTS_COLLECTION = 'patients';
const BED_ASSIGNMENTS_COLLECTION = 'bedAssignments';

/**
 * Transform Firestore bed data to match expected UI format
 * @param {Object} bedData - raw Firestore bed data
 * @param {string} bedId - bed document ID
 * @returns {Object} transformed bed data
 */
const transformBedData = async (bedData, bedId) => {
  try {
    // Fetch related data
    let department = null;
    let room = null;
    let currentPatient = null;

    // Get department if departmentId exists
    if (bedData.departmentId) {
      const deptDoc = await getDoc(doc(db, DEPARTMENTS_COLLECTION, bedData.departmentId));
      if (deptDoc.exists()) {
        department = { id: deptDoc.id, ...deptDoc.data() };
      }
    }

    // Get room if roomId exists
    if (bedData.roomId) {
      const roomDoc = await getDoc(doc(db, ROOMS_COLLECTION, bedData.roomId));
      if (roomDoc.exists()) {
        const roomData = roomDoc.data();
        room = { 
          id: roomDoc.id, 
          roomNumber: roomData.roomNumber || roomData.room_number,
          ...roomData 
        };
        // If room has department and we don't have it yet, use room's department
        if (roomData.departmentId && !department) {
          const deptDoc = await getDoc(doc(db, DEPARTMENTS_COLLECTION, roomData.departmentId));
          if (deptDoc.exists()) {
            department = { id: deptDoc.id, ...deptDoc.data() };
          }
        }
      }
    }

    // Get current patient if bed is occupied
    if (bedData.isOccupied) {
      // Find active assignment
      const assignmentsQuery = query(
        collection(db, BED_ASSIGNMENTS_COLLECTION),
        where('bedId', '==', bedId),
        where('dischargedAt', '==', null)
      );
      const assignmentsSnapshot = await getDocs(assignmentsQuery);
      
      if (!assignmentsSnapshot.empty) {
        const assignment = assignmentsSnapshot.docs[0].data();
        if (assignment.patientId) {
          const patientDoc = await getDoc(doc(db, PATIENTS_COLLECTION, assignment.patientId));
          if (patientDoc.exists()) {
            const patientData = patientDoc.data();
            currentPatient = { 
              id: patientDoc.id,
              full_name: patientData.fullName || patientData.full_name,
              ...patientData
            };
          }
        }
      }
    }

    return {
      id: bedId,
      bed_number: bedData.bedNumber || bedData.bed_number,
      status: bedData.isOccupied ? 'occupied' : 'available',
      isOccupied: bedData.isOccupied,
      department_id: bedData.departmentId,
      room_id: bedData.roomId,
      department: department,
      room: room,
      current_patient: currentPatient,
    };
  } catch (error) {
    console.error('Transform bed data error:', error);
    // Return basic bed data if transformation fails
    return {
      id: bedId,
      bed_number: bedData.bedNumber || bedData.bed_number,
      status: bedData.isOccupied ? 'occupied' : 'available',
      isOccupied: bedData.isOccupied,
      department_id: bedData.departmentId,
      room_id: bedData.roomId,
    };
  }
};

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
      constraints.push(where('departmentId', '==', params.departmentId));
    }
    if (params.roomId) {
      constraints.push(where('roomId', '==', params.roomId));
    }
    if (params.isOccupied !== undefined) {
      constraints.push(where('isOccupied', '==', params.isOccupied));
    }
    
    if (constraints.length > 0) {
      bedsQuery = query(bedsQuery, ...constraints);
    }

    const snapshot = await getDocs(bedsQuery);
    const beds = [];

    for (const docSnap of snapshot.docs) {
      const transformedBed = await transformBedData(docSnap.data(), docSnap.id);
      beds.push(transformedBed);
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
  const { bedId, bed_id, patientId, patient_id, assignedBy, assigned_by } = payload;
  
  const finalBedId = bedId || bed_id;
  const finalPatientId = patientId || patient_id;
  const finalAssignedBy = assignedBy || assigned_by || 'system';
  
  if (!finalBedId || !finalPatientId) {
    throw new Error('Bed ID and Patient ID are required');
  }
  
  try {
    const bedRef = doc(db, BEDS_COLLECTION, finalBedId);
    const bedDoc = await getDoc(bedRef);
    
    if (!bedDoc.exists()) {
      throw new Error('Bed not found');
    }

    const bedData = bedDoc.data();
    
    if (bedData.isOccupied) {
      throw new Error('Bed is already occupied');
    }

    // Create assignment record
    const assignmentRef = doc(collection(db, BED_ASSIGNMENTS_COLLECTION));
    
    const assignmentData = {
      bedId: finalBedId,
      patientId: finalPatientId,
      assignedBy: finalAssignedBy,
      assignedAt: Timestamp.now(),
      dischargedAt: null,
      notes: payload.notes || null,
    };

    await setDoc(assignmentRef, assignmentData);

    // Update bed status
    await updateDoc(bedRef, {
      isOccupied: true,
    });

    return { id: assignmentRef.id, ...assignmentData };
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
    
    if (!bedData.isOccupied) {
      throw new Error('Bed is not occupied');
    }

    // Find and close active assignment
    const assignmentsQuery = query(
      collection(db, BED_ASSIGNMENTS_COLLECTION),
      where('bedId', '==', bedId),
      where('dischargedAt', '==', null)
    );
    
    const assignmentsSnapshot = await getDocs(assignmentsQuery);
    for (const assignmentDoc of assignmentsSnapshot.docs) {
      await updateDoc(doc(db, BED_ASSIGNMENTS_COLLECTION, assignmentDoc.id), {
        dischargedAt: Timestamp.now(),
      });
    }

    // Update bed status
    await updateDoc(bedRef, {
      isOccupied: false,
    });

    return {
      bedId: bedId,
      dischargedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Discharge bed error:', error);
    throw new Error(error.message || 'Failed to discharge patient');
  }
};

/**
 * Update bed status (DEPRECATED - kept for backward compatibility)
 * Note: In the new schema, we only have isOccupied boolean
 * Status is managed through bed assignment operations
 * @deprecated Use assign() and discharge() instead
 * @param {string} bedId
 * @param {string} status - Ignored in new schema
 * @returns {Promise<Object>}
 */
export const updateStatus = async (bedId, _status) => {
  if (!bedId) throw new Error('Bed ID is required');
  
  console.warn('updateStatus is deprecated. Use assign() or discharge() instead.');
  
  try {
    const bedRef = doc(db, BEDS_COLLECTION, bedId);
    const bedDoc = await getDoc(bedRef);
    
    if (!bedDoc.exists()) {
      throw new Error('Bed not found');
    }

    // In the new schema, we don't have a status field
    // isOccupied is the only status indicator
    return { id: bedId, isOccupied: bedDoc.data().isOccupied };
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
      bedNumber: bedData.bedNumber || bedData.bed_number,
      roomId: bedData.roomId || bedData.room_id,
      departmentId: bedData.departmentId || bedData.department_id,
      isOccupied: bedData.isOccupied || bedData.is_occupied || false,
    };

    await setDoc(bedRef, newBed);

    return { id: bedRef.id, ...newBed };
  } catch (error) {
    console.error('Create bed error:', error);
    throw new Error(error.message || 'Failed to create bed');
  }
};

/**
 * Subscribe to real-time bed updates
 * @param {Function} callback - called when beds change
 * @param {Object} params - optional filters
 * @returns {Function} unsubscribe function
 */
export const subscribeToBeds = (callback, params = {}) => {
  try {
    let bedsQuery = collection(db, BEDS_COLLECTION);
    
    const constraints = [];
    if (params.departmentId) {
      constraints.push(where('departmentId', '==', params.departmentId));
    }
    if (params.roomId) {
      constraints.push(where('roomId', '==', params.roomId));
    }
    if (params.isOccupied !== undefined) {
      constraints.push(where('isOccupied', '==', params.isOccupied));
    }
    
    if (constraints.length > 0) {
      bedsQuery = query(bedsQuery, ...constraints);
    }

    return onSnapshot(
      bedsQuery, 
      (snapshot) => {
        // Process snapshot synchronously to avoid race conditions
        // Transform data asynchronously but handle errors per-bed
        Promise.all(
          snapshot.docs.map(async (docSnap) => {
            try {
              return await transformBedData(docSnap.data(), docSnap.id);
            } catch (error) {
              console.error(`Error transforming bed ${docSnap.id}:`, error);
              // Return basic bed data if transformation fails
              const bedData = docSnap.data();
              return {
                id: docSnap.id,
                bed_number: bedData.bedNumber || bedData.bed_number,
                status: bedData.isOccupied ? 'occupied' : 'available',
                isOccupied: bedData.isOccupied,
                department_id: bedData.departmentId,
                room_id: bedData.roomId,
              };
            }
          })
        )
        .then((beds) => {
          callback(beds);
        })
        .catch((error) => {
          // This catch is unlikely to be reached since individual promises
          // have their own error handling, but kept as a safety net for
          // unexpected errors (e.g., callback throwing an error)
          console.error('Error processing bed updates:', error);
          callback([]);
        });
      }, 
      (error) => {
        console.error('Bed subscription error:', error);
        // Attempt to reconnect by calling the callback with empty array
        // This will trigger UI to show loading state or error
        callback([]);
      }
    );
  } catch (error) {
    console.error('Subscribe to beds error:', error);
    throw new Error(error.message || 'Failed to subscribe to beds');
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
  subscribeToBeds,
};

export default bedFirebase;
