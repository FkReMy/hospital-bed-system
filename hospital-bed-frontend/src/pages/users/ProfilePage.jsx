// src/pages/profile/ProfilePage.jsx
/**
 * ProfilePage Component
 * 
 * Production-ready user profile display page for HBMS staff.
 * Shows personal information, role, and account status.
 * 
 * Features:
 * - Clean, centered profile card with photo, name, role
 * - Basic user details (email, phone, join date)
 * - Role badge
 * - Edit profile and change password links
 * - Responsive layout with glassmorphic card
 * - Unified with global Card, Badge, Button components
 * - No editing - read-only view (settings on separate page)
 */

import { Link } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Shield, Edit } from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Badge from '@components/ui/badge.jsx';
import Button from '@components/ui/button.jsx';
import { useAuth } from '@hooks/useAuth';
import { formatDate } from '@lib/dateUtils';
import './ProfilePage.scss';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Card className="error-card">
        <p className="error-message">Please log in to view your profile.</p>
      </Card>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <Card className="profile-card">
          <div className="profile-header">
            <div className="profile-photo">
              <User size={80} />
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{user.full_name || 'Staff Member'}</h1>
              <Badge className="role-badge" variant="primary">
                {user.role || 'Staff'}
              </Badge>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <Mail className="detail-icon" />
              <div className="detail-text">
                <span className="detail-label">Email</span>
                <span className="detail-value">{user.email || 'N/A'}</span>
              </div>
            </div>

            <div className="detail-item">
              <Phone className="detail-icon" />
              <div className="detail-text">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{user.phone || 'N/A'}</span>
              </div>
            </div>

            <div className="detail-item">
              <Calendar className="detail-icon" />
              <div className="detail-text">
                <span className="detail-label">Joined</span>
                <span className="detail-value">
                  {formatDate(user.created_at || new Date())}
                </span>
              </div>
            </div>

            <div className="detail-item">
              <Shield className="detail-icon" />
              <div className="detail-text">
                <span className="detail-label">Role</span>
                <span className="detail-value">{user.role || 'Staff'}</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <Button asChild variant="primary">
              <Link to="/profile/settings">
                <Edit className="mr-2" size={18} />
                Edit Profile
              </Link>
            </Button>
          </div>
        </Card>

        <div className="page-footer">
          <p>Hospital Bed Management System</p>
          <p>For authorized staff only</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;