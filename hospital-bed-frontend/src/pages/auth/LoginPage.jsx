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

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Globe } from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Input from '@components/ui/input.jsx';
import Button from '@components/ui/button.jsx';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@services/api/authApi';
import { useAuth } from '@hooks/useAuth';
import toast from 'react-hot-toast';
import './LoginPage.module.scss';

const LoginPage = () => {
  const { loginSuccess } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      toast.success('Login successful');
      loginSuccess('/dashboard');
    },
    onError: (error) => {
      toast.error(error.message || 'Invalid credentials');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password) {
      toast.error('Please enter email and password');
      return;
    }

    loginMutation.mutate({ email: email.trim(), password });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <Card className="login-card">
          <div className="login-header">
            <h1 className="login-title">HBMS Login</h1>
            <p className="login-subtitle">Hospital Bed Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <Input
                type="email"
                placeholder="staff@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={Mail}
                disabled={loginMutation.isPending}
                aria-label="Email address"
              />
            </div>

            <div className="form-group">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={Lock}
                disabled={loginMutation.isPending}
                aria-label="Password"
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loginMutation.isPending}
                />
                <span>Remember me</span>
              </label>

              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              className="login-button"
              isLoading={loginMutation.isPending}
              disabled={loginMutation.isPending}
            >
              Sign In
            </Button>
          </form>

          <div className="login-footer">
            <Button variant="ghost" size="sm" className="language-toggle">
              <Globe className="mr-2" size={16} />
              العربية
            </Button>
          </div>
        </Card>

        <div className="page-footer">
          <p>© 2025 Hospital Bed Management System</p>
          <p>For authorized staff only</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;