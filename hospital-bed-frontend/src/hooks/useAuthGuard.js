// src/hooks/useAuthGuard.js
/**
 * useAuthGuard Hook
 * 
 * Production-ready hook that protects every private route in the HBMS application.
 * Automatically redirects unauthenticated users to login and handles role-based access.
 * 
 * Features:
 * - Checks authentication from useAuth context
 * - Redirects to /login if not authenticated
 * - Optional role check (pass allowedRoles array)
 * - Prevents flash of content during loading
 * - Works with React Router v6
 * - Unified – used in every ProtectedRoute, AdminRoute, DoctorRoute, etc.
 */

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useAuthGuard = (allowedRoles = null) => {
  const { isAuthenticated, isLoading, userRoles, currentRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. Still loading → do nothing (show LoadingState in parent)
    if (isLoading) return;

    // 2. Not logged in → redirect to login and save current path
    if (!isAuthenticated) {
      navigate('/login', { 
        replace: true,
        state: { from: location } 
      });
      return;
    }

    // 3. Role check (only if allowedRoles is provided)
    if (allowedRoles && allowedRoles.length > 0) {
      const hasRequiredRole = allowedRoles.some(role => 
        userRoles.includes(role) && currentRole === role
      );

      if (!hasRequiredRole) {
        navigate('/access-denied', { replace: true });
        return;
      }
    }

  }, [isAuthenticated, isLoading, userRoles, currentRole, navigate, location, allowedRoles]);

  // Return loading state so parent can show skeleton
  return { 
    isLoading, 
    isAuthenticated 
  };
};