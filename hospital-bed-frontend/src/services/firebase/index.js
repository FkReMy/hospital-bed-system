// src/services/firebase/index.js
/**
 * Firebase Services Index
 * 
 * Central export point for all Firebase services.
 * Import Firebase services from here to use Firebase as the backend.
 * 
 * Usage:
 * import { authFirebase, bedFirebase, patientFirebase } from '@services/firebase';
 */

export { default as authFirebase } from './authFirebase';
export { default as bedFirebase } from './bedFirebase';
export { default as patientFirebase } from './patientFirebase';
export { default as userFirebase } from './userFirebase';
export { default as appointmentFirebase } from './appointmentFirebase';
export { default as departmentFirebase } from './departmentFirebase';
export { default as roomFirebase } from './roomFirebase';
export { default as prescriptionFirebase } from './prescriptionFirebase';
export { default as notificationFirebase } from './notificationFirebase';
export { default as bedAssignmentFirebase } from './bedAssignmentFirebase';

// Re-export Firebase config for direct access if needed
export { auth, db } from './firebaseConfig';
export { default as firebaseApp } from './firebaseConfig';
