// src/pages/errors/NotFoundPage.jsx
/**
 * NotFoundPage Component
 * 
 * Production-ready 404 error page for HBMS.
 * Displayed when a user navigates to a non-existent route.
 * 
 * Features:
 * - Clear, professional "Page Not Found" message
 * - Helpful guidance and action buttons
 * - Responsive centered layout with glassmorphic card
 * - Unified with global Card, Button components
 * - Premium 404 illustration
 * - Secure: No sensitive data exposure
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Button from '@components/ui/button.jsx';
import './NotFoundPage.module.scss';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="error-container">
        <Card className="error-card">
          <div className="error-icon">
            <div className="not-found-illustration" />
          </div>

          <div className="error-content">
            <h1 className="error-title">404 - Page Not Found</h1>
            <p className="error-message">
              The page you are looking for might have been removed, had its name changed, 
              or is temporarily unavailable.
            </p>
            <p className="error-help">
              Please check the URL or return to the dashboard.
            </p>
          </div>

          <div className="error-actions">
            <Button asChild size="lg">
              <Link to="/dashboard">
                <Home className="mr-2" size={20} />
                Go to Dashboard
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link to="/">
                <ArrowLeft className="mr-2" size={20} />
                Back to Home
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

export default NotFoundPage;