// src/services/firebase/bedAssignmentValidation.js
/**
 * Shared validation utilities for bed assignments
 * 
 * Provides centralized validation logic to ensure consistency
 * across bedFirebase and bedAssignmentFirebase services.
 */

import { 
  doc, 
  getDoc, 
  getDocs,
  collection,
  query, 
  where 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const BEDS_COLLECTION = 'beds';
const PATIENTS_COLLECTION = 'patients';
const BED_ASSIGNMENTS_COLLECTION = 'bedAssignments';

/**
 * Validates a bed assignment before creation
 * @param {string} bedId - The bed ID
 * @param {string} patientId - The patient ID
 * @returns {Promise<{bed: Object, patient: Object}>} Validated bed and patient data
 * @throws {Error} If validation fails
 */
export const validateBedAssignment = async (bedId, patientId) => {
  if (!bedId || !patientId) {
    throw new Error('Both bed ID and patient ID are required');
  }

  // Validate bed exists and is available
  const bedRef = doc(db, BEDS_COLLECTION, bedId);
  const bedDoc = await getDoc(bedRef);
  
  if (!bedDoc.exists()) {
    throw new Error('Bed not found');
  }
  
  const bedData = bedDoc.data();
  
  if (bedData.isOccupied) {
    throw new Error('Bed is already occupied');
  }

  // Validate patient exists
  const patientRef = doc(db, PATIENTS_COLLECTION, patientId);
  const patientDoc = await getDoc(patientRef);
  
  if (!patientDoc.exists()) {
    throw new Error('Patient not found');
  }
  
  const patientData = patientDoc.data();

  // Check if patient is already assigned to another bed
  // Note: For optimal performance with large datasets, consider adding a compound index
  // in Firestore on (patientId, dischargedAt) for this query
  const existingAssignmentsQuery = query(
    collection(db, BED_ASSIGNMENTS_COLLECTION),
    where('patientId', '==', patientId),
    where('dischargedAt', '==', null)
  );
  
  const existingAssignments = await getDocs(existingAssignmentsQuery);
  
  if (!existingAssignments.empty) {
    throw new Error('Patient is already assigned to another bed');
  }

  // Validate department matching
  const patientDepartment = patientData.department;
  const bedDepartment = bedData.departmentId;
  
  if (patientDepartment && bedDepartment && patientDepartment !== bedDepartment) {
    throw new Error('Patient department does not match bed department');
  }

  return {
    bed: { id: bedDoc.id, ...bedData },
    patient: { id: patientDoc.id, ...patientData }
  };
};

export default {
  validateBedAssignment
};
