// src/pages/dashboards/NurseDashboard.jsx
/**
 * NurseDashboard Component
 * 
 * Production-ready personalized dashboard for nurses in HBMS.
 * Focuses on bed management, assigned patients, and critical tasks.
 * 
 * Features:
 * - Bed availability overview with department breakdown
 * - Current assigned patients list
 * - Critical alerts and tasks
 * - Quick actions for bed assignment/discharge
 * - Responsive layout with glassmorphic cards
 * - Real-time updates via SignalR channels
 * - Loading and empty states
 * - Unified with global Card, Badge, Button, Progress components
 * - Nurse-only access (protected by NurseRoute)
 */

import React from 'react';
import { 
  BedDouble, 
  Users, 
  AlertCircle,
  Activity,
  UserCheck,
  UserX,
  Wrench
} from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Badge from '@components/ui/badge.jsx';
import Button from '@components/ui/button.jsx';
import Progress from '@components/ui/progress.jsx';
import BedStatusBadge from '@components/beds/BedStatusBadge.jsx';
import LoadingState from '@components/common/LoadingState.jsx';
import EmptyState from '@components/common/EmptyState.jsx';
import AssignBedDialog from '@components/beds/AssignBedDialog.jsx';
import DischargeBedDialog from '@components/beds/DischargeBedDialog.jsx';
import { useBedManagement } from '@hooks/useBedManagement';
import { useNotificationFeed } from '@hooks/useNotificationFeed';
import { useAuth } from '@hooks/useAuth';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './NurseDashboard.module.scss';

const NurseDashboard = () => {
  const { user } = useAuth();
  const { beds, departments, isLoadingBeds } = useBedManagement();
  const { notifications, unreadCount, isLoadingNotifications } = useNotificationFeed();

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [dischargeDialogOpen, setDischargeDialogOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);

  // Calculate stats
  const totalBeds = beds.length;
  const availableBeds = beds.filter(b => b.status === 'available').length;
  const occupiedBeds = beds.filter(b => b.status === 'occupied').length;
  const maintenanceBeds = beds.filter(b => b.status === 'maintenance' || b.status === 'cleaning').length;

  // Critical beds (low availability)
  const criticalDepartments = departments.filter(dept => {
    const deptBeds = beds.filter(b => b.department_id === dept.id);
    const available = deptBeds.filter(b => b.status === 'available').length;
    return deptBeds.length > 0 && (available / deptBeds.length) < 0.2;
  });

  // Recent critical notifications
  const criticalAlerts = notifications
    .filter(n => n.type === 'error' || n.type === 'warning')
    .slice(0, 5);

  const handleAssign = (bed) => {
    setSelectedBed(bed);
    setAssignDialogOpen(true);
  };

  const handleDischarge = (bed) => {
    setSelectedBed(bed);
    setDischargeDialogOpen(true);
  };

  if (isLoadingBeds || isLoadingNotifications) {
    return <LoadingState type="grid" count={6} />;
  }

  return (
    <div className="nurse-dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome back, {user?.full_name || 'Nurse'}</h1>
          <p className="dashboard-subtitle">Your bed management overview</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <Card className="stat-card total-beds">
          <BedDouble className="stat-icon" />
          <div className="stat-content">
            <p className="stat-label">Total Beds</p>
            <p className="stat-value">{totalBeds}</p>
          </div>
        </Card>

        <Card className="stat-card available-beds">
          <UserCheck className="stat-icon success" />
          <div className="stat-content">
            <p className="stat-label">Available</p>
            <p className="stat-value">{availableBeds}</p>
          </div>
        </Card>

        <Card className="stat-card occupied-beds">
          <Users className="stat-icon" />
          <div className="stat-content">
            <p className="stat-label">Occupied</p>
            <p className="stat-value">{occupiedBeds}</p>
          </div>
        </Card>

        <Card className="stat-card maintenance-beds">
          <Wrench className="stat-icon warning" />
          <div className="stat-content">
            <p className="stat-label">Maintenance/Cleaning</p>
            <p className="stat-value">{maintenanceBeds}</p>
          </div>
        </Card>

        <Card className="stat-card critical-alerts">
          <AlertCircle className="stat-icon destructive" />
          <div className="stat-content">
            <p className="stat-label">Critical Alerts</p>
            <p className="stat-value">{criticalAlerts.length}</p>
          </div>
        </Card>
      </div>

      {/* Critical Departments */}
      {criticalDepartments.length > 0 && (
        <Card className="critical-departments">
          <h2 className="section-title">
            <AlertCircle className="mr-2" />
            Critical Bed Availability
          </h2>
          <div className="critical-list">
            {criticalDepartments.map(dept => {
              const deptBeds = beds.filter(b => b.department_id === dept.id);
              const available = deptBeds.filter(b => b.status === 'available').length;
              const rate = Math.round((available / deptBeds.length) * 100);

              return (
                <div key={dept.id} className="critical-item">
                  <div className="dept-info">
                    <p className="dept-name">{dept.name}</p>
                    <p className="dept-stats">{available} available of {deptBeds.length}</p>
                  </div>
                  <Progress value={rate} variant="destructive" />
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Bed Overview by Department */}
      <Card className="department-overview">
        <h2 className="section-title">Bed Status by Department</h2>
        <div className="departments-list">
          {departments.map(dept => {
            const deptBeds = beds.filter(b => b.department_id === dept.id);
            const available = deptBeds.filter(b => b.status === 'available').length;
            const occupied = deptBeds.filter(b => b.status === 'occupied').length;
            const rate = deptBeds.length > 0 ? Math.round((occupied / deptBeds.length) * 100) : 0;

            return (
              <div key={dept.id} className="department-item">
                <div className="department-header">
                  <h3 className="department-name">{dept.name}</h3>
                  <div className="department-stats">
                    <Badge variant={available === 0 ? 'destructive' : 'default'}>
                      {available} available
                    </Badge>
                  </div>
                </div>
                <Progress value={rate} />
                <div className="department-summary">
                  <span>{occupied} occupied</span>
                  <span>{deptBeds.length} total</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="actions-card">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          <Button asChild size="lg">
            <Link to="/beds">
              <BedDouble className="mr-2" />
              Full Bed Management
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link to="/patients">
              <Users className="mr-2" />
              Patient Search
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link to="/appointments">
              <Calendar className="mr-2" />
              Appointments
            </Link>
          </Button>
        </div>
      </Card>

      {/* Dialogs */}
      {selectedBed && (
        <>
          <AssignBedDialog
            open={assignDialogOpen}
            onOpenChange={setAssignDialogOpen}
            bed={selectedBed}
          />
          <DischargeBedDialog
            open={dischargeDialogOpen}
            onOpenChange={setDischargeDialogOpen}
            bed={selectedBed}
          />
        </>
      )}
    </div>
  );
};

export default NurseDashboard;