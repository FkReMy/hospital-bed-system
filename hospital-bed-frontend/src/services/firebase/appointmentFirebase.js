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
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const APPOINTMENTS_COLLECTION = 'appointments';
const PATIENTS_COLLECTION = 'patients';
const USERS_COLLECTION = 'users';

// Fallback constants for missing data
const UNKNOWN_PATIENT = 'Unknown Patient';
const UNKNOWN_DOCTOR = 'Unknown Doctor';

/**
 * Transform Firestore appointment data to match expected UI format
 * @param {Object} appointmentData - raw Firestore appointment data
 * @param {string} appointmentId - appointment document ID
 * @returns {Object} transformed appointment data
 */
const transformAppointmentData = async (appointmentData, appointmentId) => {
  try {
    let patientName = UNKNOWN_PATIENT;
    let doctorName = UNKNOWN_DOCTOR;
    let patientDateOfBirth = null;
    let patientStatus = null;
    let patientDepartment = null;

    // Get patient info
    if (appointmentData.patientId) {
      const patientDoc = await getDoc(doc(db, PATIENTS_COLLECTION, appointmentData.patientId));
      if (patientDoc.exists()) {
        const patientData = patientDoc.data();
        patientName = patientData.fullName || patientData.full_name || UNKNOWN_PATIENT;
        patientDateOfBirth = patientData.dateOfBirth || patientData.date_of_birth || null;
        patientStatus = patientData.status || null;
        patientDepartment = patientData.department || patientData.department_id || null;
      }
    }

    // Get doctor info
    if (appointmentData.doctorId) {
      const doctorDoc = await getDoc(doc(db, USERS_COLLECTION, appointmentData.doctorId));
      if (doctorDoc.exists()) {
        const doctorData = doctorDoc.data();
        doctorName = doctorData.fullName || doctorData.full_name || UNKNOWN_DOCTOR;
      }
    }

    // Convert Timestamp to ISO string if needed
    let appointmentDate = appointmentData.appointmentDate;
    if (appointmentDate && appointmentDate.toDate) {
      appointmentDate = appointmentDate.toDate().toISOString();
    }

    return {
      id: appointmentId,
      patient_id: appointmentData.patientId,
      doctor_user_id: appointmentData.doctorId,
      patient_name: patientName,
      patient_date_of_birth: patientDateOfBirth,
      patient_status: patientStatus,
      patient_department: patientDepartment,
      doctor_name: doctorName,
      appointment_date: appointmentDate,
      status: appointmentData.status || 'scheduled',
      reason: appointmentData.reason,
      notes: appointmentData.notes,
      created_by: appointmentData.createdBy,
      created_at: appointmentData.createdAt,
    };
  } catch (error) {
    console.error('Transform appointment data error:', error);
    // Return basic appointment data if transformation fails
    let appointmentDate = appointmentData.appointmentDate;
    if (appointmentDate && appointmentDate.toDate) {
      appointmentDate = appointmentDate.toDate().toISOString();
    }
    
    return {
      id: appointmentId,
      patient_id: appointmentData.patientId,
      doctor_user_id: appointmentData.doctorId,
      patient_name: UNKNOWN_PATIENT,
      patient_date_of_birth: null,
      patient_status: null,
      patient_department: null,
      doctor_name: UNKNOWN_DOCTOR,
      appointment_date: appointmentDate,
      status: appointmentData.status || 'scheduled',
      reason: appointmentData.reason,
      notes: appointmentData.notes,
    };
  }
};

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
    const appointments = [];
    
    for (const docSnap of snapshot.docs) {
      const transformedAppointment = await transformAppointmentData(docSnap.data(), docSnap.id);
      appointments.push(transformedAppointment);
    }
    
    return appointments;
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
    
    // Handle both snake_case and camelCase inputs
    const patientId = data.patientId || data.patient_id;
    const doctorId = data.doctorId || data.doctor_id || data.doctor_user_id;
    
    // Parse date properly - handle both ISO string and Date objects
    let appointmentDate;
    if (data.appointmentDate || data.appointment_date) {
      const dateStr = data.appointmentDate || data.appointment_date;
      appointmentDate = typeof dateStr === 'string' ? Timestamp.fromDate(new Date(dateStr)) : Timestamp.fromDate(dateStr);
    } else {
      appointmentDate = Timestamp.now();
    }
    
    const newAppointment = {
      patientId,
      doctorId,
      appointmentDate,
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
      ...(data.doctor_user_id && { doctorId: data.doctor_user_id }),
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

/**
 * Subscribe to real-time appointment updates
 * @param {Function} callback - called when appointments change
 * @param {Object} params - optional filters
 * @returns {Function} unsubscribe function
 */
export const subscribeToAppointments = (callback, params = {}) => {
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

    return onSnapshot(
      appointmentsQuery, 
      (snapshot) => {
        // Process snapshot synchronously to avoid race conditions
        // Transform data asynchronously but handle errors per-appointment
        Promise.all(
          snapshot.docs.map(async (docSnap) => {
            try {
              return await transformAppointmentData(docSnap.data(), docSnap.id);
            } catch (error) {
              console.error(`Error transforming appointment ${docSnap.id}:`, error);
              // Return basic appointment data if transformation fails
              const appointmentData = docSnap.data();
              let appointmentDate = appointmentData.appointmentDate;
              if (appointmentDate && appointmentDate.toDate) {
                appointmentDate = appointmentDate.toDate().toISOString();
              }
              return {
                id: docSnap.id,
                patient_id: appointmentData.patientId,
                doctor_user_id: appointmentData.doctorId,
                patient_name: UNKNOWN_PATIENT,
                patient_date_of_birth: null,
                patient_status: null,
                patient_department: null,
                doctor_name: UNKNOWN_DOCTOR,
                appointment_date: appointmentDate,
                status: appointmentData.status || 'scheduled',
                reason: appointmentData.reason,
                notes: appointmentData.notes,
              };
            }
          })
        )
        .then((appointments) => {
          callback(appointments);
        })
        .catch((error) => {
          // This catch is unlikely to be reached since individual promises
          // have their own error handling, but kept as a safety net for
          // unexpected errors (e.g., callback throwing an error)
          console.error('Error processing appointment updates:', error);
          callback([]);
        });
      }, 
      (error) => {
        console.error('Appointment subscription error:', error);
        // Attempt to recover by calling the callback with empty array
        callback([]);
      }
    );
  } catch (error) {
    console.error('Subscribe to appointments error:', error);
    throw new Error(error.message || 'Failed to subscribe to appointments');
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
  subscribeToAppointments,
};

export default appointmentFirebase;
