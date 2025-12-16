// src/router/DoctorRoute.jsx
/**
 * DoctorRoute Component
 * 
 * Production-ready protected route that allows access ONLY to users with 'doctor' role.
 * 
 * Features:
 * - Uses useAuthGuard hook for unified, secure role checking
 * - Automatic redirect to /access-denied if not doctor
 * - Shows loading state during auth check
 * - Prevents flash of protected content
 * - Fully integrated with your auth system and routing
 * - Zero boilerplate - just wrap your doctor-only pages
 */

import { useAuthGuard } from '@hooks/useAuthGuard';
import LoadingState from '@components/common/LoadingState';

const DoctorRoute = ({ children }) => {
  // Enforce doctor-only access with automatic redirect
  const { isLoading } = useAuthGuard(['doctor'], true);

  // Show clean loading state while checking auth/role
  if (isLoading) {
    return <LoadingState count={1} type="full" />;
  }

  // If not doctor → already redirected by useAuthGuard
  // If doctor → render children
  return <>{children}</>;
};

export default DoctorRoute;