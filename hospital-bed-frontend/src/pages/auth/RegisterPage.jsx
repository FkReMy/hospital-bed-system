// src/pages/auth/RegisterPage.jsx
/**
 * RegisterPage Component
 * 
 * Production-ready staff registration page for HBMS (admin-only creation recommended).
 * 
 * IMPORTANT: In production hospital systems, staff accounts are typically created by administrators,
 * not via public self-registration. This page is included for completeness but should be
 * protected by AdminRoute in production.
 * 
 * Features:
 * - Full staff registration form (name, email, phone, role, password)
 * - Form validation with toast feedback
 * - Loading state on submit
 * - Success redirect to login
 * - Responsive glassmorphic card layout
 * - Unified with global Card, Input, Button, Select components
 * - Secure password handling
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Shield,
  ArrowLeft 
} from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Input from '@components/ui/input.jsx';
import Button from '@components/ui/button.jsx';
import { useMutation } from '@tanstack/react-query';
import { userApi } from '@services/api/userApi';
import toast from 'react-hot-toast';
import { ROLES } from '@lib/constants';
import './RegisterPage.scss';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: ROLES.DOCTOR, // default
    password: '',
    confirmPassword: '',
  });

  const registerMutation = useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      toast.success('Staff account created successfully. Please log in.');
      // Redirect to login after success
      window.location.href = '/login';
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create account');
    },
  });

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.full_name.trim()) {
      toast.error('Full name is required');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Phone is required');
      return;
    }
    if (!formData.password) {
      toast.error('Password is required');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Submit
    registerMutation.mutate({
      full_name: formData.full_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: formData.role,
      password: formData.password,
    });
  };

  return (
    <div className="registerPage">
      <div className="registerContainer">
        <Card className="registerCard">
          <div className="registerHeader">
            <Link to="/login" className="backLink">
              <ArrowLeft size={20} />
              Back to Login
            </Link>
            <h1 className="registerTitle">Create Staff Account</h1>
            <p className="registerSubtitle">
              Register new hospital staff member
            </p>
          </div>

          <form onSubmit={handleSubmit} className="registerForm">
            <div className="formGroup">
              <Input
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleChange('full_name')}
                leftIcon={User}
                disabled={registerMutation.isPending}
              />
            </div>

            <div className="formGroup">
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange('email')}
                leftIcon={Mail}
                disabled={registerMutation.isPending}
              />
            </div>

            <div className="formGroup">
              <Input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange('phone')}
                leftIcon={Phone}
                disabled={registerMutation.isPending}
              />
            </div>

            <div className="formGroup">
              <select
                value={formData.role}
                onChange={handleChange('role')}
                className="roleSelect"
                disabled={registerMutation.isPending}
              >
                <option value={ROLES.DOCTOR}>Doctor</option>
                <option value={ROLES.NURSE}>Nurse</option>
                <option value={ROLES.RECEPTION}>Reception</option>
                <option value={ROLES.ADMIN}>Administrator</option>
              </select>
            </div>

            <div className="formGroup">
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange('password')}
                leftIcon={Lock}
                disabled={registerMutation.isPending}
              />
            </div>

            <div className="formGroup">
              <Input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                leftIcon={Lock}
                disabled={registerMutation.isPending}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="registerButton"
              isLoading={registerMutation.isPending}
              disabled={registerMutation.isPending}
            >
              <Shield className="mr-2" />
              Create Account
            </Button>
          </form>

          <div className="registerFooter">
            <p className="note">
              Staff accounts should be created by administrators only.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
