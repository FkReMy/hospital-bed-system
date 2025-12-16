// src/services/firebase/authFirebase.js
/**
 * Firebase Authentication Service
 * 
 * Firebase adapter for authentication operations.
 * Replaces the .NET backend auth endpoints with Firebase Auth.
 * 
 * Features:
 * - Email/password authentication
 * - User session management
 * - Role-based access control via Firestore custom claims
 * - Compatible with existing authApi interface
 */

import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

/**
 * Login with email and password
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} user data with roles
 */
export const login = async (credentials) => {
  try {
    const { email, password } = credentials;
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user profile from Firestore (includes roles, etc.)
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    const userData = userDoc.data();

    return {
      id: user.uid,
      email: user.email,
      full_name: userData.fullName || userData.full_name || '',
      role: userData.role || 'nurse',
      roles: userData.roles || [userData.role || 'nurse'],
      department_id: userData.departmentId || userData.department_id || null,
      ...userData,
    };
  } catch (error) {
    console.error('Login error:', error);
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('Invalid email or password');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many login attempts. Please try again later.');
    }
    throw new Error(error.message || 'Login failed. Please check your credentials.');
  }
};

/**
 * Logout - signs out from Firebase Auth
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.warn('Logout error:', error);
    throw new Error(error.message || 'Logout failed');
  }
};

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>} user with roles or null if not authenticated
 */
export const me = async () => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      return null;
    }

    // Fetch user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data();

    return {
      id: user.uid,
      email: user.email,
      full_name: userData.fullName || userData.full_name || '',
      role: userData.role || 'nurse',
      roles: userData.roles || [userData.role || 'nurse'],
      department_id: userData.departmentId || userData.department_id || null,
      ...userData,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    // Don't throw on 401-equivalent, return null
    return null;
  }
};

/**
 * Register a new user (admin only in production)
 * @param {Object} userData - user registration data
 * @returns {Promise<Object>} created user
 */
export const register = async (userData) => {
  try {
    const { email, password, full_name, role, department_id } = userData;

    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      full_name: full_name || '',
      role: role || 'Nurse',
      roles: [role || 'Nurse'],
      department_id: department_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return {
      id: user.uid,
      email: user.email,
      full_name,
      role: role || 'Nurse',
      roles: [role || 'Nurse'],
      department_id,
    };
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email is already registered');
    }
    throw new Error(error.message || 'Registration failed');
  }
};

/**
 * Setup auth state listener
 * @param {Function} callback - called when auth state changes
 * @returns {Function} unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Fetch full user data when authenticated
      const userData = await me();
      callback(userData);
    } else {
      callback(null);
    }
  });
};

/**
 * Refresh token (no-op for Firebase, tokens are managed automatically)
 * @returns {Promise<void>}
 */
export const refresh = async () => {
  // Firebase handles token refresh automatically
  return Promise.resolve();
};

// Export as named object and default
export const authFirebase = {
  login,
  logout,
  me,
  register,
  refresh,
  onAuthStateChange,
};

export default authFirebase;
