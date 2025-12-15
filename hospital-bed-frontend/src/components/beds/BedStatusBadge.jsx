// src/components/beds/BedStatusBadge.jsx
/**
 * BedStatusBadge Component
 * 
 * Production-ready, reusable badge displaying bed status with consistent
 * colors, icons, pulse animation (for available), and accessibility.
 * 
 * Used across the application in:
 * - BedCard
 * - BedManagementPage
 * - HospitalFloorMap
 * - Dashboard widgets
 * - AssignBedDialog
 * 
 * Features:
 * - Exact match to bed status values from backend/database
 * - Color-coded variants with glowing pulse for available beds
 * - Icon + text for instant recognition
 * - Size variants (sm/md/lg)
 * - Fully accessible
 * - Extends unified global Badge component
 */

import React from 'react';
import { 
  BedDouble,      // available
  User,           // occupied
  Wrench,         // maintenance
  Clock,          // cleaning (temporary/reserved)
} from 'lucide-react';
import Badge from '@components/ui/badge.jsx';
import './BedStatusBadge.module.scss';

/**
 * Props:
 * - status: string - exact backend value: 'available', 'occupied', 'cleaning', 'maintenance'
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - showIcon: boolean (default: true)
 * - pulse: boolean (default: true for 'available' only)
 */
const BedStatusBadge = ({ 
  status, 
  size = 'md', 
  showIcon = true,
  pulse: propPulse 
}) => {
  // Centralized status configuration - single source of truth
  const statusConfig = {
    available: {
      variant: 'success',
      label: 'Available',
      icon: BedDouble,
      pulse: true,
    },
    occupied: {
      variant: 'default', // neutral for occupied (can be changed to 'warning' if preferred)
      label: 'Occupied',
      icon: User,
      pulse: false,
    },
    cleaning: {
      variant: 'secondary',
      label: 'Cleaning',
      icon: Clock,
      pulse: false,
    },
    maintenance: {
      variant: 'destructive',
      label: 'Maintenance',
      icon: Wrench,
      pulse: false,
    },
  };

  const normalizedStatus = status?.toLowerCase();
  const config = statusConfig[normalizedStatus] || {
    variant: 'outline',
    label: 'Unknown',
    icon: BedDouble,
    pulse: false,
  };

  const Icon = config.icon;
  const shouldPulse = propPulse !== undefined ? propPulse : config.pulse;

  return (
    <Badge 
      variant={config.variant} 
      size={size}
      className={`bed-status-badge ${shouldPulse ? 'pulse' : ''}`}
    >
      {showIcon && (
        <Icon 
          className="badge-icon" 
          size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} 
        />
      )}
      <span className="badge-label">{config.label}</span>
      <span className="sr-only">Bed status: {config.label}</span>
    </Badge>
  );
};

export default BedStatusBadge;