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
  query, 
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
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
    
    constraints.push(orderBy('createdAt', 'desc'));
    
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
    const { email, password, full_name, role, department_id: _department_id } = data;

    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore using camelCase schema
    const userData = {
      email: user.email,
      fullName: full_name || '',
      phone: data.phone || null,
      address: data.address || null,
      hiringDate: data.hiring_date || data.hiringDate || null,
      shiftType: data.shift_type || data.shiftType || null,
      licenseNumber: data.license_number || data.licenseNumber || null,
      yearsOfExperience: data.years_of_experience || data.yearsOfExperience || 0,
      role: role || 'nurse',
      specializations: data.specializations || [],
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
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

    // Convert snake_case to camelCase for updates
    const updatedData = {
      ...(data.full_name && { fullName: data.full_name }),
      ...(data.fullName && { fullName: data.fullName }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.hiring_date && { hiringDate: data.hiring_date }),
      ...(data.hiringDate && { hiringDate: data.hiringDate }),
      ...(data.shift_type && { shiftType: data.shift_type }),
      ...(data.shiftType && { shiftType: data.shiftType }),
      ...(data.license_number && { licenseNumber: data.license_number }),
      ...(data.licenseNumber && { licenseNumber: data.licenseNumber }),
      ...(data.years_of_experience !== undefined && { yearsOfExperience: data.years_of_experience }),
      ...(data.yearsOfExperience !== undefined && { yearsOfExperience: data.yearsOfExperience }),
      ...(data.role && { role: data.role }),
      ...(data.specializations && { specializations: data.specializations }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.is_active !== undefined && { isActive: data.is_active }),
      updatedAt: Timestamp.now(),
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

    // Soft delete - update isActive status
    await updateDoc(userRef, {
      isActive: false,
      deletedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
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
      role: roles[0] || 'nurse', // Set primary role
      updatedAt: Timestamp.now(),
    });

    return { id, roles, role: roles[0] };
  } catch (error) {
    console.error('Update user roles error:', error);
    throw new Error(error.message || 'Failed to update user roles');
  }
};

/**
 * Reset user password (admin only)
 * Sends password reset email via Firebase Auth
 * @param {string} id - User ID
 * @param {string} email - User email (required for Firebase)
 * @returns {Promise<void>}
 */
export const resetPassword = async (id, email) => {
  if (!id) throw new Error('User ID is required');
  if (!email) throw new Error('User email is required');
  
  try {
    // Verify user exists in Firestore
    const userRef = doc(db, USERS_COLLECTION, id);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    // Send password reset email via Firebase Auth
    await sendPasswordResetEmail(auth, email);

    // Note: We could also set mustChangePassword flag here if needed
    // await updateDoc(userRef, {
    //   mustChangePassword: true,
    //   updated_at: Timestamp.now(),
    // });

    return { message: 'Password reset email sent successfully' };
  } catch (error) {
    console.error('Reset password error:', error);
    if (error.code === 'auth/user-not-found') {
      throw new Error('No user found with this email address');
    }
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

/**
 * Force user to change password on next login (admin only)
 * @param {string} id - User ID
 * @param {boolean} mustChange - Whether to force password change
 * @returns {Promise<void>}
 */
export const forcePasswordChange = async (id, mustChange = true) => {
  if (!id) throw new Error('User ID is required');
  
  try {
    const userRef = doc(db, USERS_COLLECTION, id);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    await updateDoc(userRef, {
      mustChangePassword: mustChange,
      updatedAt: Timestamp.now(),
    });

    return { message: `User will ${mustChange ? 'be required to' : 'not be required to'} change password on next login` };
  } catch (error) {
    console.error('Force password change error:', error);
    throw new Error(error.message || 'Failed to update password change requirement');
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
  forcePasswordChange,
};

export default userFirebase;
