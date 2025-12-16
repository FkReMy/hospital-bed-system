// src/components/ui/badge.jsx
/**
 * Badge Component
 * 
 * Production-ready, reusable badge for status, tags, and metadata.
 * Used throughout the application for bed status, appointment status,
 * prescription dispensed, blood group, gender, etc.
 * 
 * Features:
 * - Variant system: default, success, destructive, secondary, outline
 * - Size variants: sm/md/lg
 * - Optional icon slot
 * - High contrast and accessibility
 * - Premium glassmorphic design with subtle elevation
 * - Unified across all domain-specific badges (BedStatusBadge, AppointmentStatusBadge)
 */

import './badge.scss';

/**
 * Props:
 * - variant: 'default' | 'success' | 'destructive' | 'secondary' | 'outline' (default: 'default')
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - children: ReactNode - badge content (text, icon + text)
 * - className: string - additional classes
 */
const Badge = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  ...props
}) => (
    <span 
      className={`badge ${variant} ${size} ${className}`}
      role="status"
      {...props}
    >
      {children}
    </span>
  );

export default Badge;