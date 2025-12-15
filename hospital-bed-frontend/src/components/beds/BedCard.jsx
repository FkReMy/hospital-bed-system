// src/components/beds/BedCard.jsx
/**
 * BedCard Component
 * 
 * Production-ready, reusable card displaying a single bed with its current status,
 * assigned patient (if any), and quick action trigger.
 * 
 * Used in:
 * - BedManagementPage (grid view)
 * - HospitalFloorMap (visual layout)
 * - Dashboard widgets
 * 
 * Features:
 * - Glassmorphic elevation with hover lift
 * - Status indicator dot with ring
 * - Patient details when occupied
 * - Empty state when available/cleaning/maintenance
 * - Clickable to open AssignBedDialog or view details
 * - Fully accessible and responsive
 * - Unified with global Card, Badge, Avatar, Button components
 */

import React from 'react';
import { BedDouble, User, AlertCircle } from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Badge from '@components/ui/badge.jsx';
import Avatar from '@components/ui/avatar.jsx';
import BedStatusBadge from '@components/beds/BedStatusBadge.jsx';
import './BedCard.module.scss';

/**
 * Props:
 * - bed: Full bed object (id, bed_number, room_number, status, patient, department)
 * - onClick: () => void - opens dialog or detail view
 * - showDepartment: boolean (default: false) - show department badge
 */
const BedCard = ({ 
  bed, 
  onClick, 
  showDepartment = false 
}) => {
  if (!bed) return null;

  const { bed_number, status, patient } = bed;

  // Determine if bed is interactive (only available beds can be assigned)
  const isInteractive = status === 'available';

  return (
    <Card
      className={`bed-card ${isInteractive ? 'interactive' : ''} ${status}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Bed ${bed_number}, status: ${status}${patient ? `, occupied by ${patient.full_name}` : ''}`}
    >
      {/* Header: Bed number + status indicator */}
      <div className="bed-header">
        <div className="bed-number-container">
          <span className="bed-number">{bed_number}</span>
          {showDepartment && bed.department && (
            <Badge variant="outline" className="department-badge">
              {bed.department.name}
            </Badge>
          )}
        </div>

        {/* Status indicator ring + dot */}
        <div className={`status-indicator ${status}`}>
          <div className="status-dot" />
        </div>

        {/* Global status badge */}
        <BedStatusBadge status={status} size="sm" />
      </div>

      {/* Body: Patient or empty state */}
      <div className="bed-body">
        {status === 'occupied' && patient ? (
          <div className="patient-info">
            <Avatar className="patient-avatar">
              <div className="avatar-initial">
                {patient.full_name.charAt(0).toUpperCase()}
              </div>
              <AvatarFallback>{patient.full_name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="patient-details">
              <p className="patient-name">{patient.full_name}</p>
              <div className="patient-meta">
                <Badge variant="secondary" className="meta-badge">
                  {patient.blood_group || 'N/A'}
                </Badge>
                <Badge variant="secondary" className="meta-badge">
                  {patient.gender || 'N/A'}
                </Badge>
              </div>
              {patient.condition && (
                <p className="patient-condition">{patient.condition}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <BedDouble className="empty-bed-icon" size={40} strokeWidth={1.5} />
            <p className="empty-status capitalize">{status.replace('_', ' ')}</p>
            {status === 'maintenance' && (
              <AlertCircle className="warning-icon" size={16} />
            )}
          </div>
        )}
      </div>

      {/* Hover/Action Overlay */}
      <div className="action-overlay">
        <span className="action-text">
          {status === 'available' ? 'Assign Patient' : 
           status === 'occupied' ? 'Manage Bed' : 
           'View Details'}
        </span>
      </div>
    </Card>
  );
};

export default BedCard;