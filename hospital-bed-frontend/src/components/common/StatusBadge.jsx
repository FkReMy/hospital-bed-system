// src/components/common/StatusBadge.jsx
/**
 * StatusBadge Component
 * 
 * Reusable status badge with the new calming healthcare color palette.
 * Used throughout the application for bed status, appointment status, patient conditions, etc.
 * 
 * Features:
 * - Pill-shaped with dynamic background/text based on status
 * - Optional pulse animation for live statuses
 * - High contrast and accessibility
 * - Color-coded for easy recognition
 * 
 * Design System Colors:
 * - Available: #22C55E (green-500)
 * - Occupied: #EF4444 (red-500)
 * - Cleaning: #F59E0B (amber-500)
 * - Maintenance: #0EA5E9 (sky-500)
 */

import React from 'react';

/**
 * Props:
 * - status: 'available' | 'occupied' | 'cleaning' | 'maintenance' | string
 * - pulse: boolean - adds pulse animation (default: false)
 * - children: ReactNode - badge content (overrides default status text)
 * - className: string - additional classes
 */
const StatusBadge = ({ 
  status, 
  pulse = false, 
  children, 
  className = '',
  ...props 
}) => {
  // Status color mapping based on healthcare color palette
  const statusStyles = {
    available: 'bg-green-50 text-green-600 border border-green-500/20',
    occupied: 'bg-red-50 text-red-600 border border-red-500/20',
    cleaning: 'bg-amber-50 text-amber-600 border border-amber-500/20',
    maintenance: 'bg-sky-50 text-sky-600 border border-sky-500/20',
    // Additional status styles
    success: 'bg-green-50 text-green-600 border border-green-500/20',
    warning: 'bg-amber-50 text-amber-600 border border-amber-500/20',
    error: 'bg-red-50 text-red-600 border border-red-500/20',
    info: 'bg-sky-50 text-sky-600 border border-sky-500/20',
    default: 'bg-gray-50 text-gray-600 border border-gray-500/20',
  };

  // Status text mapping (title case)
  const statusText = {
    available: 'Available',
    occupied: 'Occupied',
    cleaning: 'Cleaning',
    maintenance: 'Maintenance',
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
    info: 'Info',
  };

  const statusClass = statusStyles[status?.toLowerCase()] || statusStyles.default;
  const pulseClass = pulse ? 'animate-pulse' : '';
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium';

  return (
    <span 
      className={`${baseClasses} ${statusClass} ${pulseClass} ${className}`}
      role="status"
      {...props}
    >
      {children || statusText[status?.toLowerCase()] || status}
    </span>
  );
};

export default StatusBadge;
