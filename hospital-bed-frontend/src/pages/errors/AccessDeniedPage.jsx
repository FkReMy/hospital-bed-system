// src/pages/errors/AccessDeniedPage.jsx
/**
 * AccessDeniedPage Component
 * 
 * Production-ready access denied error page for HBMS.
 * Displayed when a user attempts to access a resource without proper role permissions.
 * 
 * Features:
 * - Clear, professional error message
 * - Role-based context explanation
 * - Action buttons: Return to dashboard or logout
 * - Responsive centered layout with glassmorphic card
 * - Unified with global Card, Button components
 * - Premium error illustration
 * - Secure: No sensitive data exposure
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home, LogOut } from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Button from '@components/ui/button.jsx';
import { useAuth } from '@hooks/useAuth';
import './AccessDeniedPage.scss';

const AccessDeniedPage = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="accessDeniedPage">
      <div className="errorContainer">
        <Card className="errorCard">
          <div className="errorIcon">
            <Shield size={80} className="shieldIcon" />
          </div>

          <div className="errorContent">
            <h1 className="errorTitle">Access Denied</h1>
            <p className="errorMessage">
              You do not have permission to view this page.
            </p>
            {user && (
              <p className="roleInfo">
                Current role: <strong>{user.current_role || user.role}</strong>
              </p>
            )}
            <p className="errorHelp">
              Please contact your administrator if you believe this is an error.
            </p>
          </div>

          <div className="errorActions">
            <Button asChild size="lg">
              <Link to="/dashboard">
                <Home className="mr2" size={20} />
                Return to Dashboard
              </Link>
            </Button>

            <Button variant="outline" size="lg" onClick={handleLogout}>
              <LogOut className="mr2" size={20} />
              Logout
            </Button>
          </div>
        </Card>

        <div className="pageFooter">
          <p>Hospital Bed Management System</p>
          <p>For authorized personnel only</p>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;