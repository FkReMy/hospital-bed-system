// src/router/ReceptionRoute.jsx
/**
 * ReceptionRoute Component
 * 
 * Production-ready protected route that allows access ONLY to users with 'reception' role.
 * 
 * Features:
 * - Uses useAuthGuard hook for unified, secure role checking
 * - Automatic redirect to /access-denied if not reception
 * - Shows loading state during auth check
 * - Prevents flash of protected content
 * - Fully integrated with your auth system and routing
 * - Zero boilerplate - just wrap your reception-only pages
 */

import { useAuthGuard } from '@hooks/useAuthGuard';
import LoadingState from '@components/common/LoadingState';

const ReceptionRoute = ({ children }) => {
  // Enforce reception-only access with automatic redirect
  const { isLoading } = useAuthGuard(['reception'], true);

  // Show clean loading state while checking auth/role
  if (isLoading) {
    return <LoadingState count={1} type="full" />;
  }

  // If not reception → already redirected by useAuthGuard
  // If reception → render children
  return <>{children}</>;
};

export default ReceptionRoute;