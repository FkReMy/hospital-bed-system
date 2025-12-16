// src/pages/profile/ProfileSettingsPage.jsx
/**
 * ProfileSettingsPage Component
 * 
 * Production-ready user profile settings page for HBMS staff.
 * Allows viewing and editing personal information, password change,
 * and notification preferences.
 * 
 * Features:
 * - Profile information display and edit
 * - Password change form with validation
 * - Notification preferences (email, in-app)
 * - Secure password change (no current password required - uses backend auth)
 * - Loading and success/error states
 * - Unified with global Card, Input, Button, Switch components
 * - Responsive layout
 */

import { useState } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import { userApi } from '@services/api/userApi';
import toast from 'react-hot-toast';
import Card from '@components/ui/card.jsx';
import Input from '@components/ui/input.jsx';
import Button from '@components/ui/button.jsx';
import Switch from '@components/ui/switch.jsx';
import './ProfileSettingsPage.scss';

const ProfileSettingsPage = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    notifications: {
      email: true,
      inApp: true,
    },
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => userApi.update(user?.id, data),
    onSuccess: () => {
      toast.success('Profile updated successfully');
      updateUser({ ...user, ...formData });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data) => userApi.resetPassword(user?.id, data.newPassword),
    onSuccess: () => {
      toast.success('Password changed successfully');
      setPasswordData({ newPassword: '', confirmPassword: '' });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to change password');
    },
  });

  const handleProfileChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleNotificationToggle = (type) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  const handlePasswordChange = (field) => (e) => {
    setPasswordData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    changePasswordMutation.mutate({ newPassword: passwordData.newPassword });
  };

  return (
    <div className="profile-settings-page">
      <div className="page-header">
        <h1 className="page-title">Profile Settings</h1>
        <p className="page-subtitle">Manage your personal information and preferences</p>
      </div>

      <div className="settings-grid">
        {/* Profile Information */}
        <Card className="profile-card">
          <h2 className="section-title">Personal Information</h2>
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <Input
                value={formData.full_name}
                onChange={handleProfileChange('full_name')}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={handleProfileChange('email')}
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={handleProfileChange('phone')}
              />
            </div>

            <div className="form-actions">
              <Button isLoading={updateProfileMutation.isPending} type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Password Change */}
        <Card className="password-card">
          <h2 className="section-title">Change Password</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label>New Password</label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange('newPassword')}
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange('confirmPassword')}
              />
            </div>

            <div className="form-actions">
              <Button isLoading={changePasswordMutation.isPending} type="submit">
                Update Password
              </Button>
            </div>
          </form>
        </Card>

        {/* Notification Preferences */}
        <Card className="notifications-card">
          <h2 className="section-title">Notification Preferences</h2>
          <div className="notification-options">
            <div className="option">
              <Switch
                checked={formData.notifications.email}
                onCheckedChange={() => handleNotificationToggle('email')}
              />
              <div className="option-label">
                <span>Email Notifications</span>
                <span className="option-description">Receive important updates via email</span>
              </div>
            </div>

            <div className="option">
              <Switch
                checked={formData.notifications.inApp}
                onCheckedChange={() => handleNotificationToggle('inApp')}
              />
              <div className="option-label">
                <span>In-App Notifications</span>
                <span className="option-description">Show notifications in the dashboard</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Button onClick={() => updateProfileMutation.mutate({ notifications: formData.notifications })}>
              Save Notification Preferences
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;