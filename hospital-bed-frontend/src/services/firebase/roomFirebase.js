// src/services/firebase/roomFirebase.js
/**
 * Firebase Room Management Service
 * 
 * Firebase adapter for room-related operations.
 * Replaces the .NET backend room endpoints with Firestore.
 * 
 * Features:
 * - CRUD operations for rooms
 * - Compatible with existing roomApi interface
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
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const ROOMS_COLLECTION = 'rooms';

/**
 * Get all rooms with optional filters
 * @param {Object} params - optional filters (departmentId, floor, etc.)
 * @returns {Promise<Array>} rooms
 */
export const getAll = async (params = {}) => {
  try {
    let roomsQuery = collection(db, ROOMS_COLLECTION);
    
    const constraints = [];
    
    if (params.departmentId) {
      constraints.push(where('departmentId', '==', params.departmentId));
    }
    if (params.floor) {
      constraints.push(where('floor', '==', parseInt(params.floor)));
    }
    
    if (constraints.length > 0) {
      roomsQuery = query(roomsQuery, ...constraints);
    }

    const snapshot = await getDocs(roomsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Get rooms error:', error);
    throw new Error(error.message || 'Failed to fetch rooms');
  }
};

/**
 * Get room by ID
 * @param {string} id
 * @returns {Promise<Object>} room
 */
export const getById = async (id) => {
  if (!id) throw new Error('Room ID is required');
  
  try {
    const roomDoc = await getDoc(doc(db, ROOMS_COLLECTION, id));
    
    if (!roomDoc.exists()) {
      throw new Error('Room not found');
    }

    return { id: roomDoc.id, ...roomDoc.data() };
  } catch (error) {
    console.error('Get room error:', error);
    throw new Error(error.message || 'Failed to fetch room');
  }
};

/**
 * Create new room
 * @param {Object} data - room payload
 * @returns {Promise<Object>} created room
 */
export const create = async (data) => {
  try {
    const roomRef = doc(collection(db, ROOMS_COLLECTION));
    
    const newRoom = {
      roomNumber: data.roomNumber || data.room_number,
      floor: data.floor || null,
      roomType: data.roomType || data.room_type,
      capacity: data.capacity || 1,
      departmentId: data.departmentId || data.department_id,
    };

    await setDoc(roomRef, newRoom);

    return { id: roomRef.id, ...newRoom };
  } catch (error) {
    console.error('Create room error:', error);
    throw new Error(error.message || 'Failed to create room');
  }
};

/**
 * Update existing room
 * @param {string} id
 * @param {Object} data - updated fields
 * @returns {Promise<Object>} updated room
 */
export const update = async (id, data) => {
  if (!id) throw new Error('Room ID is required');
  
  try {
    const roomRef = doc(db, ROOMS_COLLECTION, id);
    const roomDoc = await getDoc(roomRef);
    
    if (!roomDoc.exists()) {
      throw new Error('Room not found');
    }

    // Convert snake_case to camelCase for updates
    const updatedData = {
      ...(data.roomNumber && { roomNumber: data.roomNumber }),
      ...(data.room_number && { roomNumber: data.room_number }),
      ...(data.floor !== undefined && { floor: data.floor }),
      ...(data.roomType && { roomType: data.roomType }),
      ...(data.room_type && { roomType: data.room_type }),
      ...(data.capacity !== undefined && { capacity: data.capacity }),
      ...(data.departmentId && { departmentId: data.departmentId }),
      ...(data.department_id && { departmentId: data.department_id }),
    };

    await updateDoc(roomRef, updatedData);

    return { id, ...roomDoc.data(), ...updatedData };
  } catch (error) {
    console.error('Update room error:', error);
    throw new Error(error.message || 'Failed to update room');
  }
};

/**
 * Delete room
 * @param {string} id
 * @returns {Promise<void>}
 */
export const remove = async (id) => {
  if (!id) throw new Error('Room ID is required');
  
  try {
    const roomRef = doc(db, ROOMS_COLLECTION, id);
    const roomDoc = await getDoc(roomRef);
    
    if (!roomDoc.exists()) {
      throw new Error('Room not found');
    }

    await deleteDoc(roomRef);
  } catch (error) {
    console.error('Delete room error:', error);
    throw new Error(error.message || 'Failed to delete room');
  }
};

// Export as named object and default
export const roomFirebase = {
  getAll,
  getById,
  create,
  update,
  remove,
};

export default roomFirebase;
