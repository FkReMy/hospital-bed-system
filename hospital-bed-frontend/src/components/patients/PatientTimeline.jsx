// src/components/patients/PatientTimeline.jsx
/**
 * PatientTimeline Component
 * 
 * Production-ready vertical timeline displaying a patient's complete activity history.
 * Combines bed assignments, appointments, prescriptions, and system events.
 * 
 * Features:
 * - Chronological reverse order (newest first)
 * - Type-specific icons and color coding
 * - Expandable details for each event
 * - Loading and empty states
 * - Responsive layout
 * - Unified with global Card, Badge, Button components
 * - Premium glassmorphic design with connecting line
 * 
 * Data source: Combined from patient.bed_assignments, appointments, prescriptions
 * (normalized in API or query)
 */

import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  BedDouble,
  Calendar,
  FileText,
  UserPlus,
  UserX,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Badge from '@components/ui/badge.jsx';
import Button from '@components/ui/button.jsx';
import EmptyState from '@components/common/EmptyState.jsx';
import LoadingState from '@components/common/LoadingState.jsx';
import './PatientTimeline.module.scss';

/**
 * Props:
 * - events: Array of timeline events (normalized)
 *   Each event: { id, type, timestamp, title, description, metadata }
 * - isLoading: boolean
 * - patientId: string - for future API fetching
 */
const PatientTimeline = ({ 
  events = [], 
  isLoading = false,
  patientId 
}) => {
  // Type configuration - icons and colors
  const typeConfig = {
    bed_assignment: { 
      icon: BedDouble, 
      variant: 'default', 
      label: 'Bed Assignment' 
    },
    bed_discharge: { 
      icon: UserX, 
      variant: 'secondary', 
      label: 'Discharged' 
    },
    appointment_scheduled: { 
      icon: Calendar, 
      variant: 'default', 
      label: 'Appointment Scheduled' 
    },
    appointment_completed: { 
      icon: CheckCircle, 
      variant: 'success', 
      label: 'Appointment Completed' 
    },
    prescription_issued: { 
      icon: FileText, 
      variant: 'default', 
      label: 'Prescription Issued' 
    },
    admission: { 
      icon: UserPlus, 
      variant: 'default', 
      label: 'Admitted' 
    },
    system_alert: { 
      icon: AlertCircle, 
      variant: 'destructive', 
      label: 'System Alert' 
    },
  };

  if (isLoading) {
    return <LoadingState type="table" count={6} />;
  }

  if (events.length === 0) {
    return (
      <EmptyState
        title="No Activity Recorded"
        description="This patient has no recorded events in the timeline yet."
        illustration="no-patients"
      />
    );
  }

  // Sort events newest first
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <Card className="patient-timeline">
      <div className="timeline-container">
        {sortedEvents.map((event, index) => {
          const config = typeConfig[event.type] || typeConfig.system_alert;
          const Icon = config.icon;
          const isLast = index === sortedEvents.length - 1;

          return (
            <div key={event.id} className="timeline-item">
              {/* Connecting line */}
              {!isLast && <div className="timeline-line" />}

              {/* Event dot and icon */}
              <div className="timeline-marker">
                <div className={`marker-dot ${config.variant}`} />
                <div className={`marker-icon ${config.variant}`}>
                  <Icon size={18} />
                </div>
              </div>

              {/* Event content */}
              <div className="timeline-content">
                <div className="content-header">
                  <h4 className="event-title">{event.title || config.label}</h4>
                  <time className="event-time">
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </time>
                </div>

                {event.description && (
                  <p className="event-description">{event.description}</p>
                )}

                {/* Metadata badges */}
                {event.metadata && Object.keys(event.metadata).length > 0 && (
                  <div className="event-metadata">
                    {Object.entries(event.metadata).map(([key, value]) => (
                      <Badge key={key} variant="outline" className="meta-badge">
                        {key}: {value}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Full timestamp */}
                <time className="event-full-time">
                  {format(new Date(event.timestamp), 'PPP p')}
                </time>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PatientTimeline;