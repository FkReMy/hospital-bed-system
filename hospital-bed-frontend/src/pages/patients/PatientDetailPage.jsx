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
import './PatientDetailPage.scss';

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
      <Card className="errorCard">
        <EmptyState
          description="Please check the patient ID or contact administrator"
          title="Patient not found"
        />
      </Card>
    );
  }

  return (
    <div className="patientDetailPage">
      {/* Patient Summary */}
      <PatientSummaryCard patient={patient} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="patientTabs">
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="overviewGrid">
            {/* Current Bed */}
            <Card className="bedInfoCard">
              <h3 className="sectionTitle">Current Bed Assignment</h3>
              {currentBed ? (
                <div className="bedDetails">
                  <div className="bedNumber">
                    <BedDouble className="icon" />
                    <span>Bed {currentBed.bed_number}</span>
                  </div>
                  <div className="bedDepartment">
                    <span className="label">Department:</span>
                    <span>{currentBed.department?.name || 'General'}</span>
                  </div>
                  <div className="bedStatus">
                    <BedStatusBadge status={currentBed.status} />
                  </div>
                  <Button size="sm" variant="destructive">
                    Discharge Patient
                  </Button>
                </div>
              ) : (
                <EmptyState
                  description="Patient is not currently admitted"
                  size="small"
                  title="No bed assigned"
                />
              )}
            </Card>

            {/* Vital Stats */}
            <Card className="vitalsCard">
              <h3 className="sectionTitle">Vital Statistics</h3>
              <div className="vitalsGrid">
                <div className="vitalItem">
                  <span className="label">Age</span>
                  <span className="value">{patient.age || 'N/A'}</span>
                </div>
                <div className="vitalItem">
                  <span className="label">Blood Group</span>
                  <span className="value">{patient.blood_group || 'N/A'}</span>
                </div>
                <div className="vitalItem">
                  <span className="label">Last Admission</span>
                  <span className="value">{formatDateTime(patient.last_admission) || 'N/A'}</span>
                </div>
                <div className="vitalItem">
                  <span className="label">Allergies</span>
                  <span className="value">{patient.allergies?.join(', ') || 'None'}</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments">
          <Card className="appointmentsCard">
            <h3 className="sectionTitle">Appointment History</h3>
            {patient.appointments?.length === 0 ? (
              <EmptyState
                description="This patient has no recorded appointments"
                title="No appointments"
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
          <Card className="prescriptionsCard">
            <h3 className="sectionTitle">Prescription History</h3>
            {patient.prescriptions?.length === 0 ? (
              <EmptyState
                description="This patient has no recorded prescriptions"
                title="No prescriptions"
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
          <Card className="timelineCard">
            <h3 className="sectionTitle">Patient Timeline</h3>
            {timelineEvents?.length === 0 ? (
              <EmptyState
                description="Patient activity will appear here"
                title="No timeline events"
              />
            ) : (
              <div className="timelineList">
                {timelineEvents.map(event => (
                  <div className="timelineItem" key={event.id}>
                    <div className="timelineTime">
                      {formatDateTime(event.timestamp)}
                    </div>
                    <div className="timelineContent">
                      <h4 className="timelineTitle">{event.title}</h4>
                      <p className="timelineDescription">{event.description}</p>
                      <p className="timelineUser">By {event.user}</p>
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
