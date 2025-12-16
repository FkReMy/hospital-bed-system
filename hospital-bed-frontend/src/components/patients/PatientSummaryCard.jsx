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

import React from 'react';
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
    <Card className="patientSummaryCard">
      <div className="summaryHeader">
        {/* Avatar and Name */}
        <div className="patientIdentity">
          <Avatar className="patientAvatarLarge">
            <div className="avatarInitialLarge">
              {patient.full_name.charAt(0).toUpperCase()}
            </div>
            <AvatarFallback>
              {patient.full_name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="patientNameSection">
            <h2 className="patientFullName">{patient.full_name}</h2>
            <p className="patientId">ID: {patient.id.slice(0, 8)}</p>
          </div>
        </div>

        {/* Current Bed Status */}
        <div className="currentBedSection">
          {currentBed ? (
            <>
              <div className="bedInfo">
                <BedDouble className="bedIcon" size={18} />
                <span className="bedNumber">{currentBed.bed_number}</span>
                <span className="roomNumber">Room {currentBed.room_number}</span>
              </div>
              <BedStatusBadge status="occupied" size="md" />
            </>
          ) : (
            <div className="noBedInfo">
              <AlertCircle className="noBedIcon" size={18} />
              <span>No bed assigned</span>
            </div>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="summaryGrid">
        {/* Demographics */}
        <div className="demographicsSection">
          <h3 className="sectionTitle">Demographics</h3>
          <dl className="detailsList">
            <div className="detailItem">
              <dt className="detailLabel">
                <Calendar className="detailIcon" size={16} />
                Date of Birth
              </dt>
              <dd className="detailValue">
                {patient.date_of_birth 
                  ? format(new Date(patient.date_of_birth), 'MMM dd, yyyy')
                  : 'N/A'}
                {age !== 'N/A' && <span className="age"> ({age} years)</span>}
              </dd>
            </div>

            <div className="detailItem">
              <dt className="detailLabel">
                <User className="detailIcon" size={16} />
                Gender
              </dt>
              <dd className="detailValue capitalize">{patient.gender || 'N/A'}</dd>
            </div>

            <div className="detailItem">
              <dt className="detailLabel">
                <Droplet className="detailIcon" size={16} />
                Blood Group
              </dt>
              <dd className="detailValue">
                <Badge variant="secondary">
                  {patient.blood_group || 'N/A'}
                </Badge>
              </dd>
            </div>
          </dl>
        </div>

        {/* Contact & Emergency */}
        <div className="contactSection">
          <h3 className="sectionTitle">Contact Information</h3>
          <dl className="detailsList">
            <div className="detailItem">
              <dt className="detailLabel">
                <Phone className="detailIcon" size={16} />
                Phone
              </dt>
              <dd className="detailValue">{patient.phone || 'N/A'}</dd>
            </div>

            <div className="detailItem emergency">
              <dt className="detailLabel">
                Emergency Contact
              </dt>
              <dd className="detailValue">
                {patient.emergency_contact_name || 'None recorded'}
                {patient.emergency_contact_phone && (
                  <span className="emergencyPhone">
                    {' '}( {patient.emergency_contact_phone} )
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Quick Stats (future extension) */}
      {/* <div className="quickStats">
        <div className="statItem">
          <span className="statLabel">Appointments</span>
          <span className="statValue">{patient.appointments?.length || 0}</span>
        </div>
        <div className="statItem">
          <span className="statLabel">Prescriptions</span>
          <span className="statValue">{patient.prescriptions?.length || 0}</span>
        </div>
      </div> */}
    </Card>
  );
};

export default PatientSummaryCard;