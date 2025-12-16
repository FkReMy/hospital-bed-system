// src/pages/patients/PatientDetailPage.jsx
/**
 * PatientDetailPage Component
 * 
 * Production-ready detailed patient profile page.
 * Displays comprehensive patient information, current bed assignment, medical history,
 * appointments, prescriptions, and timeline.
 * 
 * Features:
 * - Patient summary card with key info and status
 * - Tabbed interface for different sections
 * - Current bed assignment with discharge option
 * - Recent appointments and prescriptions
 * - Activity timeline
 * - Real-time updates via SignalR (bedChannel, notificationChannel)
 * - Loading and error states
 * - Unified with global Card, Badge, Button, Tabs, Table components
 */

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, 
  BedDouble, 
  Calendar, 
  Pill, 
  Clock,
  Edit,
  Download
} from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Badge from '@components/ui/badge.jsx';
import Button from '@components/ui/button.jsx';
import Tabs from '@components/ui/tabs.jsx';
import Table from '@components/ui/table.jsx';
import LoadingState from '@components/common/LoadingState.jsx';
import EmptyState from '@components/common/EmptyState.jsx';
import PatientSummaryCard from '@components/patients/PatientSummaryCard.jsx';
import { usePatientProfile } from '@hooks/usePatientProfile';
import { useBedManagement } from '@hooks/useBedManagement';
import { formatDateTime } from '@lib/dateUtils';
import './PatientDetailPage.module.scss';

const PatientDetailPage = () => {
  const { patientId } = useParams();
  const { patient, timelineEvents, isLoadingPatient, isLoadingTimeline } = usePatientProfile(patientId);
  const { beds } = useBedManagement();
  const [activeTab, setActiveTab] = useState('overview');

  // Find current bed assignment
  const currentBed = beds.find(bed => 
    bed.current_patient?.patient_id === Number(patientId)
  );

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'prescriptions', label: 'Prescriptions' },
    { id: 'timeline', label: 'Timeline' },
  ];

  if (isLoadingPatient || isLoadingTimeline) {
    return <LoadingState type="full" />;
  }

  if (!patient) {
    return (
      <Card className="error-card">
        <EmptyState
          title="Patient not found"
          description="Please check the patient ID or contact administrator"
        />
      </Card>
    );
  }

  return (
    <div className="patient-detail-page">
      {/* Patient Summary */}
      <PatientSummaryCard patient={patient} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="patient-tabs">
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="overview-grid">
            {/* Current Bed */}
            <Card className="bed-info-card">
              <h3 className="section-title">Current Bed Assignment</h3>
              {currentBed ? (
                <div className="bed-details">
                  <div className="bed-number">
                    <BedDouble className="icon" />
                    <span>Bed {currentBed.bed_number}</span>
                  </div>
                  <div className="bed-department">
                    <span className="label">Department:</span>
                    <span>{currentBed.department?.name || 'General'}</span>
                  </div>
                  <div className="bed-status">
                    <BedStatusBadge status={currentBed.status} />
                  </div>
                  <Button variant="destructive" size="sm">
                    Discharge Patient
                  </Button>
                </div>
              ) : (
                <EmptyState
                  title="No bed assigned"
                  description="Patient is not currently admitted"
                  size="small"
                />
              )}
            </Card>

            {/* Vital Stats */}
            <Card className="vitals-card">
              <h3 className="section-title">Vital Statistics</h3>
              <div className="vitals-grid">
                <div className="vital-item">
                  <span className="label">Age</span>
                  <span className="value">{patient.age || 'N/A'}</span>
                </div>
                <div className="vital-item">
                  <span className="label">Blood Group</span>
                  <span className="value">{patient.blood_group || 'N/A'}</span>
                </div>
                <div className="vital-item">
                  <span className="label">Last Admission</span>
                  <span className="value">{formatDateTime(patient.last_admission) || 'N/A'}</span>
                </div>
                <div className="vital-item">
                  <span className="label">Allergies</span>
                  <span className="value">{patient.allergies?.join(', ') || 'None'}</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments">
          <Card className="appointments-card">
            <h3 className="section-title">Appointment History</h3>
            {patient.appointments?.length === 0 ? (
              <EmptyState
                title="No appointments"
                description="This patient has no recorded appointments"
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patient.appointments.map(apt => (
                    <TableRow key={apt.id}>
                      <TableCell>{formatDateTime(apt.appointment_date)}</TableCell>
                      <TableCell>Dr. {apt.doctor_name}</TableCell>
                      <TableCell>
                        <AppointmentStatusBadge status={apt.status} />
                      </TableCell>
                      <TableCell>{apt.reason || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions">
          <Card className="prescriptions-card">
            <h3 className="section-title">Prescription History</h3>
            {patient.prescriptions?.length === 0 ? (
              <EmptyState
                title="No prescriptions"
                description="This patient has no recorded prescriptions"
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patient.prescriptions.map(rx => (
                    <TableRow key={rx.id}>
                      <TableCell>{formatDateTime(rx.date)}</TableCell>
                      <TableCell>{rx.medication}</TableCell>
                      <TableCell>{rx.dosage}</TableCell>
                      <TableCell>
                        <Badge variant={rx.dispensed ? 'success' : 'warning'}>
                          {rx.dispensed ? 'Dispensed' : 'Pending'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <Card className="timeline-card">
            <h3 className="section-title">Patient Timeline</h3>
            {timelineEvents?.length === 0 ? (
              <EmptyState
                title="No timeline events"
                description="Patient activity will appear here"
              />
            ) : (
              <div className="timeline-list">
                {timelineEvents.map(event => (
                  <div key={event.id} className="timeline-item">
                    <div className="timeline-time">
                      {formatDateTime(event.timestamp)}
                    </div>
                    <div className="timeline-content">
                      <h4 className="timeline-title">{event.title}</h4>
                      <p className="timeline-description">{event.description}</p>
                      <p className="timeline-user">By {event.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetailPage;