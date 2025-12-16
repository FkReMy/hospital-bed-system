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

import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Button from '@components/ui/button.jsx';
import './NotFoundPage.scss';

const NotFoundPage = () => (
    <div className="notFoundPage">
      <div className="errorContainer">
        <Card className="errorCard">
          <div className="errorIcon">
            <div className="notFoundIllustration" />
          </div>

          <div className="errorContent">
            <h1 className="errorTitle">404 - Page Not Found</h1>
            <p className="errorMessage">
              The page you are looking for might have been removed, had its name changed, 
              or is temporarily unavailable.
            </p>
            <p className="errorHelp">
              Please check the URL or return to the dashboard.
            </p>
          </div>

          <div className="errorActions">
            <Button asChild size="lg">
              <Link to="/dashboard">
                <Home className="mr-2" size={20} />
                Go to Dashboard
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline">
              <Link to="/">
                <ArrowLeft className="mr-2" size={20} />
                Back to Home
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

export default NotFoundPage;
