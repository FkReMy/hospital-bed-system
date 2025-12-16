// src/services/api/departmentApi.js
/**
 * departmentApi Service
 * 
 * Production-ready API client for department-related endpoints.
 * Now uses Firebase Firestore instead of .NET backend.
 * 
 * Features:
 * - Firebase Firestore for department data
 * - Consistent interface with previous implementation
 * - Compatible with existing department management components
 */

import departmentFirebase from '../firebase/departmentFirebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

/**
 * Get all departments (with optional bed/room counts)
 * @param {Object} params - optional query params (includeStats, etc.)
 * @returns {Promise<Array>} departments
 */
export const getAll = departmentFirebase.getAll;

/**
 * Get single department by ID
 * @param {string|number} id
 * @returns {Promise<Object>} department with rooms/beds
 */
export const getById = departmentFirebase.getById;

/**
 * Get rooms in a department
 * @param {string|number} departmentId
 * @returns {Promise<Array>} rooms
 */
export const getRooms = async (departmentId) => {
  if (!departmentId) throw new Error('Department ID is required');
  
  try {
    const roomsQuery = query(
      collection(db, 'rooms'),
      where('department_id', '==', departmentId)
    );
    const snapshot = await getDocs(roomsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch rooms');
  }
};

/**
 * Get department statistics (bed count, occupancy, etc.)
 * @param {string|number} departmentId
 * @returns {Promise<Object>} stats
 */
export const getStats = async (departmentId) => {
  if (!departmentId) throw new Error('Department ID is required');
  
  try {
    // Get all beds in this department
    const bedsQuery = query(
      collection(db, 'beds'),
      where('department_id', '==', departmentId)
    );
    const bedsSnapshot = await getDocs(bedsQuery);
    const beds = bedsSnapshot.docs.map(doc => doc.data());
    
    const totalBeds = beds.length;
    const occupiedBeds = beds.filter(bed => bed.status === 'occupied').length;
    const availableBeds = beds.filter(bed => bed.status === 'available').length;
    const maintenanceBeds = beds.filter(bed => bed.status === 'maintenance').length;
    
    return {
      department_id: departmentId,
      total_beds: totalBeds,
      occupied_beds: occupiedBeds,
      available_beds: availableBeds,
      maintenance_beds: maintenanceBeds,
      occupancy_rate: totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0,
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch department statistics');
  }
};

// Export as named object and default
export const departmentApi = {
  getAll,
  getById,
  getRooms,
  getStats,
};

export default departmentApi;