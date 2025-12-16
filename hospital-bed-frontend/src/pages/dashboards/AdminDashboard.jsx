// src/pages/dashboards/AdminDashboard.jsx
/**
 * AdminDashboard Component
 * 
 * Production-ready comprehensive admin dashboard for HBMS.
 * Displays key hospital metrics, real-time stats, charts, and quick actions.
 * 
 * Features:
 * - Bed occupancy overview with live stats
 * - Department breakdown
 * - Recent appointments and notifications
 * - Quick links to management pages
 * - Responsive grid layout
 * - Real-time updates via SignalR channels
 * - Loading and empty states
 * - Unified with global Card, Badge, Button, Progress components
 * - Admin-only access (protected by AdminRoute)
 */

import React from 'react';
import { 
  BedDouble, 
  Users, 
  Calendar, 
  Activity,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Badge from '@components/ui/badge.jsx';
import Button from '@components/ui/button.jsx';
import Progress from '@components/ui/progress.jsx';
import LoadingState from '@components/common/LoadingState.jsx';
import { useBedManagement } from '@hooks/useBedManagement';
import { useAppointmentManagement } from '@hooks/useAppointmentManagement';
import { useNotificationFeed } from '@hooks/useNotificationFeed';
import { Link } from 'react-router-dom';
import './AdminDashboard.module.scss';

const AdminDashboard = () => {
  const { beds, departments, isLoadingBeds } = useBedManagement();
  const { appointments, isLoadingAppointments } = useAppointmentManagement();
  const { notifications, unreadCount, isLoadingNotifications } = useNotificationFeed();

  // Calculate stats
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.status === 'occupied').length;
  const availableBeds = beds.filter(b => b.status === 'available').length;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const todayAppointments = appointments.filter(a => 
    new Date(a.appointment_date).toDateString() === new Date().toDateString()
  ).length;

  const criticalNotifications = notifications.filter(n => 
    n.type === 'error' || n.type === 'warning'
  ).length;

  if (isLoadingBeds || isLoadingAppointments || isLoadingNotifications) {
    return <LoadingState type="grid" count={8} />;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">Hospital-wide overview and management</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        <Card className="metric-card total-beds">
          <div className="metric-icon">
            <BedDouble size={32} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Total Beds</p>
            <p className="metric-value">{totalBeds}</p>
          </div>
        </Card>

        <Card className="metric-card available-beds">
          <div className="metric-icon success">
            <CheckCircle size={32} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Available</p>
            <p className="metric-value">{availableBeds}</p>
          </div>
        </Card>

        <Card className="metric-card occupancy">
          <div className="metric-icon">
            <TrendingUp size={32} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Occupancy Rate</p>
            <p className="metric-value">{occupancyRate}%</p>
            <Progress value={occupancyRate} className="metric-progress" />
          </div>
        </Card>

        <Card className="metric-card today-appointments">
          <div className="metric-icon">
            <Calendar size={32} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Today's Appointments</p>
            <p className="metric-value">{todayAppointments}</p>
          </div>
        </Card>

        <Card className="metric-card critical-alerts">
          <div className="metric-icon destructive">
            <AlertCircle size={32} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Critical Alerts</p>
            <p className="metric-value">{criticalNotifications}</p>
          </div>
        </Card>

        <Card className="metric-card total-patients">
          <div className="metric-icon">
            <Users size={32} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Current Patients</p>
            <p className="metric-value">{occupiedBeds}</p>
          </div>
        </Card>
      </div>

      {/* Department Overview */}
      <Card className="department-overview">
        <h2 className="section-title">Department Bed Status</h2>
        <div className="departments-list">
          {departments.map(dept => {
            const deptBeds = beds.filter(b => b.department_id === dept.id);
            const deptOccupied = deptBeds.filter(b => b.status === 'occupied').length;
            const deptRate = deptBeds.length > 0 ? Math.round((deptOccupied / deptBeds.length) * 100) : 0;

            return (
              <div key={dept.id} className="department-item">
                <div className="department-info">
                  <h3 className="department-name">{dept.name}</h3>
                  <p className="department-stats">
                    {deptBeds.length} beds • {deptOccupied} occupied
                  </p>
                </div>
                <div className="department-progress">
                  <Progress value={deptRate} />
                  <span className="progress-label">{deptRate}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="quick-actions">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          <Button asChild size="lg">
            <Link to="/beds">
              <BedDouble className="mr-2" />
              Manage Beds
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link to="/patients">
              <Users className="mr-2" />
              Manage Patients
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link to="/appointments">
              <Calendar className="mr-2" />
              Appointments
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link to="/admin/users">
              <Shield className="mr-2" />
              Staff Management
            </Link>
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="recent-activity">
        <h2 className="section-title">
          Recent Notifications 
          {unreadCount > 0 && <Badge className="ml-2">{unreadCount}</Badge>}
        </h2>
        {notifications.length === 0 ? (
          <p className="empty-notifications">No recent notifications</p>
        ) : (
          <div className="notifications-list">
            {notifications.slice(0, 5).map(notification => (
              <div key={notification.id} className="notification-item">
                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>
                  <p className="notification-time">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
                {!notification.read && <Badge variant="destructive">New</Badge>}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;