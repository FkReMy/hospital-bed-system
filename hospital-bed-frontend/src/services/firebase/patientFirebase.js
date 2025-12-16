// src/services/firebase/patientFirebase.js
/**
 * Firebase Patient Management Service
 * 
 * Firebase adapter for patient-related operations.
 * Replaces the .NET backend patient endpoints with Firestore.
 * 
 * Features:
 * - CRUD operations for patients
 * - Patient search functionality
 * - Compatible with existing patientApi interface
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
  limit as firestoreLimit,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const PATIENTS_COLLECTION = 'patients';

/**
 * Get all patients with optional filters and pagination
 * @param {Object} params - query params (search, departmentId, status, page, limit)
 * @returns {Promise<Array>} patients
 */
export const getAll = async (params = {}) => {
  try {
    let patientsQuery = collection(db, PATIENTS_COLLECTION);
    
    const constraints = [];
    
    // Apply filters
    if (params.departmentId) {
      constraints.push(where('department', '==', params.departmentId));
    }
    if (params.status) {
      constraints.push(where('status', '==', params.status));
    }
    
    // Apply ordering
    constraints.push(orderBy('createdAt', 'desc'));
    
    // Apply limit
    if (params.limit) {
      constraints.push(firestoreLimit(parseInt(params.limit)));
    }
    
    if (constraints.length > 0) {
      patientsQuery = query(patientsQuery, ...constraints);
    }

    const snapshot = await getDocs(patientsQuery);
    const patients = [];

    for (const docSnap of snapshot.docs) {
      const patient = { id: docSnap.id, ...docSnap.data() };
      patients.push(patient);
    }

    return patients;
  } catch (error) {
    console.error('Get patients error:', error);
    throw new Error(error.message || 'Failed to fetch patients');
  }
};

/**
 * Search patients by name, ID, phone, etc.
 * @param {string} query - search term
 * @param {Object} params - additional filters
 * @returns {Promise<Array>} matching patients
 */
export const search = async (searchQuery, params = {}) => {
  if (!searchQuery?.trim()) throw new Error('Search query is required');
  
  try {
    // Firestore doesn't support full-text search natively
    // We'll fetch all patients and filter on the client side for demo purposes
    // In production, consider using Algolia or similar service
    const allPatients = await getAll(params);
    
    const searchTerm = searchQuery.trim().toLowerCase();
    
    return allPatients.filter(patient => {
      const fullName = (patient.fullName || '').toLowerCase();
      const phone = (patient.phone || '').toLowerCase();
      const bloodGroup = (patient.bloodGroup || '').toLowerCase();
      
      return (
        fullName.includes(searchTerm) ||
        phone.includes(searchTerm) ||
        bloodGroup.includes(searchTerm)
      );
    });
  } catch (error) {
    console.error('Search patients error:', error);
    throw new Error(error.message || 'Patient search failed');
  }
};

/**
 * Get patient by ID with full nested relations
 * @param {string} id
 * @returns {Promise<Object>} patient with current_bed, appointments, prescriptions
 */
export const getById = async (id) => {
  if (!id) throw new Error('Patient ID is required');
  
  try {
    const patientDoc = await getDoc(doc(db, PATIENTS_COLLECTION, id));
    
    if (!patientDoc.exists()) {
      throw new Error('Patient not found');
    }

    const patient = { id: patientDoc.id, ...patientDoc.data() };
    
    // Fetch appointments
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('patientId', '==', id),
      orderBy('appointmentDate', 'desc')
    );
    const appointmentsSnapshot = await getDocs(appointmentsQuery);
    patient.appointments = appointmentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Fetch prescriptions
    const prescriptionsQuery = query(
      collection(db, 'prescriptions'),
      where('patientId', '==', id),
      orderBy('prescribedAt', 'desc')
    );
    const prescriptionsSnapshot = await getDocs(prescriptionsQuery);
    patient.prescriptions = prescriptionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return patient;
  } catch (error) {
    console.error('Get patient error:', error);
    throw new Error(error.message || 'Failed to fetch patient');
  }
};

