// src/pages/auth/LoginPage.jsx
/**
 * LoginPage Component
 * 
 * Production-ready login page for HBMS staff authentication.
 * 
 * Features:
 * - Clean, centered login form with glassmorphic card
 * - Email and password fields with validation
 * - Remember me checkbox
 * - Login button with loading state
 * - Error message display
 * - "Forgot password" link
 * - Responsive design
 * - Multilingual ready (English/Arabic toggle)
 * - Unified with global Card, Input, Button, Badge components
 * - Secure: uses authApi.login with httpOnly cookie
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Globe } from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Input from '@components/ui/input.jsx';
import Button from '@components/ui/button.jsx';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@services/api/authApi';
import { useAuth } from '@hooks/useAuth';
import toast from 'react-hot-toast';
import './LoginPage.scss';

const LoginPage = () => {
  const { loginSuccess, user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (userData) => {
      toast.success('Login successful');
      // Set flag to indicate we're in the process of logging in
      // Navigation will happen once auth state is fully updated
      setIsLoggingIn(true);
    },
    onError: (error) => {
      toast.error(error.message || 'Invalid credentials');
      setIsLoggingIn(false);
    },
  });

  // Wait for Firebase auth state to propagate to AuthContext before navigation
  // This ensures all three conditions are met:
  // 1. Login API succeeded (isLoggingIn is true)
  // 2. User is authenticated (isAuthenticated is true)
  // 3. User data is loaded (user is not null)
  useEffect(() => {
    if (isLoggingIn && isAuthenticated && user) {
      // Direct redirect to role-specific dashboard
      const roleRouteMap = {
        'admin': '/dashboard/admin',
        'doctor': '/dashboard/doctor',
        'nurse': '/dashboard/nurse',
        'staff': '/dashboard/reception',
        'reception': '/dashboard/reception',
      };
      
      const targetRoute = roleRouteMap[user.role?.toLowerCase()] || '/dashboard';
      loginSuccess(targetRoute);
      setIsLoggingIn(false); // Reset to prevent re-navigation
    }
  }, [isLoggingIn, isAuthenticated, user, loginSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password) {
      toast.error('Please enter email and password');
      return;
    }

    loginMutation.mutate({ email: email.trim(), password });
  };

  return (
    <div className="loginPage">
      <div className="loginContainer">
        <Card className="loginCard">
          <div className="loginHeader">
            <h1 className="loginTitle">HBMS Login</h1>
            <p className="loginSubtitle">Hospital Bed Management System</p>
          </div>

          <form className="loginForm" onSubmit={handleSubmit}>
            <div className="formGroup">
              <Input
                aria-label="Email address"
                disabled={loginMutation.isPending}
                leftIcon={Mail}
                placeholder="staff@hospital.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="formGroup">
              <Input
                aria-label="Password"
                disabled={loginMutation.isPending}
                leftIcon={Lock}
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="formOptions">
              <label className="rememberMe">
                <input
                  checked={rememberMe}
                  disabled={loginMutation.isPending}
                  type="checkbox"
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <Link className="forgotLink" to="/forgot-password">
                Forgot password?
              </Link>
            </div>

            <Button
              className="loginButton"
              disabled={loginMutation.isPending}
              isLoading={loginMutation.isPending}
              size="lg"
              type="submit"
            >
              Sign In
            </Button>
          </form>

          <div className="loginFooter">
            <Button className="languageToggle" size="sm" variant="ghost">
              <Globe className="mr-2" size={16} />
              العربية
            </Button>
          </div>
        </Card>

        <div className="pageFooter">
          <p>© 2025 Hospital Bed Management System</p>
          <p>For authorized staff only</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
