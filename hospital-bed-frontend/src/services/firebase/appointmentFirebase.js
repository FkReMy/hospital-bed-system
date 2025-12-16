// src/services/firebase/appointmentFirebase.js
/**
 * Firebase Appointment Management Service
 * 
 * Firebase adapter for appointment-related operations.
 * Replaces the .NET backend appointment endpoints with Firestore.
 * 
 * Features:
 * - CRUD operations for appointments
 * - Appointment scheduling and status management
 * - Compatible with existing appointmentApi interface
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
import { db } from './firebaseConfig';

const APPOINTMENTS_COLLECTION = 'appointments';

/**
 * Get all appointments (with optional filters)
 * @param {Object} params - query params (patientId, doctorId, date, status)
 * @returns {Promise<Array>} appointments
 */
export const getAll = async (params = {}) => {
  try {
    let appointmentsQuery = collection(db, APPOINTMENTS_COLLECTION);
    
    const constraints = [];
    
    if (params.patientId) {
      constraints.push(where('patientId', '==', params.patientId));
    }
    if (params.doctorId) {
      constraints.push(where('doctorId', '==', params.doctorId));
    }
    if (params.status) {
      constraints.push(where('status', '==', params.status));
    }
    
    constraints.push(orderBy('appointmentDate', 'desc'));
    
    if (constraints.length > 0) {
      appointmentsQuery = query(appointmentsQuery, ...constraints);
    }

    const snapshot = await getDocs(appointmentsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Get appointments error:', error);
    throw new Error(error.message || 'Failed to fetch appointments');
  }
};

/**
 * Get appointment by ID
 * @param {string} id
 * @returns {Promise<Object>} appointment
 */
export const getById = async (id) => {
  if (!id) throw new Error('Appointment ID is required');
  
  try {
    const appointmentDoc = await getDoc(doc(db, APPOINTMENTS_COLLECTION, id));
    
    if (!appointmentDoc.exists()) {
      throw new Error('Appointment not found');
    }

    return { id: appointmentDoc.id, ...appointmentDoc.data() };
  } catch (error) {
    console.error('Get appointment error:', error);
    throw new Error(error.message || 'Failed to fetch appointment');
  }
};

/**
 * Create new appointment
 * @param {Object} data - appointment payload
 * @returns {Promise<Object>} created appointment
 */
export const create = async (data) => {
  try {
    const appointmentRef = doc(collection(db, APPOINTMENTS_COLLECTION));
    
    const newAppointment = {
      patientId: data.patientId || data.patient_id,
      doctorId: data.doctorId || data.doctor_id,
      appointmentDate: data.appointmentDate || data.appointment_date || Timestamp.now(),
      status: data.status || 'scheduled',
      reason: data.reason || null,
      notes: data.notes || null,
      createdBy: data.createdBy || data.created_by || 'system',
      createdAt: Timestamp.now(),
    };

    await setDoc(appointmentRef, newAppointment);

    return { id: appointmentRef.id, ...newAppointment };
  } catch (error) {
    console.error('Create appointment error:', error);
    throw new Error(error.message || 'Failed to schedule appointment');
  }
};

/**
 * Update existing appointment
 * @param {string} id
 * @param {Object} data - updated fields
 * @returns {Promise<Object>} updated appointment
 */
export const update = async (id, data) => {
  if (!id) throw new Error('Appointment ID is required');
  
  try {
    const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, id);
    const appointmentDoc = await getDoc(appointmentRef);
    
    if (!appointmentDoc.exists()) {
      throw new Error('Appointment not found');
    }

    // Convert snake_case to camelCase for updates
    const updatedData = {
      ...(data.patientId && { patientId: data.patientId }),
      ...(data.patient_id && { patientId: data.patient_id }),
      ...(data.doctorId && { doctorId: data.doctorId }),
      ...(data.doctor_id && { doctorId: data.doctor_id }),
      ...(data.appointmentDate && { appointmentDate: data.appointmentDate }),
      ...(data.appointment_date && { appointmentDate: data.appointment_date }),
      ...(data.status && { status: data.status }),
      ...(data.reason !== undefined && { reason: data.reason }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.createdBy && { createdBy: data.createdBy }),
      ...(data.created_by && { createdBy: data.created_by }),
    };

    await updateDoc(appointmentRef, updatedData);

    return { id, ...appointmentDoc.data(), ...updatedData };
  } catch (error) {
    console.error('Update appointment error:', error);
    throw new Error(error.message || 'Failed to update appointment');
  }
};

/**
 * Delete/cancel appointment
 * @param {string} id
 * @returns {Promise<void>}
 */
export const cancel = async (id) => {
  if (!id) throw new Error('Appointment ID is required');
  
  try {
    const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, id);
    const appointmentDoc = await getDoc(appointmentRef);
    
    if (!appointmentDoc.exists()) {
      throw new Error('Appointment not found');
    }

    // Update status to cancelled instead of deleting
    await updateDoc(appointmentRef, {
      status: 'cancelled',
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    throw new Error(error.message || 'Failed to cancel appointment');
  }
};

/**
 * Update appointment status (complete, no-show, etc.)
 * @param {string} id
 * @param {string} status - 'completed', 'no_show', etc.
 * @returns {Promise<Object>}
 */
export const updateStatus = async (id, status) => {
  if (!id || !status) throw new Error('Appointment ID and status are required');
  
  try {
    const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, id);
    const appointmentDoc = await getDoc(appointmentRef);
    
    if (!appointmentDoc.exists()) {
      throw new Error('Appointment not found');
    }

    await updateDoc(appointmentRef, {
      status,
    });

    return { id, status };
  } catch (error) {
    console.error('Update appointment status error:', error);
    throw new Error(error.message || 'Failed to update appointment status');
  }
};

// Export as default object
export const appointmentFirebase = {
  getAll,
  getById,
  create,
  update,
  cancel,
  updateStatus,
};

export default appointmentFirebase;
