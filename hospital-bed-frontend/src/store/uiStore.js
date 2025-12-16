// src/store/uiStore.js
/**
 * uiStore.js (Deprecated)
 * 
 * This file is intentionally left as a deprecated stub.
 * 
 * The application has been fully migrated to a modern, scalable architecture using:
 * - React Context + custom hooks for UI state (useTheme, useNotificationFeed)
 * - Local component state for transient UI (sidebar open, dialog open)
 * - React Query for server-driven UI (loading, errors)
 * - No global mutable UI store needed
 * 
 * Reasons for deprecation:
 * - Global UI stores (Zustand/Redux) add unnecessary complexity for simple state
 * - useTheme hook handles theme with persistence and system sync
 * - Sidebar collapse persisted in localStorage or component state
 * - Dialogs/modals managed by parent state
 * - Notifications via useNotificationFeed + React Query
 * - Better performance, predictability, and debugging without global store
 * 
 * DO NOT USE OR REVIVE THIS FILE - all UI state is now managed via:
 * - useTheme hook (theme)
 * - Local state in AppShell (sidebar open/close)
 * - Component props/state for dialogs, toasts, loading
 * 
 * This file can be safely deleted once confirmed no imports remain.
 */

console.warn(
  'uiStore.js is deprecated. ' +
  'UI state is now managed via useTheme hook, local component state, and React Query.'
);

// Stub export to prevent runtime errors if accidentally imported
const uiStore = {
  sidebarOpen: true,
  theme: 'system',
  toggleSidebar: () => console.warn('uiStore.toggleSidebar() is deprecated'),
  setTheme: () => console.warn('uiStore.setTheme() is deprecated'),
  showToast: () => console.warn('uiStore.showToast() is deprecated'),
};

export default uiStore;