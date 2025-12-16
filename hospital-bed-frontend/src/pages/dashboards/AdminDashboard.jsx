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
  AlertCircle,
  CheckCircle,
  Shield
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
import './AdminDashboard.scss';

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
    <div className="adminDashboard">
      <div className="dashboardHeader">
        <h1 className="dashboardTitle">Admin Dashboard</h1>
        <p className="dashboardSubtitle">Hospital-wide overview and management</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="metricsGrid">
        <Card className="metricCard totalBeds">
          <div className="metricIcon">
            <BedDouble size={32} />
          </div>
          <div className="metricContent">
            <p className="metricLabel">Total Beds</p>
            <p className="metricValue">{totalBeds}</p>
          </div>
        </Card>

        <Card className="metricCard availableBeds">
          <div className="metricIcon success">
            <CheckCircle size={32} />
          </div>
          <div className="metricContent">
            <p className="metricLabel">Available</p>
            <p className="metricValue">{availableBeds}</p>
          </div>
        </Card>

        <Card className="metricCard occupancy">
          <div className="metricIcon">
            <TrendingUp size={32} />
          </div>
          <div className="metricContent">
            <p className="metricLabel">Occupancy Rate</p>
            <p className="metricValue">{occupancyRate}%</p>
            <Progress value={occupancyRate} className="metricProgress" />
          </div>
        </Card>

        <Card className="metricCard todayAppointments">
          <div className="metricIcon">
            <Calendar size={32} />
          </div>
          <div className="metricContent">
            <p className="metricLabel">Today's Appointments</p>
            <p className="metricValue">{todayAppointments}</p>
          </div>
        </Card>

        <Card className="metricCard criticalAlerts">
          <div className="metricIcon destructive">
            <AlertCircle size={32} />
          </div>
          <div className="metricContent">
            <p className="metricLabel">Critical Alerts</p>
            <p className="metricValue">{criticalNotifications}</p>
          </div>
        </Card>

        <Card className="metricCard totalPatients">
          <div className="metricIcon">
            <Users size={32} />
          </div>
          <div className="metricContent">
            <p className="metricLabel">Current Patients</p>
            <p className="metricValue">{occupiedBeds}</p>
          </div>
        </Card>
      </div>

      {/* Department Overview */}
      <Card className="departmentOverview">
        <h2 className="sectionTitle">Department Bed Status</h2>
        <div className="departmentsList">
          {departments.map(dept => {
            const deptBeds = beds.filter(b => b.department_id === dept.id);
            const deptOccupied = deptBeds.filter(b => b.status === 'occupied').length;
            const deptRate = deptBeds.length > 0 ? Math.round((deptOccupied / deptBeds.length) * 100) : 0;

            return (
              <div key={dept.id} className="departmentItem">
                <div className="departmentInfo">
                  <h3 className="departmentName">{dept.name}</h3>
                  <p className="departmentStats">
                    {deptBeds.length} beds • {deptOccupied} occupied
                  </p>
                </div>
                <div className="departmentProgress">
                  <Progress value={deptRate} />
                  <span className="progressLabel">{deptRate}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="quickActions">
        <h2 className="sectionTitle">Quick Actions</h2>
        <div className="actionsGrid">
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
      <Card className="recentActivity">
        <h2 className="sectionTitle">
          Recent Notifications 
          {unreadCount > 0 && <Badge className="ml-2">{unreadCount}</Badge>}
        </h2>
        {notifications.length === 0 ? (
          <p className="emptyNotifications">No recent notifications</p>
        ) : (
          <div className="notificationsList">
            {notifications.slice(0, 5).map(notification => (
              <div key={notification.id} className="notificationItem">
                <div className="notificationContent">
                  <p className="notificationMessage">{notification.message}</p>
                  <p className="notificationTime">
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
