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

import Tabs from '@components/ui/tabs.jsx';
import TabsList from '@components/ui/tabs-list.jsx';
import TabsTrigger from '@components/ui/tabs-trigger.jsx';
import TabsContent from '@components/ui/tabs-content.jsx';
import Card from '@components/ui/card.jsx';
import EmptyState from '@components/common/EmptyState.jsx';
import LoadingState from '@components/common/LoadingState.jsx';
import PatientSummaryCard from '@components/patients/PatientSummaryCard.jsx';
import PatientTimeline from '@components/patients/PatientTimeline.jsx';
import AppointmentList from '@components/appointments/AppointmentList.jsx';
import PrescriptionList from '@components/prescriptions/PrescriptionList.jsx';
import './PatientDetailTabs.scss';

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
    return <LoadingState count={1} type="full" />;
  }

  if (!patient) {
    return (
      <EmptyState
        description="The requested patient could not be loaded."
        illustration="no-patients"
        title="Patient Not Found"
      />
    );
  }

  return (
    <Tabs className="patient-detail-tabs" value={activeTab} onValueChange={onTabChange}>
      <TabsList className="tabs-list">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="bed-history">Bed History</TabsTrigger>
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
        <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
      </TabsList>

      <TabsContent className="tab-content" value="overview">
        <Card className="overview-card">
          <PatientSummaryCard patient={patient} />
        </Card>
      </TabsContent>

      <TabsContent className="tab-content" value="bed-history">
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
              description="This patient has not been assigned to any bed yet."
              illustration="empty-beds"
              title="No Bed Assignments"
            />
          )}
        </Card>
      </TabsContent>

      <TabsContent className="tab-content" value="appointments">
        <Card className="appointments-card">
          {patient.appointments?.length > 0 ? (
            <AppointmentList
              appointments={patient.appointments}
              showActions={false} // Read-only in patient view
            />
          ) : (
            <EmptyState
              description="This patient has no scheduled or past appointments."
              illustration="no-patients"
              title="No Appointments"
            />
          )}
        </Card>
      </TabsContent>

      <TabsContent className="tab-content" value="prescriptions">
        <Card className="prescriptions-card">
          {patient.prescriptions?.length > 0 ? (
            <PrescriptionList prescriptions={patient.prescriptions} />
          ) : (
            <EmptyState
              description="This patient has no recorded prescriptions."
              illustration="no-patients"
              title="No Prescriptions"
            />
          )}
        </Card>
      </TabsContent>

      <TabsContent className="tab-content" value="timeline">
        <Card className="timeline-card">
          <PatientTimeline patientId={patient.id} />
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default PatientDetailTabs;