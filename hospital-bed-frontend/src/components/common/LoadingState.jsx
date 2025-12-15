// src/components/common/LoadingState.jsx
/**
 * LoadingState Component
 * 
 * Production-ready, reusable loading state display used across the application
 * when data is being fetched (tables, charts, cards, pages).
 * 
 * Features:
 * - Configurable number of skeleton items (rows, cards, etc.)
 * - Supports different layouts: table rows, grid cards, or custom
 * - Unified with global Skeleton component
 * - Accessible (ARIA live region for screen readers)
 * - Consistent with premium glassmorphic design system
 * 
 * Used in:
 * - BedManagementPage, HospitalFloorMap
 * - AppointmentList, PatientList
 * - Dashboard widgets, reports
 */

import React from 'react';
import Skeleton from '@components/ui/skeleton.jsx';
import Card from '@components/ui/card.jsx';
import './LoadingState.module.scss';

/**
 * Props:
 * - count: number - how many skeleton items to show (default: 5)
 * - type: 'table' | 'grid' | 'card' | 'full' (default: 'table')
 * - height: string - skeleton height (default: 'h-12' for table, 'h-32' for card)
 * - className: string - additional classes
 */
const LoadingState = ({
  count = 5,
  type = 'table',
  height,
  className = '',
}) => {
  // Default heights per type
  const defaultHeight = {
    table: 'h-12',
    grid: 'h-32',
    card: 'h-32',
    full: 'h-64',
  }[type];

  const skeletonHeight = height || defaultHeight;

  // Render skeleton items based on type
  const renderSkeletons = () => {
    return Array.from({ length: count }, (_, i) => (
      <Skeleton key={i} className={`loading-skeleton ${skeletonHeight}`} />
    ));
  };

  // Layout wrappers
  if (type === 'table') {
    return (
      <div className={`loading-state table ${className}`} role="status" aria-live="polite">
        <div className="table-skeletons">
          {renderSkeletons()}
        </div>
      </div>
    );
  }

  if (type === 'grid' || type === 'card') {
    return (
      <div className={`loading-state grid ${className}`} role="status" aria-live="polite">
        <div className="grid-skeletons">
          {renderSkeletons()}
        </div>
      </div>
    );
  }

  if (type === 'full') {
    return (
      <Card className={`loading-state full ${className}`} role="status" aria-live="polite">
        <div className="full-skeleton-container">
          {renderSkeletons()}
        </div>
      </Card>
    );
  }

  // Fallback: simple vertical stack
  return (
    <div className={`loading-state ${className}`} role="status" aria-live="polite">
      {renderSkeletons()}
    </div>
  );
};

export default LoadingState;