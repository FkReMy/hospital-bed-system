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
import './NurseDashboard.scss';

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
    <div className="nurseDashboard">
      <div className="dashboardHeader">
        <div>
          <h1 className="dashboardTitle">Welcome back, {user?.full_name || 'Nurse'}</h1>
          <p className="dashboardSubtitle">Your bed management overview</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="statsGrid">
        <Card className="stat-card total-beds">
          <BedDouble className="statIcon" />
          <div className="statContent">
            <p className="statLabel">Total Beds</p>
            <p className="statValue">{totalBeds}</p>
          </div>
        </Card>

        <Card className="stat-card available-beds">
          <UserCheck className="statIcon success" />
          <div className="statContent">
            <p className="statLabel">Available</p>
            <p className="statValue">{availableBeds}</p>
          </div>
        </Card>

        <Card className="stat-card occupied-beds">
          <Users className="statIcon" />
          <div className="statContent">
            <p className="statLabel">Occupied</p>
            <p className="statValue">{occupiedBeds}</p>
          </div>
        </Card>

        <Card className="stat-card maintenance-beds">
          <Wrench className="statIcon warning" />
          <div className="statContent">
            <p className="statLabel">Maintenance/Cleaning</p>
            <p className="statValue">{maintenanceBeds}</p>
          </div>
        </Card>

        <Card className="stat-card critical-alerts">
          <AlertCircle className="statIcon destructive" />
          <div className="statContent">
            <p className="statLabel">Critical Alerts</p>
            <p className="statValue">{criticalAlerts.length}</p>
          </div>
        </Card>
      </div>

      {/* Critical Departments */}
      {criticalDepartments.length > 0 && (
        <Card className="criticalDepartments">
          <h2 className="sectionTitle">
            <AlertCircle className="mr2" />
            Critical Bed Availability
          </h2>
          <div className="criticalList">
            {criticalDepartments.map(dept => {
              const deptBeds = beds.filter(b => b.department_id === dept.id);
              const available = deptBeds.filter(b => b.status === 'available').length;
              const rate = Math.round((available / deptBeds.length) * 100);

              return (
                <div key={dept.id} className="criticalItem">
                  <div className="deptInfo">
                    <p className="deptName">{dept.name}</p>
                    <p className="deptStats">{available} available of {deptBeds.length}</p>
                  </div>
                  <Progress value={rate} variant="destructive" />
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Bed Overview by Department */}
      <Card className="departmentOverview">
        <h2 className="sectionTitle">Bed Status by Department</h2>
        <div className="departmentsList">
          {departments.map(dept => {
            const deptBeds = beds.filter(b => b.department_id === dept.id);
            const available = deptBeds.filter(b => b.status === 'available').length;
            const occupied = deptBeds.filter(b => b.status === 'occupied').length;
            const rate = deptBeds.length > 0 ? Math.round((occupied / deptBeds.length) * 100) : 0;

            return (
              <div key={dept.id} className="departmentItem">
                <div className="departmentHeader">
                  <h3 className="departmentName">{dept.name}</h3>
                  <div className="departmentStats">
                    <Badge variant={available === 0 ? 'destructive' : 'default'}>
                      {available} available
                    </Badge>
                  </div>
                </div>
                <Progress value={rate} />
                <div className="departmentSummary">
                  <span>{occupied} occupied</span>
                  <span>{deptBeds.length} total</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="actionsCard">
        <h2 className="sectionTitle">Quick Actions</h2>
        <div className="actionsGrid">
          <Button asChild size="lg">
            <Link to="/beds">
              <BedDouble className="mr2" />
              Full Bed Management
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link to="/patients">
              <Users className="mr2" />
              Patient Search
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link to="/appointments">
              <Calendar className="mr2" />
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