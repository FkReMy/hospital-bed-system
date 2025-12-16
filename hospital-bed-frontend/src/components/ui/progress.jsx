// src/components/ui/progress.jsx
/**
 * Progress Component
 * 
 * Production-ready, reusable progress bar for upload progress, loading indicators,
 * and occupancy rates in the HBMS application.
 * 
 * Features:
 * - Value from 0-100
 * - Size variants (sm/md/lg)
 * - Variant colors: primary, success, destructive
 * - Striped and animated variants
 * - Accessible (ARIA attributes, role="progressbar")
 * - Premium glassmorphic design with smooth fill animation
 * - Unified with other form/UI components
 */

import './progress.scss';

/**
 * Props:
 * - value: number - progress value (0-100)
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - variant: 'primary' | 'success' | 'destructive' (default: 'primary')
 * - striped: boolean - striped fill
 * - animated: boolean - animated stripes
 * - className: string
 */
const Progress = ({
  value = 0,
  size = 'md',
  variant = 'primary',
  striped = false,
  animated = false,
  className = '',
  ...props
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div 
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={clampedValue}
      className={`progress ${size} ${variant} ${striped ? 'striped' : ''} ${animated ? 'animated' : ''} ${className}`}
      role="progressbar"
      {...props}
    >
      <div 
        className="progress-fill"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
};

export default Progress;