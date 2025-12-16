// src/components/common/EmptyState.jsx
/**
 * EmptyState Component
 * 
 * Production-ready, reusable empty state display used across the entire application
 * when lists, searches, or data views return no results.
 * 
 * Features:
 * - Customizable title, description, and action button
 * - Built-in illustrations (empty-beds.svg, no-patients.svg)
 * - Optional custom illustration via src prop
 * - Consistent styling with premium glassmorphic vibe
 * - Accessible (ARIA labels, proper heading hierarchy)
 * - Unified with global Card, Button components
 * 
 * Used in:
 * - BedManagementPage, HospitalFloorMap
 * - PatientListPage, AppointmentList
 * - Dashboard widgets, reports
 */

import React from 'react';
import Button from '@components/ui/button.jsx';
import Card from '@components/ui/card.jsx';
import emptyBeds from '@assets/images/illustrations/empty-beds.svg';
import noPatients from '@assets/images/illustrations/no-patients.svg';
import './EmptyState.scss';

/**
 * Props:
 * - title: string - main message (default: "No Data Available")
 * - description: string - supporting text
 * - illustration: 'empty-beds' | 'no-patients' | string (custom src)
 * - action: { label: string, onClick: () => void } - optional action button
 * - className: string - additional classes
 */
const EmptyState = ({
  title = 'No Data Available',
  description = 'There are no items to display at the moment.',
  illustration = 'empty-beds',
  action = null,
  className = '',
}) => {
  // Map built-in illustrations
  const illustrationSrc = illustration === 'empty-beds'
    ? emptyBeds
    : illustration === 'no-patients'
    ? noPatients
    : illustration;

  return (
    <Card className={`empty-state ${className}`}>
      <div className="emptyContent">
        {/* Illustration */}
        <div className="illustrationContainer">
          <img 
            src={illustrationSrc} 
            alt="" 
            className="illustration"
            aria-hidden="true"
          />
        </div>

        {/* Text content */}
        <div className="textContent">
          <h3 className="emptyTitle">{title}</h3>
          <p className="emptyDescription">{description}</p>
        </div>

        {/* Optional action */}
        {action && (
          <div className="actionContainer">
            <Button onClick={action.onClick} size="lg">
              {action.label}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EmptyState;