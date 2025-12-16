// src/pages/departments/DepartmentDetailPage.jsx
/**
 * DepartmentDetailPage Component
 * 
 * Production-ready detailed view of a single hospital department.
 * Shows department overview, bed status breakdown, and list of beds with real-time updates.
 * 
 * Features:
 * - Department header with name and stats
 * - Bed status summary (available, occupied, maintenance)
 * - Progress bar for occupancy rate
 * - Grid of individual bed cards with status and patient info
 * - Real-time updates via SignalR (bedChannel)
 * - Assign/discharge actions for authorized roles
 * - Loading, empty, error states
 * - Responsive layout
 * - Unified with global Card, Badge, Button, Progress components
 */

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Building2, 
  BedDouble, 
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
import { useRoleAccess } from '@hooks/useRoleAccess';
import './DepartmentDetailPage.scss';

const DepartmentDetailPage = () => {
  const { departmentId } = useParams();
  const { beds, departments, isLoadingBeds } = useBedManagement();
  const { hasAccess: canManageBeds } = useRoleAccess(['admin', 'nurse', 'reception']);

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [dischargeDialogOpen, setDischargeDialogOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);

  // Find department
  const department = departments.find(d => d.id === departmentId);

  // Filter beds for this department
  const departmentBeds = beds.filter(bed => bed.department_id === departmentId);

  // Calculate stats
  const totalBeds = departmentBeds.length;
  const availableBeds = departmentBeds.filter(b => b.status === 'available').length;
  const occupiedBeds = departmentBeds.filter(b => b.status === 'occupied').length;
  const maintenanceBeds = departmentBeds.filter(b => b.status === 'maintenance' || b.status === 'cleaning').length;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const handleAssign = (bed) => {
    setSelectedBed(bed);
    setAssignDialogOpen(true);
  };

  const handleDischarge = (bed) => {
    setSelectedBed(bed);
    setDischargeDialogOpen(true);
  };

  if (isLoadingBeds) {
    return <LoadingState type="grid" count={8} />;
  }

  if (!department) {
    return (
      <Card className="error-card">
        <EmptyState
          title="Department not found"
          description="Please check the department ID or contact administrator"
        />
      </Card>
    );
  }

  return (
    <div className="department-detail-page">
      {/* Department Header */}
      <div className="department-header">
        <div className="department-info">
          <Building2 className="department-icon" />
          <div>
            <h1 className="department-name">{department.name}</h1>
            <p className="department-description">{department.description || 'Hospital department'}</p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-grid">
        <Card className="stat-card total">
          <BedDouble className="stat-icon" />
          <div className="stat-content">
            <p className="stat-label">Total Beds</p>
            <p className="stat-value">{totalBeds}</p>
          </div>
        </Card>

        <Card className="stat-card available">
          <UserCheck className="stat-icon success" />
          <div className="stat-content">
            <p className="stat-label">Available</p>
            <p className="stat-value">{availableBeds}</p>
          </div>
        </Card>

        <Card className="stat-card occupied">
          <Users className="stat-icon" />
          <div className="stat-content">
            <p className="stat-label">Occupied</p>
            <p className="stat-value">{occupiedBeds}</p>
          </div>
        </Card>

        <Card className="stat-card maintenance">
          <Wrench className="stat-icon warning" />
          <div className="stat-content">
            <p className="stat-label">Maintenance/Cleaning</p>
            <p className="stat-value">{maintenanceBeds}</p>
          </div>
        </Card>

        <Card className="stat-card occupancy">
          <Activity className="stat-icon" />
          <div className="stat-content">
            <p className="stat-label">Occupancy Rate</p>
            <p className="stat-value">{occupancyRate}%</p>
            <Progress value={occupancyRate} />
          </div>
        </Card>
      </div>

      {/* Beds Grid */}
      <Card className="beds-section">
        <h2 className="section-title">Beds in {department.name}</h2>
        
        {departmentBeds.length === 0 ? (
          <EmptyState
            title="No beds in this department"
            description="Beds will appear here when added"
            size="medium"
          />
        ) : (
          <div className="beds-grid">
            {departmentBeds.map(bed => (
              <Card key={bed.id} className="bed-card" interactive>
                <div className="bed-header">
                  <div className="bed-info">
                    <h3 className="bed-number">{bed.bed_number}</h3>
                    <BedStatusBadge status={bed.status} />
                  </div>
                </div>

                <div className="bed-content">
                  {bed.current_patient ? (
                    <div className="patient-info">
                      <p className="patient-name">{bed.current_patient.full_name}</p>
                      <p className="patient-id">ID: {bed.current_patient.patient_id}</p>
                    </div>
                  ) : (
                    <p className="no-patient">Available</p>
                  )}
                </div>

                {canManageBeds && (
                  <div className="bed-actions">
                    {bed.status === 'available' ? (
                      <Button size="sm" onClick={() => handleAssign(bed)}>
                        <UserCheck className="mr-2" size={16} />
                        Assign Patient
                      </Button>
                    ) : bed.status === 'occupied' ? (
                      <Button variant="destructive" size="sm" onClick={() => handleDischarge(bed)}>
                        <UserX className="mr-2" size={16} />
                        Discharge
                      </Button>
                    ) : (
                      <Badge variant="secondary">Under {bed.status}</Badge>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
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

export default DepartmentDetailPage;