// src/router/NurseRoute.jsx
/**
 * NurseRoute Component
 * 
 * Production-ready protected route that allows access ONLY to users with 'nurse' role.
 * 
 * Features:
 * - Uses useAuthGuard hook for unified, secure role checking
 * - Automatic redirect to /access-denied if not nurse
 * - Shows loading state during auth check
 * - Prevents flash of protected content
 * - Fully integrated with your auth system and routing
 * - Zero boilerplate - just wrap your nurse-only pages
 */

import React from 'react';
import { useAuthGuard } from '@hooks/useAuthGuard';
import LoadingState from '@components/common/LoadingState';

const NurseRoute = ({ children }) => {
  // Enforce nurse-only access with automatic redirect
  const { isLoading } = useAuthGuard(['nurse'], true);

  // Show clean loading state while checking auth/role
  if (isLoading) {
    return <LoadingState type="full" count={1} />;
  }

  // If not nurse → already redirected by useAuthGuard
  // If nurse → render children
  return <>{children}</>;
};

export default NurseRoute;