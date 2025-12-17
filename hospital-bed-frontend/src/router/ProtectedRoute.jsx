// src/router/ProtectedRoute.jsx
/**
 * ProtectedRoute Component
 * 
 * Production-ready wrapper that protects all authenticated routes in the HBMS application.
 * 
 * Features:
 * - Allows access ONLY to authenticated users (any role)
 * - Uses useAuthGuard hook for unified, secure authentication checking
 * - Automatic redirect to /login if not authenticated
 * - Preserves intended destination (location.state.from)
 * - Shows loading state during auth check
 * - Prevents flash of protected content
 * - Fully integrated with your auth system and routing
 * - Zero boilerplate - wraps the main dashboard layout and all private routes
 */

import { Outlet } from 'react-router-dom';
import { useAuthGuard } from '@hooks/useAuthGuard';
import LoadingState from '@components/common/LoadingState';
import AppShell from '@components/layout/AppShell';

const ProtectedRoute = () => {
  // Enforce authentication with automatic redirect
  const { isLoading } = useAuthGuard([], true);

  // Show clean loading state while checking authentication
  if (isLoading) {
    return <LoadingState count={1} type="full" />;
  }

  // If not authenticated → already redirected by useAuthGuard
  // If authenticated → render AppShell with nested routes via Outlet
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};

export default ProtectedRoute;