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

import Skeleton from '@components/ui/skeleton.jsx';
import Card from '@components/ui/card.jsx';
import './LoadingState.scss';

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
  const renderSkeletons = () => Array.from({ length: count }, (_, i) => (
      <Skeleton className={`loadingSkeleton ${skeletonHeight}`} key={i} />
    ));

  // Layout wrappers
  if (type === 'table') {
    return (
      <div aria-live="polite" className={`loadingState table ${className}`} role="status">
        <div className="tableSkeletons">
          {renderSkeletons()}
        </div>
      </div>
    );
  }

  if (type === 'grid' || type === 'card') {
    return (
      <div aria-live="polite" className={`loadingState grid ${className}`} role="status">
        <div className="gridSkeletons">
          {renderSkeletons()}
        </div>
      </div>
    );
  }

  if (type === 'full') {
    return (
      <Card aria-live="polite" className={`loadingState full ${className}`} role="status">
        <div className="fullSkeletonContainer">
          {renderSkeletons()}
        </div>
      </Card>
    );
  }

  // Fallback: simple vertical stack
  return (
    <div aria-live="polite" className={`loadingState ${className}`} role="status">
      {renderSkeletons()}
    </div>
  );
};

export default LoadingState;
