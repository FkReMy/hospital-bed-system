// src/pages/profile/ProfileSettingsPage.jsx
/**
 * ProfileSettingsPage Component
 * 
 * Production-ready user profile settings page for HBMS staff.
 * Allows viewing and editing personal information, password change,
 * notification preferences, and theme settings.
 * 
 * Features:
 * - Profile information display and edit
 * - Password change form with validation
 * - Notification preferences (email, in-app)
 * - Theme selection (light/dark/system)
 * - Secure password change (no current password required - uses backend auth)
 * - Loading and success/error states
 * - Unified with global Card, Input, Button, Switch components
 * - Responsive layout
 */

import React, { useState } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import { userApi } from '@services/api/userApi';
import toast from 'react-hot-toast';
import Card from '@components/ui/card.jsx';
import Input from '@components/ui/input.jsx';
import Button from '@components/ui/button.jsx';
import Switch from '@components/ui/switch.jsx';
import { useTheme } from '@hooks/useTheme';
import './ProfileSettingsPage.scss';

const ProfileSettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();

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
    <div className="profileSettingsPage">
      <div className="pageHeader">
        <h1 className="pageTitle">Profile Settings</h1>
        <p className="pageSubtitle">Manage your personal information and preferences</p>
      </div>

      <div className="settingsGrid">
        {/* Profile Information */}
        <Card className="profileCard">
          <h2 className="sectionTitle">Personal Information</h2>
          <form onSubmit={handleProfileSubmit}>
            <div className="formGroup">
              <label>Full Name</label>
              <Input
                value={formData.full_name}
                onChange={handleProfileChange('full_name')}
              />
            </div>

            <div className="formGroup">
              <label>Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={handleProfileChange('email')}
              />
            </div>

            <div className="formGroup">
              <label>Phone Number</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={handleProfileChange('phone')}
              />
            </div>

            <div className="formActions">
              <Button type="submit" isLoading={updateProfileMutation.isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Password Change */}
        <Card className="passwordCard">
          <h2 className="sectionTitle">Change Password</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className="formGroup">
              <label>New Password</label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange('newPassword')}
              />
            </div>

            <div className="formGroup">
              <label>Confirm New Password</label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange('confirmPassword')}
              />
            </div>

            <div className="formActions">
              <Button type="submit" isLoading={changePasswordMutation.isPending}>
                Update Password
              </Button>
            </div>
          </form>
        </Card>

        {/* Notification Preferences */}
        <Card className="notificationsCard">
          <h2 className="sectionTitle">Notification Preferences</h2>
          <div className="notificationOptions">
            <div className="option">
              <Switch
                checked={formData.notifications.email}
                onCheckedChange={() => handleNotificationToggle('email')}
              />
              <div className="optionLabel">
                <span>Email Notifications</span>
                <span className="optionDescription">Receive important updates via email</span>
              </div>
            </div>

            <div className="option">
              <Switch
                checked={formData.notifications.inApp}
                onCheckedChange={() => handleNotificationToggle('inApp')}
              />
              <div className="optionLabel">
                <span>In-App Notifications</span>
                <span className="optionDescription">Show notifications in the dashboard</span>
              </div>
            </div>
          </div>

          <div className="formActions">
            <Button onClick={() => updateProfileMutation.mutate({ notifications: formData.notifications })}>
              Save Notification Preferences
            </Button>
          </div>
        </Card>

        {/* Theme Settings */}
        <Card className="themeCard">
          <h2 className="sectionTitle">Theme Settings</h2>
          <div className="themeOptions">
            {['light', 'dark', 'system'].map(option => (
              <Button
                key={option}
                variant={theme === option ? 'primary' : 'outline'}
                onClick={() => setTheme(option)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;