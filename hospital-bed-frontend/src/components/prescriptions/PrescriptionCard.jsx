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
import AvatarFallback from '@components/ui/avatar-fallback.jsx';
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
      aria-label={`Prescription for ${medication_name}, ${is_dispensed ? 'dispensed' : 'pending'}`}
      className={`prescription-card ${onClick ? 'interactive' : ''}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
    >
      {/* Header: Medication + Dispensed Status */}
      <div className="prescription-header">
        <div className="medication-info">
          <Pill className="medication-icon" size={24} />
          <div className="medication-details">
            <h3 className="medication-name">{medication_name}</h3>
            <div className="dosage-info">
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

        <div className="status-section">
          <Badge 
            className="dispensed-badge"
            variant={is_dispensed ? 'success' : 'secondary'}
          >
            {is_dispensed ? (
              <>
                <CheckCircle className="status-icon" size={14} />
                Dispensed
              </>
            ) : (
              <>
                <AlertCircle className="status-icon" size={14} />
                Pending
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Body: Doctor + Date + Instructions */}
      <div className="prescription-body">
        {/* Doctor Info */}
        <div className="doctor-info">
          <Avatar className="doctor-avatar">
            <div className="avatar-initial">
              {doctor?.full_name?.charAt(0).toUpperCase() || 'D'}
            </div>
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
          <div className="doctor-details">
            <div className="doctor-label">
              <Stethoscope className="doctor-icon" size={14} />
              Prescribed by
            </div>
            <p className="doctor-name">
              Dr. {doctor?.full_name || 'Unknown Doctor'}
            </p>
          </div>
          <div className="date-info">
            <Calendar className="date-icon" size={14} />
            <time className="prescribed-date">{prescribedDate}</time>
          </div>
        </div>

        {/* Instructions Preview */}
        {instructions && (
          <div className="instructions-section">
            <p className="instructions-label">Instructions</p>
            <p className="instructions-text">{instructions}</p>
          </div>
        )}
      </div>

      {/* Hover Action Overlay */}
      {onClick && (
        <div className="action-overlay">
          <span className="action-text">View Details</span>
        </div>
      )}
    </Card>
  );
};

export default PrescriptionCard;