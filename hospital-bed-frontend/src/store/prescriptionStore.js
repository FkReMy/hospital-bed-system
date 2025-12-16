// src/store/prescriptionStore.js
/**
 * prescriptionStore.js (Deprecated)
 * 
 * This file is intentionally left as a deprecated stub.
 * 
 * The application has been fully migrated to a modern, scalable architecture using:
 * - React Query (@tanstack/react-query) for server state
 * - prescriptionApi service for HTTP requests
 * - PatientDetailPage / PrescriptionList components fetch data via React Query
 * - Real-time updates via notificationChannel (SignalR) when needed
 * 
 * Reasons for deprecation:
 * - Global stores introduce unnecessary complexity and stale data risks
 * - React Query provides superior caching, invalidation, loading states, and optimistic updates
 * - Prescription data is server-driven and patient-specific — no need for global client store
 * - All prescription operations are handled via prescriptionApi mutations
 * 
 * DO NOT USE OR REVIVE THIS FILE - all prescription state is now managed via:
 * - prescriptionApi (getAll, getByPatient, create, update, dispense)
 * - React Query queries in relevant components
 * - Patient profile cache integration
 * 
 * This file can be safely deleted once confirmed no imports remain.
 */

console.warn(
  'prescriptionStore.js is deprecated. ' +
  'Prescription data and operations are now managed via prescriptionApi and React Query.'
);

// Stub export to prevent runtime errors if accidentally imported
const prescriptionStore = {
  prescriptions: [],
  currentPrescription: null,
  addPrescription: () => console.warn('prescriptionStore.addPrescription() is deprecated'),
  updatePrescription: () => console.warn('prescriptionStore.updatePrescription() is deprecated'),
  dispensePrescription: () => console.warn('prescriptionStore.dispensePrescription() is deprecated'),
  setCurrent: () => console.warn('prescriptionStore.setCurrent() is deprecated'),
};

export default prescriptionStore;