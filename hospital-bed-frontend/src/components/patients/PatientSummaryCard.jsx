// src/components/patients/PatientSummaryCard.jsx
/**
 * PatientSummaryCard Component
 * 
 * Production-ready card displaying key patient information at a glance.
 * Used in PatientDetailPage (Overview tab) and PatientList search results.
 * 
 * Features:
 * - Avatar with initials
 * - Primary demographics (name, DOB, age, gender, blood group)
 * - Current bed assignment with status badge
 * - Emergency contact info
 * - Quick stats (appointments, prescriptions count)
 * - Responsive two-column layout
 * - Unified with global Avatar, Badge, Card components
 * - Premium glassmorphic design
 */

import { format } from 'date-fns';
import { 
  User, 
  Calendar, 
  Droplet, 
  Phone, 
  BedDouble,
  AlertCircle 
} from 'lucide-react';
import Avatar from '@components/ui/avatar.jsx';
import AvatarFallback from '@components/ui/avatar-fallback.jsx';
import Badge from '@components/ui/badge.jsx';
import Card from '@components/ui/card.jsx';
import BedStatusBadge from '@components/beds/BedStatusBadge.jsx';
import './PatientSummaryCard.scss';

/**
 * Props:
 * - patient: Full patient object with optional nested current_bed, appointments, prescriptions
 */
const PatientSummaryCard = ({ patient }) => {
  if (!patient) return null;

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const age = calculateAge(patient.date_of_birth);
  const currentBed = patient.current_bed; // From API: latest active bed_assignment

  return (
    <Card className="patient-summary-card">
      <div className="summary-header">
        {/* Avatar and Name */}
        <div className="patient-identity">
          <Avatar className="patient-avatar-large">
            <div className="avatar-initial-large">
              {patient.full_name.charAt(0).toUpperCase()}
            </div>
            <AvatarFallback>
              {patient.full_name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="patient-name-section">
            <h2 className="patient-full-name">{patient.full_name}</h2>
            <p className="patient-id">ID: {patient.id.slice(0, 8)}</p>
          </div>
        </div>

        {/* Current Bed Status */}
        <div className="current-bed-section">
          {currentBed ? (
            <>
              <div className="bed-info">
                <BedDouble className="bed-icon" size={18} />
                <span className="bed-number">{currentBed.bed_number}</span>
                <span className="room-number">Room {currentBed.room_number}</span>
              </div>
              <BedStatusBadge size="md" status="occupied" />
            </>
          ) : (
            <div className="no-bed-info">
              <AlertCircle className="no-bed-icon" size={18} />
              <span>No bed assigned</span>
            </div>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="summary-grid">
        {/* Demographics */}
        <div className="demographics-section">
          <h3 className="section-title">Demographics</h3>
          <dl className="details-list">
            <div className="detail-item">
              <dt className="detail-label">
                <Calendar className="detail-icon" size={16} />
                Date of Birth
              </dt>
              <dd className="detail-value">
                {patient.date_of_birth 
                  ? format(new Date(patient.date_of_birth), 'MMM dd, yyyy')
                  : 'N/A'}
                {age !== 'N/A' && <span className="age"> ({age} years)</span>}
              </dd>
            </div>

            <div className="detail-item">
              <dt className="detail-label">
                <User className="detail-icon" size={16} />
                Gender
              </dt>
              <dd className="detail-value capitalize">{patient.gender || 'N/A'}</dd>
            </div>

            <div className="detail-item">
              <dt className="detail-label">
                <Droplet className="detail-icon" size={16} />
                Blood Group
              </dt>
              <dd className="detail-value">
                <Badge variant="secondary">
                  {patient.blood_group || 'N/A'}
                </Badge>
              </dd>
            </div>
          </dl>
        </div>

        {/* Contact & Emergency */}
        <div className="contact-section">
          <h3 className="section-title">Contact Information</h3>
          <dl className="details-list">
            <div className="detail-item">
              <dt className="detail-label">
                <Phone className="detail-icon" size={16} />
                Phone
              </dt>
              <dd className="detail-value">{patient.phone || 'N/A'}</dd>
            </div>

            <div className="detail-item emergency">
              <dt className="detail-label">
                Emergency Contact
              </dt>
              <dd className="detail-value">
                {patient.emergency_contact_name || 'None recorded'}
                {patient.emergency_contact_phone && (
                  <span className="emergency-phone">
                    {' '}( {patient.emergency_contact_phone} )
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Quick Stats (future extension) */}
      {/* <div className="quick-stats">
        <div className="stat-item">
          <span className="stat-label">Appointments</span>
          <span className="stat-value">{patient.appointments?.length || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Prescriptions</span>
          <span className="stat-value">{patient.prescriptions?.length || 0}</span>
        </div>
      </div> */}
    </Card>
  );
};

export default PatientSummaryCard;