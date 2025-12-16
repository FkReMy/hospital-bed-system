// src/store/appointmentStore.js
/**
 * appointmentStore.js (Deprecated)
 * 
 * This file is intentionally left as a deprecated stub.
 * 
 * The application has been fully migrated to a modern, scalable architecture using:
 * - React Query (@tanstack/react-query) for server state
 * - Custom hooks (useAppointmentFlow, useBedManagement, usePatientProfile)
 * - API services (appointmentApi, bedApi, patientApi)
 * - Real-time via SignalR (bedChannel, notificationChannel)
 * 
 * Reasons for deprecation:
 * - Global stores (Zustand/Pinia/Redux) introduce unnecessary complexity
 * - React Query provides better caching, invalidation, and optimistic updates
 * - Custom hooks give fine-grained control and better performance
 * - No need for client-side "store" when data comes from backend
 * 
 * DO NOT USE OR REVIVE THIS FILE - all appointment state is now managed via:
 * - useAppointmentFlow hook (wizard state)
 * - React Query queries/mutations (server data)
 * 
 * This file can be safely deleted once confirmed no imports remain.
 */

console.warn(
  'appointmentStore.js is deprecated. ' +
  'Appointment data and flow are now managed via React Query and useAppointmentFlow hook.'
);

// Stub export to prevent runtime errors if accidentally imported
const appointmentStore = {
  appointments: [],
  currentAppointment: null,
  addAppointment: () => console.warn('appointmentStore is deprecated'),
  updateAppointment: () => console.warn('appointmentStore is deprecated'),
  setCurrent: () => console.warn('appointmentStore is deprecated'),
};

export default appointmentStore;