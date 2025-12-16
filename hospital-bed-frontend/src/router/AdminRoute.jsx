// src/router/AdminRoute.jsx
/**
 * AdminRoute Component
 * 
 * Production-ready protected route that allows access ONLY to users with 'admin' role.
 * 
 * Features:
 * - Uses useAuthGuard hook for unified, secure role checking
 * - Automatic redirect to /access-denied if not admin
 * - Shows loading state during auth check
 * - Prevents flash of protected content
 * - Fully integrated with your auth system and routing
 * - Zero boilerplate - just wrap your admin pages
 */

import { useAuthGuard } from '@hooks/useAuthGuard';
import LoadingState from '@components/common/LoadingState';

const AdminRoute = ({ children }) => {
  // Enforce admin-only access with automatic redirect
  const { isLoading } = useAuthGuard(['admin'], true);

  // Show clean loading state while checking auth/role
  if (isLoading) {
    return <LoadingState count={1} type="full" />;
  }

  // If not admin → already redirected by useAuthGuard
  // If admin → render children
  return <>{children}</>;
};

export default AdminRoute;