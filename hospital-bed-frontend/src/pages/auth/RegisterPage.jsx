// src/pages/auth/RegisterPage.jsx
/**
 * RegisterPage Component
 * 
 * Production-ready patient registration page for HBMS.
 * 
 * This page allows patients to self-register and create their own accounts.
 * Staff accounts should be created by administrators through the admin panel.
 * 
 * Features:
 * - Patient registration form (name, email, phone, password)
 * - Patient role is automatically assigned
 * - Form validation with toast feedback
 * - Loading state on submit
 * - Success redirect to login
 * - Responsive glassmorphic card layout
 * - Unified with global Card, Input, Button components
 * - Secure password handling
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Shield,
  ArrowLeft 
} from 'lucide-react';
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
    role: ROLES.PATIENT, // Always patient role for self-registration
    password: '',
    confirmPassword: '',
  });

  const registerMutation = useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      toast.success('Patient account created successfully. Please log in.');
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Decorative blurred orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-green-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-glass-lg rounded-2xl p-8">
          <div className="mb-6">
            <Link className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors" to="/login">
              <ArrowLeft size={20} />
              Back to Login
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Patient Account</h1>
            <p className="text-lg text-gray-600">
              Register as a new patient
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Input
                disabled={registerMutation.isPending}
                leftIcon={User}
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleChange('full_name')}
              />
            </div>

            <div>
              <Input
                disabled={registerMutation.isPending}
                leftIcon={Mail}
                placeholder="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
              />
            </div>

            <div>
              <Input
                disabled={registerMutation.isPending}
                leftIcon={Phone}
                placeholder="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={handleChange('phone')}
              />
            </div>

            <div>
              <Input
                disabled={registerMutation.isPending}
                leftIcon={Lock}
                placeholder="Password"
                type="password"
                value={formData.password}
                onChange={handleChange('password')}
              />
            </div>

            <div>
              <Input
                disabled={registerMutation.isPending}
                leftIcon={Lock}
                placeholder="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
              />
            </div>

            <Button
              className="w-full"
              disabled={registerMutation.isPending}
              isLoading={registerMutation.isPending}
              size="lg"
              type="submit"
            >
              <Shield className="mr-2" />
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account? <Link className="text-blue-600 hover:text-blue-700 font-medium" to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
