// src/pages/auth/ChangePasswordPage.jsx
/**
 * ChangePasswordPage Component
 * 
 * Forces users to change their password on first login or after admin reset.
 * 
 * Features:
 * - Validates password strength
 * - Confirms password match
 * - Updates Firebase Auth password
 * - Clears mustChangePassword flag in Firestore
 * - Redirects to dashboard after successful change
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle } from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Input from '@components/ui/input.jsx';
import Button from '@components/ui/button.jsx';
import { useMutation } from '@tanstack/react-query';
import { updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@services/firebase/firebaseConfig';
import { useAuth } from '@hooks/useAuth';
import toast from 'react-hot-toast';
import './LoginPage.scss';

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*)');
    }
    
    return errors;
  };

  const changePasswordMutation = useMutation({
    mutationFn: async ({ newPassword }) => {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      // Update password in Firebase Auth
      await updatePassword(currentUser, newPassword);

      // Clear mustChangePassword flag in Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        mustChangePassword: false,
        updated_at: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
      navigate('/dashboard', { replace: true });
    },
    onError: (error) => {
      console.error('Password change error:', error);
      
      if (error.code === 'auth/requires-recent-login') {
        toast.error('Please log out and log in again before changing your password');
      } else {
        toast.error(error.message || 'Failed to change password');
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = {};
    
    // Validate new password
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      validationErrors.newPassword = passwordErrors[0];
    }
    
    // Validate password match
    if (newPassword !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate new password is different from current
    if (currentPassword && newPassword === currentPassword) {
      validationErrors.newPassword = 'New password must be different from current password';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    changePasswordMutation.mutate({ newPassword });
  };

  return (
    <div className="loginPage">
      <div className="loginContainer">
        <Card className="loginCard">
          <div className="loginHeader">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-yellow-100 p-3">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <h1 className="loginTitle">Change Password Required</h1>
            <p className="loginSubtitle">
              You must change your password before continuing
            </p>
          </div>

          <form className="loginForm" onSubmit={handleSubmit}>
            <div className="formGroup">
              <Input
                aria-label="New Password"
                disabled={changePasswordMutation.isPending}
                error={errors.newPassword}
                leftIcon={Lock}
                placeholder="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setErrors({ ...errors, newPassword: undefined });
                }}
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
              )}
            </div>

            <div className="formGroup">
              <Input
                aria-label="Confirm Password"
                disabled={changePasswordMutation.isPending}
                error={errors.confirmPassword}
                leftIcon={Lock}
                placeholder="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors({ ...errors, confirmPassword: undefined });
                }}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="mb-4 rounded-md bg-blue-50 p-3">
              <p className="text-sm text-blue-800 font-medium mb-2">
                Password Requirements:
              </p>
              <ul className="list-disc list-inside text-xs text-blue-700 space-y-1">
                <li>At least 8 characters long</li>
                <li>Contains uppercase and lowercase letters</li>
                <li>Contains at least one number</li>
                <li>Contains at least one special character (!@#$%^&*)</li>
              </ul>
            </div>

            <Button
              className="loginButton"
              disabled={changePasswordMutation.isPending}
              isLoading={changePasswordMutation.isPending}
              size="lg"
              type="submit"
            >
              Change Password
            </Button>
          </form>
        </Card>

        <div className="pageFooter">
          <p>© 2025 Hospital Bed Management System</p>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
