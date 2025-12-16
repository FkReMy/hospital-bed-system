// src/components/appointments/AppointmentStatusBadge.jsx
/**
 * AppointmentStatusBadge Component
 * 
 * Production-ready, reusable badge displaying appointment status with
 * consistent colors, icons, and accessibility across the entire application.
 * 
 * Used in:
 * - AppointmentList
 * - AppointmentCalendar
 * - Dashboard widgets
 * - Patient timeline
 * 
 * Features:
 * - Matches backend status enum exactly
 * - Color-coded variants with pulse animation for active states
 * - Icon + text for clarity
 * - Accessible (ARIA labels, contrast)
 * - Unified with global Badge component (extends base Badge)
 */

import React from 'react';
import { 
  Calendar,     // scheduled
  CheckCircle,  // completed
  XCircle,      // cancelled
  UserX,        // no_show
} from 'lucide-react';
import Badge from '@components/ui/badge.jsx';
import './AppointmentStatusBadge.scss';

/**
 * Props:
 * - status: string (exact match to backend: 'scheduled', 'completed', 'cancelled', 'no_show')
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
      variant: 'default',     // neutral blue/gray
      label: 'Scheduled',
      icon: Calendar,
      pulse: true,            // subtle pulse for upcoming
    },
    completed: {
      variant: 'success',
      label: 'Completed',
      icon: CheckCircle,
      pulse: false,
    },
    cancelled: {
      variant: 'destructive',
      label: 'Cancelled',
      icon: XCircle,
      pulse: false,
    },
    no_show: {
      variant: 'secondary',
      label: 'No Show',
      icon: UserX,
      pulse: false,
    },
  };

  const config = statusConfig[status?.toLowerCase()] || {
    variant: 'outline',
    label: 'Unknown',
    icon: Calendar,
    pulse: false,
  };

  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant} 
      size={size}
      className={`appointment-status-badge ${config.pulse ? 'pulse' : ''}`}
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