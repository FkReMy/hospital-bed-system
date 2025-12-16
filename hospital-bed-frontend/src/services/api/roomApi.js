// src/services/api/roomApi.js
/**
 * roomApi Service
 * 
 * Production-ready API client for room-related endpoints.
 * Now uses Firebase Firestore instead of .NET backend.
 * 
 * Features:
 * - Firebase Firestore for room data
 * - Consistent interface with previous implementation
 * - Compatible with existing room management components
 */

import roomFirebase from '../firebase/roomFirebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

/**
 * Get all rooms (with optional filters)
 * @param {Object} params - query params (departmentId, includeBeds, etc.)
 * @returns {Promise<Array>} rooms
 */
export const getAll = roomFirebase.getAll;

/**
 * Get single room by ID
 * @param {string|number} id
 * @returns {Promise<Object>} room with beds
 */
export const getById = roomFirebase.getById;

/**
 * Get beds in a specific room
 * @param {string|number} roomId
 * @returns {Promise<Array>} beds in room
 */
export const getBeds = async (roomId) => {
  if (!roomId) throw new Error('Room ID is required');
  
  try {
    const bedsQuery = query(
      collection(db, 'beds'),
      where('room_id', '==', roomId)
    );
    const snapshot = await getDocs(bedsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch beds in room');
  }
};

/**
 * Get rooms in a department
 * @param {string|number} departmentId
 * @returns {Promise<Array>} rooms in department
 */
export const getByDepartment = async (departmentId) => {
  if (!departmentId) throw new Error('Department ID is required');
  
  try {
    const roomsQuery = query(
      collection(db, 'rooms'),
      where('department_id', '==', departmentId)
    );
    const snapshot = await getDocs(roomsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch rooms in department');
  }
};

// Export as named object and default
export const roomApi = {
  getAll,
  getById,
  getBeds,
  getByDepartment,
};

export default roomApi;