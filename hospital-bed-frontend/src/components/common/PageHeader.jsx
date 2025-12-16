// src/components/common/PageHeader.jsx
/**
 * PageHeader Component
 * 
 * Production-ready, reusable page header used across all main pages
 * to provide consistent title, subtitle, breadcrumbs, and optional actions.
 * 
 * Features:
 * - Large primary title with proper heading hierarchy
 * - Optional subtitle/description
 * - Optional action slot (buttons, filters, etc.)
 * - Responsive layout with proper spacing
 * - Unified with global typography and spacing system
 * - Accessible (correct heading levels, ARIA landmarks)
 * 
 * Used in:
 * - All main pages (BedManagementPage, AppointmentManagementPage, Dashboards, etc.)
 * - Reports, Profile, Settings
 */

import React from 'react';
import './PageHeader.scss';

/**
 * Props:
 * - title: string - main page title (required)
 * - subtitle: string - supporting description
 * - children: ReactNode - optional actions (buttons, search, filters) on the right
 * - className: string - additional classes for customization
 */
const PageHeader = ({
  title,
  subtitle = null,
  children = null,
  className = '',
}) => {
  return (
    <header className={`pageHeader ${className}`} role="banner">
      <div className="headerContent">
        {/* Title and Subtitle */}
        <div className="titleSection">
          <h1 className="pageTitle">{title}</h1>
          {subtitle && (
            <p className="pageSubtitle">{subtitle}</p>
          )}
        </div>

        {/* Optional Actions */}
        {children && (
          <div className="actionsSection">
            {children}
          </div>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
