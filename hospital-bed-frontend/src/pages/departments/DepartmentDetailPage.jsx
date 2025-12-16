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
      <Card className="errorCard">
        <EmptyState
          title="Department not found"
          description="Please check the department ID or contact administrator"
        />
      </Card>
    );
  }

  return (
    <div className="departmentDetailPage">
      {/* Department Header */}
      <div className="departmentHeader">
        <div className="departmentInfo">
          <Building2 className="departmentIcon" />
          <div>
            <h1 className="departmentName">{department.name}</h1>
            <p className="departmentDescription">{department.description || 'Hospital department'}</p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="statsGrid">
        <Card className="stat-card total">
          <BedDouble className="statIcon" />
          <div className="statContent">
            <p className="statLabel">Total Beds</p>
            <p className="statValue">{totalBeds}</p>
          </div>
        </Card>

        <Card className="stat-card available">
          <UserCheck className="statIcon success" />
          <div className="statContent">
            <p className="statLabel">Available</p>
            <p className="statValue">{availableBeds}</p>
          </div>
        </Card>

        <Card className="stat-card occupied">
          <Users className="statIcon" />
          <div className="statContent">
            <p className="statLabel">Occupied</p>
            <p className="statValue">{occupiedBeds}</p>
          </div>
        </Card>

        <Card className="stat-card maintenance">
          <Wrench className="statIcon warning" />
          <div className="statContent">
            <p className="statLabel">Maintenance/Cleaning</p>
            <p className="statValue">{maintenanceBeds}</p>
          </div>
        </Card>

        <Card className="stat-card occupancy">
          <Activity className="statIcon" />
          <div className="statContent">
            <p className="statLabel">Occupancy Rate</p>
            <p className="statValue">{occupancyRate}%</p>
            <Progress value={occupancyRate} />
          </div>
        </Card>
      </div>

      {/* Beds Grid */}
      <Card className="bedsSection">
        <h2 className="sectionTitle">Beds in {department.name}</h2>
        
        {departmentBeds.length === 0 ? (
          <EmptyState
            title="No beds in this department"
            description="Beds will appear here when added"
            size="medium"
          />
        ) : (
          <div className="bedsGrid">
            {departmentBeds.map(bed => (
              <Card key={bed.id} className="bedCard" interactive>
                <div className="bedHeader">
                  <div className="bedInfo">
                    <h3 className="bedNumber">{bed.bed_number}</h3>
                    <BedStatusBadge status={bed.status} />
                  </div>
                </div>

                <div className="bedContent">
                  {bed.current_patient ? (
                    <div className="patientInfo">
                      <p className="patientName">{bed.current_patient.full_name}</p>
                      <p className="patientId">ID: {bed.current_patient.patient_id}</p>
                    </div>
                  ) : (
                    <p className="noPatient">Available</p>
                  )}
                </div>

                {canManageBeds && (
                  <div className="bedActions">
                    {bed.status === 'available' ? (
                      <Button size="sm" onClick={() => handleAssign(bed)}>
                        <UserCheck className="mr2" size={16} />
                        Assign Patient
                      </Button>
                    ) : bed.status === 'occupied' ? (
                      <Button variant="destructive" size="sm" onClick={() => handleDischarge(bed)}>
                        <UserX className="mr2" size={16} />
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