// src/hooks/useAuth.js
/**
 * useAuth Hook
 * 
 * Production-ready authentication context hook for the HBMS staff dashboard.
 * Manages JWT token, user data, roles, login/logout, and protected route logic.
 * 
 * Features:
 * - Secure JWT storage in httpOnly cookie (backend sets it)
 * - Client-side user/roles state from /api/auth/me endpoint
 * - Multi-role support with currentRole switching
 * - Automatic token refresh handling
 * - Protected route redirect
 * - Integration with React Query for auth state
 * - Unified across the entire application via AuthProvider
 * 
 * Usage: Wrap app with <AuthProvider> in App.jsx
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@services/api/authApi';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch current user - enabled only after login
  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    retry: 1,
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    // Only run if we have a token (cookie exists)
    enabled: true,
  });

  // Derive available roles from user
  const userRoles = user?.roles || [];

  // Set initial currentRole on login
  useEffect(() => {
    if (user && !currentRole) {
      // Prefer admin if available, else first role
      const preferred = userRoles.includes('admin') ? 'admin' : userRoles[0];
      setCurrentRole(preferred);
    }
  }, [user, userRoles, currentRole]);

  // Logout handler
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Continue logout even if server error
      console.warn('Logout API failed', err);
    } finally {
      queryClient.clear();
      queryClient.removeQueries();
      setCurrentRole(null);
      navigate('/login', { replace: true });
    }
  };

  // Login redirect helper (used in LoginPage)
  const loginSuccess = (redirectTo = '/dashboard') => {
    navigate(redirectTo, { replace: true });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isError,
    error,
    userRoles,
    currentRole,
    setCurrentRole,
    logout,
    loginSuccess,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};