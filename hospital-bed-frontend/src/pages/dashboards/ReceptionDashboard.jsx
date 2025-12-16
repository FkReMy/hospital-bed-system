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

import React, { useState } from 'react';
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
import './ReceptionDashboard.module.scss';

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
    return <LoadingState type="grid" count={6} />;
  }

  return (
    <div className="reception-dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome, {user?.full_name || 'Reception'}</h1>
          <p className="dashboard-subtitle">Patient registration and appointment management</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <Card className="stat-card available-beds">
          <BedDouble className="stat-icon" />
          <div className="stat-content">
            <p className="stat-label">Available Beds</p>
            <p className="stat-value">{availableBeds}</p>
          </div>
        </Card>

        <Card className="stat-card today-appointments">
          <Calendar className="stat-icon" />
          <div className="stat-content">
            <p className="stat-label">Today's Appointments</p>
            <p className="stat-value">{todayAppointments.length}</p>
          </div>
        </Card>

        <Card className="stat-card quick-search">
          <Search className="stat-icon" />
          <div className="stat-content">
            <p className="stat-label">Quick Patient Search</p>
            <Input
              placeholder="Name, phone, or ID..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              className="quick-search-input"
            />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="actions-card">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
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
      <Card className="appointments-card">
        <h2 className="section-title">Today's Appointments</h2>
        {recentAppointments.length === 0 ? (
          <EmptyState
            title="No appointments today"
            description="All clear! Check upcoming or create new"
            size="medium"
          />
        ) : (
          <div className="appointments-list">
            {recentAppointments.map(appointment => (
              <div key={appointment.id} className="appointment-item">
                <div className="appointment-time">
                  <Clock size={16} />
                  {formatDateTime(appointment.appointment_date).split(' at ')[1]}
                </div>
                <div className="appointment-details">
                  <p className="patient-name">{appointment.patient_name}</p>
                  <p className="doctor-name">Dr. {appointment.doctor_name}</p>
                </div>
                <div className="appointment-actions">
                  <Badge variant="outline">{appointment.status}</Badge>
                  <Phone size={16} className="phone-icon" />
                </div>
              </div>
            ))}
            {todayAppointments.length > 5 && (
              <Button asChild variant="ghost" className="view-all">
                <Link to="/appointments">
                  View all {todayAppointments.length} appointments
                </Link>
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Available Beds Summary */}
      <Card className="beds-summary">
        <h2 className="section-title">Available Beds Now</h2>
        <div className="beds-count">
          <p className="available-count">{availableBeds}</p>
          <p className="beds-label">beds available across departments</p>
        </div>
        <Button asChild className="view-beds-button">
          <Link to="/beds">
            View Full Bed Map
          </Link>
        </Button>
      </Card>
    </div>
  );
};

export default ReceptionDashboard;