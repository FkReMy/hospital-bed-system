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

import React from 'react';
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
      <Card className="errorCard">
        <p className="errorMessage">Please log in to view your profile.</p>
      </Card>
    );
  }

  return (
    <div className="profilePage">
      <div className="profileContainer">
        <Card className="profileCard">
          <div className="profileHeader">
            <div className="profilePhoto">
              <User size={80} />
            </div>
            <div className="profileInfo">
              <h1 className="profileName">{user.full_name || 'Staff Member'}</h1>
              <Badge variant="primary" className="roleBadge">
                {user.role || 'Staff'}
              </Badge>
            </div>
          </div>

          <div className="profileDetails">
            <div className="detailItem">
              <Mail className="detailIcon" />
              <div className="detailText">
                <span className="detailLabel">Email</span>
                <span className="detailValue">{user.email || 'N/A'}</span>
              </div>
            </div>

            <div className="detailItem">
              <Phone className="detailIcon" />
              <div className="detailText">
                <span className="detailLabel">Phone</span>
                <span className="detailValue">{user.phone || 'N/A'}</span>
              </div>
            </div>

            <div className="detailItem">
              <Calendar className="detailIcon" />
              <div className="detailText">
                <span className="detailLabel">Joined</span>
                <span className="detailValue">
                  {formatDate(user.created_at || new Date())}
                </span>
              </div>
            </div>

            <div className="detailItem">
              <Shield className="detailIcon" />
              <div className="detailText">
                <span className="detailLabel">Role</span>
                <span className="detailValue">{user.role || 'Staff'}</span>
              </div>
            </div>
          </div>

          <div className="profileActions">
            <Button asChild variant="primary">
              <Link to="/profile/settings">
                <Edit className="mr2" size={18} />
                Edit Profile
              </Link>
            </Button>
          </div>
        </Card>

        <div className="pageFooter">
          <p>Hospital Bed Management System</p>
          <p>For authorized staff only</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;