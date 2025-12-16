// src/store/authStore.js
/**
 * authStore.js (Deprecated)
 * 
 * This file is intentionally left as a deprecated stub.
 * 
 * The application has been fully migrated to a modern, secure, and scalable authentication architecture using:
 * - useAuth hook with React Query for server state
 * - JWT stored in httpOnly cookie (set by .NET backend)
 * - No client-side token storage
 * - Real user data fetched from /api/auth/me
 * - Role switching via currentRole state in useAuth
 * - Protected routes via useAuthGuard
 * 
 * Reasons for deprecation:
 * - Global stores introduce unnecessary complexity and security risks
 * - React Query + custom hooks provide better caching, loading states, and error handling
 * - httpOnly cookie auth is more secure than storing tokens in memory/localStorage
 * - Multi-role support is now handled cleanly in useAuth
 * 
 * DO NOT USE OR REVIVE THIS FILE - all authentication state is now managed via:
 * - useAuth hook (user, roles, currentRole, logout)
 * - useAuthGuard (route protection)
 * - useRoleAccess (component-level access)
 * 
 * This file can be safely deleted once confirmed no imports remain.
 */

console.warn(
  'authStore.js is deprecated. ' +
  'Authentication is now managed via useAuth hook with React Query and httpOnly JWT cookies.'
);

// Stub export to prevent runtime errors if accidentally imported
const authStore = {
  user: null,
  token: null,
  roles: [],
  login: () => console.warn('authStore.login() is deprecated'),
  logout: () => console.warn('authStore.logout() is deprecated'),
  setUser: () => console.warn('authStore.setUser() is deprecated'),
  hasRole: () => console.warn('authStore.hasRole() is deprecated'),
};

export default authStore;