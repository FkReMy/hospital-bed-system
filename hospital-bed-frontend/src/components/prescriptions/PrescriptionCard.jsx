// src/components/prescriptions/PrescriptionCard.jsx
/**
 * PrescriptionCard Component
 * 
 * Production-ready card displaying a single prescription with key details.
 * Used in PrescriptionList and PatientDetailPage (Prescriptions tab).
 * 
 * Features:
 * - Medication name with dosage/frequency
 * - Prescribing doctor and date
 * - Dispensed status badge
 * - Instructions preview
 * - Hover action overlay for manage/view
 * - Responsive layout with premium glassmorphic design
 * - Unified with global Card, Badge, Avatar components
 */

import React from 'react';
import { format } from 'date-fns';
import { 
  Pill, 
  Calendar, 
  Stethoscope, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Badge from '@components/ui/badge.jsx';
import Avatar from '@components/ui/avatar.jsx';
import './PrescriptionCard.scss';

/**
 * Props:
 * - prescription: Full prescription object
 *   { medication_name, dosage, frequency, duration, instructions, is_dispensed, prescribed_at, doctor }
 * - onClick: () => void - optional click handler for details/edit
 */
const PrescriptionCard = ({ prescription, onClick }) => {
  if (!prescription) return null;

  const { 
    medication_name, 
    dosage, 
    frequency, 
    duration, 
    instructions, 
    is_dispensed,
    prescribed_at,
    doctor 
  } = prescription;

  const prescribedDate = prescribed_at ? format(new Date(prescribed_at), 'MMM dd, yyyy') : 'N/A';

  return (
    <Card 
      className={`prescription-card ${onClick ? 'interactive' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`Prescription for ${medication_name}, ${is_dispensed ? 'dispensed' : 'pending'}`}
    >
      {/* Header: Medication + Dispensed Status */}
      <div className="prescriptionHeader">
        <div className="medicationInfo">
          <Pill className="medicationIcon" size={24} />
          <div className="medicationDetails">
            <h3 className="medicationName">{medication_name}</h3>
            <div className="dosageInfo">
              <span className="dosage">{dosage}</span>
              <span className="separator">•</span>
              <span className="frequency">{frequency}</span>
              {duration && (
                <>
                  <span className="separator">•</span>
                  <span className="duration">{duration}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="statusSection">
          <Badge 
            variant={is_dispensed ? 'success' : 'secondary'}
            className="dispensedBadge"
          >
            {is_dispensed ? (
              <>
                <CheckCircle className="statusIcon" size={14} />
                Dispensed
              </>
            ) : (
              <>
                <AlertCircle className="statusIcon" size={14} />
                Pending
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Body: Doctor + Date + Instructions */}
      <div className="prescriptionBody">
        {/* Doctor Info */}
        <div className="doctorInfo">
          <Avatar className="doctorAvatar">
            <div className="avatarInitial">
              {doctor?.full_name?.charAt(0).toUpperCase() || 'D'}
            </div>
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
          <div className="doctorDetails">
            <div className="doctorLabel">
              <Stethoscope className="doctorIcon" size={14} />
              Prescribed by
            </div>
            <p className="doctorName">
              Dr. {doctor?.full_name || 'Unknown Doctor'}
            </p>
          </div>
          <div className="dateInfo">
            <Calendar className="dateIcon" size={14} />
            <time className="prescribedDate">{prescribedDate}</time>
          </div>
        </div>

        {/* Instructions Preview */}
        {instructions && (
          <div className="instructionsSection">
            <p className="instructionsLabel">Instructions</p>
            <p className="instructionsText">{instructions}</p>
          </div>
        )}
      </div>

      {/* Hover Action Overlay */}
      {onClick && (
        <div className="actionOverlay">
          <span className="actionText">View Details</span>
        </div>
      )}
    </Card>
  );
};

export default PrescriptionCard;