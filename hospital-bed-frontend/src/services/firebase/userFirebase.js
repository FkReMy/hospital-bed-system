// src/services/firebase/userFirebase.js
/**
 * Firebase User Management Service
 * 
 * Firebase adapter for user/staff management operations.
 * Replaces the .NET backend user endpoints with Firestore.
 * 
 * Features:
 * - CRUD operations for staff users
 * - Role management
 * - Compatible with existing userApi interface
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
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig';

const USERS_COLLECTION = 'users';

/**
 * Get all staff users
 * @param {Object} params - optional filters (role, search, page, limit)
 * @returns {Promise<Array>} users
 */
export const getAll = async (params = {}) => {
  try {
    let usersQuery = collection(db, USERS_COLLECTION);
    
    const constraints = [];
    
    if (params.role) {
      constraints.push(where('role', '==', params.role));
    }
    
    constraints.push(orderBy('created_at', 'desc'));
    
    if (constraints.length > 0) {
      usersQuery = query(usersQuery, ...constraints);
    }

    const snapshot = await getDocs(usersQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Get users error:', error);
    throw new Error(error.message || 'Failed to fetch users');
  }
};

/**
 * Get user by ID
 * @param {string} id
 * @returns {Promise<Object>} user with roles
 */
export const getById = async (id) => {
  if (!id) throw new Error('User ID is required');
  
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, id));
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error('Get user error:', error);
    throw new Error(error.message || 'Failed to fetch user');
  }
};

/**
 * Create new staff user
 * @param {Object} data - user payload (email, full_name, role, password, etc.)
 * @returns {Promise<Object>} created user
 */
export const create = async (data) => {
  try {
    const { email, password, full_name, role, department_id } = data;

    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    const userData = {
      email: user.email,
      full_name: full_name || '',
      role: role || 'Nurse',
      roles: [role || 'Nurse'],
      department_id: department_id || null,
      status: 'active',
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };

    await setDoc(doc(db, USERS_COLLECTION, user.uid), userData);

    return { id: user.uid, ...userData };
  } catch (error) {
    console.error('Create user error:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email is already registered');
    }
    throw new Error(error.message || 'Failed to create user');
  }
};

/**
 * Update existing staff user
 * @param {string} id
 * @param {Object} data - updated fields
 * @returns {Promise<Object>} updated user
 */
export const update = async (id, data) => {
  if (!id) throw new Error('User ID is required');
  
  try {
    const userRef = doc(db, USERS_COLLECTION, id);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const updatedData = {
      ...data,
      updated_at: Timestamp.now(),
    };

    await updateDoc(userRef, updatedData);

    return { id, ...userDoc.data(), ...updatedData };
  } catch (error) {
    console.error('Update user error:', error);
    throw new Error(error.message || 'Failed to update user');
  }
};

/**
 * Delete/disable staff user
 * @param {string} id
 * @returns {Promise<void>}
 */
export const remove = async (id) => {
  if (!id) throw new Error('User ID is required');
  
  try {
    const userRef = doc(db, USERS_COLLECTION, id);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    // Soft delete - update status
    await updateDoc(userRef, {
      status: 'deleted',
      deleted_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });
  } catch (error) {
    console.error('Delete user error:', error);
    throw new Error(error.message || 'Failed to delete user');
  }
};

/**
 * Update user roles (admin only)
 * @param {string} id
 * @param {Array<string>} roles - array of role names
 * @returns {Promise<Object>}
 */
export const updateRoles = async (id, roles) => {
  if (!id) throw new Error('User ID is required');
  if (!Array.isArray(roles)) throw new Error('Roles must be an array');
  
  try {
    const userRef = doc(db, USERS_COLLECTION, id);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    await updateDoc(userRef, {
      roles,
      role: roles[0] || 'Nurse', // Set primary role
      updated_at: Timestamp.now(),
    });

    return { id, roles, role: roles[0] };
  } catch (error) {
    console.error('Update user roles error:', error);
    throw new Error(error.message || 'Failed to update user roles');
  }
};

/**
 * Reset user password (admin only)
 * @param {string} id
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPassword = async (id, newPassword) => {
  if (!id) throw new Error('User ID is required');
  if (!newPassword) throw new Error('New password is required');
  
  try {
    // Note: Firebase Admin SDK is required for server-side password reset
    // For client-side, we can only send password reset email
    // This is a limitation - in production, this should be handled by Cloud Functions
    throw new Error('Password reset requires Firebase Admin SDK (backend implementation)');
  } catch (error) {
    console.error('Reset password error:', error);
    throw new Error(error.message || 'Failed to reset password');
  }
};

// Export as named object and default
export const userFirebase = {
  getAll,
  getById,
  create,
  update,
  remove,
  updateRoles,
  resetPassword,
};

export default userFirebase;