/**
 * Create new patient
 * @param {Object} data - patient payload
 * @returns {Promise<Object>} created patient
 */
export const create = async (data) => {
  try {
    const patientRef = doc(collection(db, PATIENTS_COLLECTION));
    
    const newPatient = {
      fullName: data.fullName || data.full_name || '',
      dateOfBirth: data.dateOfBirth || data.date_of_birth || null,
      gender: data.gender || null,
      phone: data.phone || data.phone_number || null,
      address: data.address || null,
      bloodGroup: data.bloodGroup || data.blood_group || null,
      emergencyContact: data.emergencyContact || data.emergency_contact || {
        name: null,
        phone: null
      },
      status: data.status || 'admitted',
      admissionDate: data.admissionDate || data.admission_date || new Date().toISOString().split('T')[0],
      department: data.department || data.department_id || null,
      createdAt: Timestamp.now(),
    };

    await setDoc(patientRef, newPatient);

    return { id: patientRef.id, ...newPatient };
  } catch (error) {
    console.error('Create patient error:', error);
    throw new Error(error.message || 'Failed to create patient');
  }
};

/**
 * Update existing patient
 * @param {string} id
 * @param {Object} data - updated fields
 * @returns {Promise<Object>} updated patient
 */
export const update = async (id, data) => {
  if (!id) throw new Error('Patient ID is required');
  
  try {
    const patientRef = doc(db, PATIENTS_COLLECTION, id);
    const patientDoc = await getDoc(patientRef);
    
    if (!patientDoc.exists()) {
      throw new Error('Patient not found');
    }

    // Convert snake_case to camelCase for updates
    const updatedData = {
      ...(data.fullName && { fullName: data.fullName }),
      ...(data.full_name && { fullName: data.full_name }),
      ...(data.dateOfBirth && { dateOfBirth: data.dateOfBirth }),
      ...(data.date_of_birth && { dateOfBirth: data.date_of_birth }),
      ...(data.gender !== undefined && { gender: data.gender }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.phone_number !== undefined && { phone: data.phone_number }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.bloodGroup && { bloodGroup: data.bloodGroup }),
      ...(data.blood_group && { bloodGroup: data.blood_group }),
      ...(data.emergencyContact && { emergencyContact: data.emergencyContact }),
      ...(data.emergency_contact && { emergencyContact: data.emergency_contact }),
      ...(data.status && { status: data.status }),
      ...(data.admissionDate && { admissionDate: data.admissionDate }),
      ...(data.admission_date && { admissionDate: data.admission_date }),
      ...(data.department !== undefined && { department: data.department }),
      ...(data.department_id !== undefined && { department: data.department_id }),
    };

    await updateDoc(patientRef, updatedData);

    return { id, ...patientDoc.data(), ...updatedData };
  } catch (error) {
    console.error('Update patient error:', error);
    throw new Error(error.message || 'Failed to update patient');
  }
};

/**
 * Delete patient (soft delete or permanent)
 * @param {string} id
 * @returns {Promise<void>}
 */
export const remove = async (id) => {
  if (!id) throw new Error('Patient ID is required');
  
  try {
    const patientRef = doc(db, PATIENTS_COLLECTION, id);
    const patientDoc = await getDoc(patientRef);
    
    if (!patientDoc.exists()) {
      throw new Error('Patient not found');
    }

    // Soft delete - update status to 'deleted'
    await updateDoc(patientRef, {
      status: 'deleted',
    });

    // For hard delete, use:
    // await deleteDoc(patientRef);
  } catch (error) {
    console.error('Delete patient error:', error);
    throw new Error(error.message || 'Failed to delete patient');
  }
};

// Export as named object and default
export const patientFirebase = {
  getAll,
  search,
  getById,
  create,
  update,
  remove,
};

export default patientFirebase;
