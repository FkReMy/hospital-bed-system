// src/router/DashboardRedirect.jsx
/**
 * DashboardRedirect Component
 * 
 * Automatically redirects users from /dashboard to their role-specific dashboard:
 * - admin → /dashboard/admin
 * - doctor → /dashboard/doctor
 * - nurse → /dashboard/nurse
 * - reception → /dashboard/reception
 * - default → /dashboard/admin (fallback)
 * 
 * This component ensures users land on the correct dashboard based on their role.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import LoadingState from '@components/common/LoadingState';

const DashboardRedirect = () => {
  const navigate = useNavigate();
  const { user, currentRole, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      // Determine the dashboard route based on currentRole
      const role = currentRole || (user.roles && user.roles[0]) || 'admin';
      
      // Map roles to their dashboard routes
      const dashboardRoutes = {
        admin: '/dashboard/admin',
        doctor: '/dashboard/doctor',
        nurse: '/dashboard/nurse',
        reception: '/dashboard/reception',
      };

      // Redirect to the appropriate dashboard
      const targetRoute = dashboardRoutes[role] || '/dashboard/admin';
      navigate(targetRoute, { replace: true });
    }
  }, [user, currentRole, isLoading, navigate]);

  // Show loading state while determining role
  return <LoadingState count={1} type="full" />;
};

export default DashboardRedirect;
