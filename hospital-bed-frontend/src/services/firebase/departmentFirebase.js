// src/services/firebase/departmentFirebase.js
/**
 * Firebase Department Management Service
 * 
 * Firebase adapter for department-related operations.
 * Replaces the .NET backend department endpoints with Firestore.
 * 
 * Features:
 * - CRUD operations for departments
 * - Compatible with existing departmentApi interface
 */

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  orderBy as firestoreOrderBy,
  query,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const DEPARTMENTS_COLLECTION = 'departments';

/**
 * Get all departments
 * @param {Object} params - optional filters
 * @returns {Promise<Array>} departments
 */
export const getAll = async (params = {}) => {
  try {
    let departmentsQuery = collection(db, DEPARTMENTS_COLLECTION);
    
    if (params.orderBy) {
      departmentsQuery = query(departmentsQuery, firestoreOrderBy('name', 'asc'));
    }

    const snapshot = await getDocs(departmentsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Get departments error:', error);
    throw new Error(error.message || 'Failed to fetch departments');
  }
};

/**
 * Get department by ID
 * @param {string} id
 * @returns {Promise<Object>} department
 */
export const getById = async (id) => {
  if (!id) throw new Error('Department ID is required');
  
  try {
    const departmentDoc = await getDoc(doc(db, DEPARTMENTS_COLLECTION, id));
    
    if (!departmentDoc.exists()) {
      throw new Error('Department not found');
    }

    return { id: departmentDoc.id, ...departmentDoc.data() };
  } catch (error) {
    console.error('Get department error:', error);
    throw new Error(error.message || 'Failed to fetch department');
  }
};

/**
 * Create new department
 * @param {Object} data - department payload
 * @returns {Promise<Object>} created department
 */
export const create = async (data) => {
  try {
    const departmentRef = doc(collection(db, DEPARTMENTS_COLLECTION));
    
    const newDepartment = {
      ...data,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };

    await setDoc(departmentRef, newDepartment);

    return { id: departmentRef.id, ...newDepartment };
  } catch (error) {
    console.error('Create department error:', error);
    throw new Error(error.message || 'Failed to create department');
  }
};

/**
 * Update existing department
 * @param {string} id
 * @param {Object} data - updated fields
 * @returns {Promise<Object>} updated department
 */
export const update = async (id, data) => {
  if (!id) throw new Error('Department ID is required');
  
  try {
    const departmentRef = doc(db, DEPARTMENTS_COLLECTION, id);
    const departmentDoc = await getDoc(departmentRef);
    
    if (!departmentDoc.exists()) {
      throw new Error('Department not found');
    }

    const updatedData = {
      ...data,
      updated_at: Timestamp.now(),
    };

    await updateDoc(departmentRef, updatedData);

    return { id, ...departmentDoc.data(), ...updatedData };
  } catch (error) {
    console.error('Update department error:', error);
    throw new Error(error.message || 'Failed to update department');
  }
};

/**
 * Delete department
 * @param {string} id
 * @returns {Promise<void>}
 */
export const remove = async (id) => {
  if (!id) throw new Error('Department ID is required');
  
  try {
    const departmentRef = doc(db, DEPARTMENTS_COLLECTION, id);
    const departmentDoc = await getDoc(departmentRef);
    
    if (!departmentDoc.exists()) {
      throw new Error('Department not found');
    }

    await deleteDoc(departmentRef);
  } catch (error) {
    console.error('Delete department error:', error);
    throw new Error(error.message || 'Failed to delete department');
  }
};

// Export as named object and default
export const departmentFirebase = {
  getAll,
  getById,
  create,
  update,
  remove,
};

export default departmentFirebase;
