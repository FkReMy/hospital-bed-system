// src/store/userStore.js
/**
 * userStore.js (Deprecated)
 * 
 * This file is intentionally left as a deprecated stub.
 * 
 * The application has been fully migrated to a modern, secure, and scalable architecture using:
 * - useAuth hook with React Query for authentication state
 * - userApi service for staff user management (admin only)
 * - JWT stored in httpOnly cookie (set by .NET backend)
 * - No client-side global user store
 * - Role management via useRoleAccess and RoleSwitcher
 * 
 * Reasons for deprecation:
 * - Global stores introduce unnecessary complexity and security risks
 * - React Query + custom hooks provide better caching, loading states, and error handling
 * - httpOnly cookie auth is more secure than storing user data in memory/localStorage
 * - Staff user management is admin-only and handled via userApi + React Query
 * 
 * DO NOT USE OR REVIVE THIS FILE - all user state is now managed via:
 * - useAuth hook (current user, roles, currentRole, logout)
 * - userApi service (admin staff management)
 * - useRoleAccess (permission checks)
 * 
 * This file can be safely deleted once confirmed no imports remain.
 */

console.warn(
  'userStore.js is deprecated. ' +
  'User authentication and staff management are now handled via useAuth hook and userApi service.'
);

// Stub export to prevent runtime errors if accidentally imported
const userStore = {
  currentUser: null,
  staffUsers: [],
  login: () => console.warn('userStore.login() is deprecated'),
  logout: () => console.warn('userStore.logout() is deprecated'),
  updateUser: () => console.warn('userStore.updateUser() is deprecated'),
  setCurrentUser: () => console.warn('userStore.setCurrentUser() is deprecated'),
};

export default userStore;