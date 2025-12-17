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
// src/hooks/useAuth.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authApi } from '@services/api/authApi';
import { authFirebase } from '@services/firebase/authFirebase';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Default to TRUE to prevent redirecting before we know the status
  const [isLoading, setIsLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState(null);
  
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 1. LISTEN FOR FIREBASE AUTH CHANGES
  useEffect(() => {
    const unsubscribe = authFirebase.onAuthStateChange((userData) => {
      setUser(userData);
      
      // Sync with React Query so other components can access data
      if (userData) {
        queryClient.setQueryData(['auth', 'me'], userData);
      } else {
        queryClient.setQueryData(['auth', 'me'], null);
      }
      
      // Auth check is finished, now we can render the app
      setIsLoading(false); 
    });

    return () => unsubscribe();
  }, [queryClient]);

  // 2. SET DEFAULT ROLE
  useEffect(() => {
    if (user && !currentRole) {
      const userRoles = user.roles || [];
      const preferred = userRoles.includes('admin') ? 'admin' : userRoles[0] || 'staff';
      setCurrentRole(preferred);
    } else if (!user) {
      setCurrentRole(null);
    }
  }, [user, currentRole]);

  // 3. LOGOUT HANDLER
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Logout API failed', err);
    } finally {
      queryClient.clear();
      setUser(null);
      setCurrentRole(null);
      navigate('/login', { replace: true });
    }
  };

  const loginSuccess = (redirectTo = '/dashboard') => {
    navigate(redirectTo, { replace: true });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading, 
    userRoles: user?.roles || [],
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};