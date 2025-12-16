// src/components/appointments/AppointmentStatusBadge.jsx
/**
 * AppointmentStatusBadge Component
 * 
 * Production-ready, reusable badge displaying appointment status with consistent
 * colors, icons, and accessibility across the entire application.
 * 
 * Used in:
 * - AppointmentList
 * - AppointmentCalendar
 * - PatientTimeline
 * - Dashboard widgets
 * 
 * Features:
 * - Matches backend status enum exactly
 * - Color-coded variants
 * - Icon + text for clarity
 * - Size variants (sm/md/lg)
 * - Fully accessible
 * - Extends unified global Badge component
 */

import React from 'react';
import { 
  Calendar,      // scheduled
  CheckCircle,   // completed
  XCircle,       // cancelled
  UserX,         // no_show
} from 'lucide-react';
import Badge from '@components/ui/badge.jsx';
import './AppointmentStatusBadge.module.scss';

/**
 * Props:
 * - status: string - exact backend value: 'scheduled', 'completed', 'cancelled', 'no_show'
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - showIcon: boolean (default: true)
 */
const AppointmentStatusBadge = ({ 
  status, 
  size = 'md', 
  showIcon = true 
}) => {
  // Centralized status configuration - single source of truth
  const statusConfig = {
    scheduled: {
      variant: 'default',
      label: 'Scheduled',
      icon: Calendar,
    },
    completed: {
      variant: 'success',
      label: 'Completed',
      icon: CheckCircle,
    },
    cancelled: {
      variant: 'destructive',
      label: 'Cancelled',
      icon: XCircle,
    },
    no_show: {
      variant: 'secondary',
      label: 'No Show',
      icon: UserX,
    },
  };

  const normalizedStatus = status?.toLowerCase();
  const config = statusConfig[normalizedStatus] || {
    variant: 'outline',
    label: 'Unknown',
    icon: Calendar,
  };

  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant} 
      size={size}
      className="appointment-status-badge"
    >
      {showIcon && (
        <Icon 
          className="badge-icon" 
          size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} 
        />
      )}
      <span className="badge-label">{config.label}</span>
      <span className="sr-only">Appointment status: {config.label}</span>
    </Badge>
  );
};

export default AppointmentStatusBadge;