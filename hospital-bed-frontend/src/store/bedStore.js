// src/store/bedStore.js
/**
 * bedStore.js (Deprecated)
 * 
 * This file is intentionally left as a deprecated stub.
 * 
 * The application has been fully migrated to a modern, scalable architecture using:
 * - React Query (@tanstack/react-query) for server state
 * - useBedManagement hook for all bed data and operations
 * - bedApi service for HTTP requests
 * - Real-time updates via bedChannel (SignalR)
 * 
 * Reasons for deprecation:
 * - Global stores introduce unnecessary complexity and stale data risks
 * - React Query provides superior caching, invalidation, loading states, and optimistic updates
 * - useBedManagement centralizes all bed logic with proper typing and error handling
 * - Real-time via SignalR channels eliminates need for manual store updates
 * 
 * DO NOT USE OR REVIVE THIS FILE - all bed state is now managed via:
 * - useBedManagement hook (beds, departments, assign/discharge mutations)
 * - React Query queries (automatic refetch/invalidation)
 * - bedChannel for real-time updates
 * 
 * This file can be safely deleted once confirmed no imports remain.
 */

console.warn(
  'bedStore.js is deprecated. ' +
  'Bed data and operations are now managed via useBedManagement hook and React Query.'
);

// Stub export to prevent runtime errors if accidentally imported
const bedStore = {
  beds: [],
  selectedBed: null,
  addBed: () => console.warn('bedStore.addBed() is deprecated'),
  updateBed: () => console.warn('bedStore.updateBed() is deprecated'),
  assignBed: () => console.warn('bedStore.assignBed() is deprecated'),
  dischargeBed: () => console.warn('bedStore.dischargeBed() is deprecated'),
  setSelected: () => console.warn('bedStore.setSelected() is deprecated'),
};

export default bedStore;