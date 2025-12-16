// src/hooks/useRoleAccess.js
/**
 * useRoleAccess Hook
 * 
 * Production-ready custom hook for role-based access control in components.
 * Provides simple boolean checks and redirect logic for protected features.
 * 
 * Features:
 * - Checks if current role is in allowed list
 * - Optional redirect on denied access
 * - Returns hasAccess boolean for conditional rendering
 * - Integrates with useAuth (currentRole, userRoles)
 * - No side effects unless redirect option enabled
 * - Unified across the application for consistent RBAC
 * 
 * Usage:
 * - Conditional rendering: if (!hasAccess) return null;
 * - Route protection: useRoleAccess(['admin'], true) // auto redirect
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useRoleAccess = (allowedRoles = [], redirectOnDeny = false) => {
  const { currentRole, userRoles, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Determine access
  const hasAccess = isAuthenticated && 
    allowedRoles.length > 0 && 
    allowedRoles.includes(currentRole);

  // Optional auto-redirect on denied access
  useEffect(() => {
    if (isLoading) return; // Wait for auth load

    if (redirectOnDeny && isAuthenticated && !hasAccess) {
      navigate('/access-denied', { replace: true });
    }

    if (redirectOnDeny && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, hasAccess, redirectOnDeny, navigate]);

  return {
    hasAccess,
    isLoading,
    currentRole,
    userRoles,
  };
};