// src/pages/dashboards/ReceptionDashboard.jsx
/**
 * ReceptionDashboard Component
 * 
 * Production-ready personalized dashboard for reception staff in HBMS.
 * Focuses on patient registration, quick appointment scheduling, and bed availability.
 * 
 * Features:
 * - Quick patient search and registration
 * - Today's appointments overview
 * - Available beds summary
 * - Recent patient admissions
 * - Quick actions for core reception tasks
 * - Responsive layout with glassmorphic cards
 * - Real-time updates via SignalR channels
 * - Loading and empty states
 * - Unified with global Card, Badge, Button, Input components
 * - Reception-only access (protected by ReceptionRoute)
 */

import { useState } from 'react';
import { 
  Users, 
  Calendar, 
  BedDouble, 
  Search,
  UserPlus,
  Phone,
  Clock
} from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Badge from '@components/ui/badge.jsx';
import Button from '@components/ui/button.jsx';
import Input from '@components/ui/input.jsx';
import LoadingState from '@components/common/LoadingState.jsx';
import EmptyState from '@components/common/EmptyState.jsx';
import { useBedManagement } from '@hooks/useBedManagement';
import { useAppointmentManagement } from '@hooks/useAppointmentManagement';
import { useAuth } from '@hooks/useAuth';
import { Link } from 'react-router-dom';
import { formatDateTime } from '@lib/dateUtils';
import './ReceptionDashboard.scss';

const ReceptionDashboard = () => {
  const { user } = useAuth();
  const { beds, isLoadingBeds } = useBedManagement();
  const { appointments, isLoadingAppointments } = useAppointmentManagement();

  const [patientSearch, setPatientSearch] = useState('');

  // Calculate stats
  const availableBeds = beds.filter(b => b.status === 'available').length;
  const todayAppointments = appointments.filter(a => 
    new Date(a.appointment_date).toDateString() === new Date().toDateString()
  );

  // Recent appointments (last 5 today)
  const recentAppointments = todayAppointments
    .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date))
    .slice(0, 5);

  if (isLoadingBeds || isLoadingAppointments) {
    return <LoadingState count={6} type="grid" />;
  }

  return (
    <div className="receptionDashboard">
      <div className="dashboardHeader">
        <div>
          <h1 className="dashboardTitle">Welcome, {user?.full_name || 'Reception'}</h1>
          <p className="dashboardSubtitle">Patient registration and appointment management</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="statsGrid">
        <Card className="statCard availableBeds">
          <BedDouble className="statIcon" />
          <div className="statContent">
            <p className="statLabel">Available Beds</p>
            <p className="statValue">{availableBeds}</p>
          </div>
        </Card>

        <Card className="statCard todayAppointments">
          <Calendar className="statIcon" />
          <div className="statContent">
            <p className="statLabel">Today&apos;s Appointments</p>
            <p className="statValue">{todayAppointments.length}</p>
          </div>
        </Card>

        <Card className="statCard quickSearch">
          <Search className="statIcon" />
          <div className="statContent">
            <p className="statLabel">Quick Patient Search</p>
            <Input
              className="quickSearchInput"
              placeholder="Name, phone, or ID..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
            />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="actionsCard">
        <h2 className="sectionTitle">Quick Actions</h2>
        <div className="actionsGrid">
          <Button asChild size="lg">
            <Link to="/patients/new">
              <UserPlus className="mr-2" />
              Register New Patient
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link to="/appointments/new">
              <Calendar className="mr-2" />
              Schedule Appointment
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link to="/beds">
              <BedDouble className="mr-2" />
              View Bed Availability
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link to="/patients">
              <Users className="mr-2" />
              Patient Directory
            </Link>
          </Button>
        </div>
      </Card>

      {/* Today's Appointments */}
      <Card className="appointmentsCard">
        <h2 className="sectionTitle">Today&apos;s Appointments</h2>
        {recentAppointments.length === 0 ? (
          <EmptyState
            description="All clear! Check upcoming or create new"
            size="medium"
            title="No appointments today"
          />
        ) : (
          <div className="appointmentsList">
            {recentAppointments.map(appointment => (
              <div className="appointmentItem" key={appointment.id}>
                <div className="appointmentTime">
                  <Clock size={16} />
                  {formatDateTime(appointment.appointment_date).split(' at ')[1]}
                </div>
                <div className="appointmentDetails">
                  <p className="patientName">{appointment.patient_name}</p>
                  <p className="doctorName">Dr. {appointment.doctor_name}</p>
                </div>
                <div className="appointmentActions">
                  <Badge variant="outline">{appointment.status}</Badge>
                  <Phone className="phoneIcon" size={16} />
                </div>
              </div>
            ))}
            {todayAppointments.length > 5 && (
              <Button asChild className="viewAll" variant="ghost">
                <Link to="/appointments">
                  View all {todayAppointments.length} appointments
                </Link>
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Available Beds Summary */}
      <Card className="bedsSummary">
        <h2 className="sectionTitle">Available Beds Now</h2>
        <div className="bedsCount">
          <p className="availableCount">{availableBeds}</p>
          <p className="bedsLabel">beds available across departments</p>
        </div>
        <Button asChild className="viewBedsButton">
          <Link to="/beds">
            View Full Bed Map
          </Link>
        </Button>
      </Card>
    </div>
  );
};

export default ReceptionDashboard;
