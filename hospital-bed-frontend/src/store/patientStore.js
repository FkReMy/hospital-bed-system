// src/store/patientStore.js
/**
 * patientStore.js (Deprecated)
 * 
 * This file is intentionally left as a deprecated stub.
 * 
 * The application has been fully migrated to a modern, scalable architecture using:
 * - React Query (@tanstack/react-query) for server state
 * - usePatientProfile hook for patient detail and timeline
 * - patientApi service for HTTP requests
 * - Real-time updates via notificationChannel / bedChannel (SignalR)
 * 
 * Reasons for deprecation:
 * - Global stores introduce unnecessary complexity and stale data risks
 * - React Query provides superior caching, invalidation, loading states, and optimistic updates
 * - usePatientProfile centralizes all patient logic with proper typing and error handling
 * - Patient data is server-driven — no need for client-side global store
 * 
 * DO NOT USE OR REVIVE THIS FILE - all patient state is now managed via:
 * - usePatientProfile hook (patient data, timeline, update mutation)
 * - React Query queries (automatic refetch/invalidation)
 * - patientApi for all CRUD operations
 * 
 * This file can be safely deleted once confirmed no imports remain.
 */

console.warn(
  'patientStore.js is deprecated. ' +
  'Patient data and operations are now managed via usePatientProfile hook and React Query.'
);

// Stub export to prevent runtime errors if accidentally imported
const patientStore = {
  patients: [],
  currentPatient: null,
  addPatient: () => console.warn('patientStore.addPatient() is deprecated'),
  updatePatient: () => console.warn('patientStore.updatePatient() is deprecated'),
  setCurrent: () => console.warn('patientStore.setCurrent() is deprecated'),
  searchPatients: () => console.warn('patientStore.searchPatients() is deprecated'),
};

export default patientStore;