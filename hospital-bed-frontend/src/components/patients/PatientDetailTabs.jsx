// src/components/patients/PatientDetailTabs.jsx
/**
 * PatientDetailTabs Component
 * 
 * Production-ready tabbed interface for viewing detailed patient information.
 * Used in PatientDetailPage to organize patient data into logical sections.
 * 
 * Tabs:
 * - Overview: Basic demographics and current status
 * - Bed History: Timeline of bed assignments/discharges
 * - Appointments: Upcoming and past appointments
 * - Prescriptions: Active and historical prescriptions
 * - Timeline: Full activity log (future extension)
 * 
 * Features:
 * - Responsive tab navigation
 * - Loading and empty states per tab
 * - Unified with global Tabs, Card, Badge, Table components
 * - Accessible tab pattern (ARIA roles)
 * - Premium glassmorphic design
 */

import React from 'react';
import Tabs from '@components/ui/tabs.jsx';
import TabsList from '@components/ui/tabs-list.jsx';
import TabsTrigger from '@components/ui/tabs-trigger.jsx';
import TabsContent from '@components/ui/tabs-content.jsx';
import Card from '@components/ui/card.jsx';
import Badge from '@components/ui/badge.jsx';
import EmptyState from '@components/common/EmptyState.jsx';
import LoadingState from '@components/common/LoadingState.jsx';
import PatientSummaryCard from '@components/patients/PatientSummaryCard.jsx';
import PatientTimeline from '@components/patients/PatientTimeline.jsx';
import AppointmentList from '@components/appointments/AppointmentList.jsx';
import PrescriptionList from '@components/prescriptions/PrescriptionList.jsx';
import './PatientDetailTabs.module.scss';

/**
 * Props:
 * - patient: Full patient object with nested relations
 * - isLoading: boolean - overall loading state
 * - activeTab: string - controlled tab value
 * - onTabChange: (value: string) => void
 */
const PatientDetailTabs = ({
  patient,
  isLoading = false,
  activeTab = 'overview',
  onTabChange,
}) => {
  if (isLoading) {
    return <LoadingState type="full" count={1} />;
  }

  if (!patient) {
    return (
      <EmptyState
        title="Patient Not Found"
        description="The requested patient could not be loaded."
        illustration="no-patients"
      />
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="patient-detail-tabs">
      <TabsList className="tabs-list">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="bed-history">Bed History</TabsTrigger>
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
        <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="tab-content">
        <Card className="overview-card">
          <PatientSummaryCard patient={patient} />
        </Card>
      </TabsContent>

      <TabsContent value="bed-history" className="tab-content">
        <Card className="history-card">
          {patient.bed_assignments?.length > 0 ? (
            <div className="bed-history-list">
              {/* Future: Dedicated BedHistoryTable or Timeline */}
              <p className="placeholder-text">
                Bed assignment history will be displayed here.
              </p>
            </div>
          ) : (
            <EmptyState
              title="No Bed Assignments"
              description="This patient has not been assigned to any bed yet."
              illustration="empty-beds"
            />
          )}
        </Card>
      </TabsContent>

      <TabsContent value="appointments" className="tab-content">
        <Card className="appointments-card">
          {patient.appointments?.length > 0 ? (
            <AppointmentList
              appointments={patient.appointments}
              showActions={false} // Read-only in patient view
            />
          ) : (
            <EmptyState
              title="No Appointments"
              description="This patient has no scheduled or past appointments."
              illustration="no-patients"
            />
          )}
        </Card>
      </TabsContent>

      <TabsContent value="prescriptions" className="tab-content">
        <Card className="prescriptions-card">
          {patient.prescriptions?.length > 0 ? (
            <PrescriptionList prescriptions={patient.prescriptions} />
          ) : (
            <EmptyState
              title="No Prescriptions"
              description="This patient has no recorded prescriptions."
              illustration="no-patients"
            />
          )}
        </Card>
      </TabsContent>

      <TabsContent value="timeline" className="tab-content">
        <Card className="timeline-card">
          <PatientTimeline patientId={patient.id} />
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default PatientDetailTabs;