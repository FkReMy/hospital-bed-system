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
import { authApi } from '@services/api/authApi'; // Ensure this path is correct for your project
import { authFirebase } from '@services/firebase/authFirebase'; // Import the firebase service directly
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Start loading as true to prevent premature redirects
  const [isLoading, setIsLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState(null);
  
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = authFirebase.onAuthStateChange((userData) => {
      setUser(userData);
      
      // Update React Query cache so other components can access it if needed
      if (userData) {
        queryClient.setQueryData(['auth', 'me'], userData);
      } else {
        queryClient.setQueryData(['auth', 'me'], null);
      }
      
      setIsLoading(false); // Auth check is complete
    });

    return () => unsubscribe();
  }, [queryClient]);

  // Handle Role Switching
  useEffect(() => {
    if (user && !currentRole) {
      const userRoles = user.roles || [];
      const preferred = userRoles.includes('admin') ? 'admin' : userRoles[0] || 'staff';
      setCurrentRole(preferred);
    } else if (!user) {
      setCurrentRole(null);
    }
  }, [user, currentRole]);

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
    isLoading, // This will now stay true until Firebase is ready
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