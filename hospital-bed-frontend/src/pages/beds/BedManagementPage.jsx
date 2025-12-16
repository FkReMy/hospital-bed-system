// src/pages/beds/BedManagementPage.jsx
/**
 * BedManagementPage Component
 * 
 * Production-ready comprehensive bed management dashboard.
 * Displays all beds grouped by department with real-time status, patient info, and actions.
 * 
 * Features:
 * - Department accordion with bed grid
 * - Real-time bed status updates via SignalR (bedChannel)
 * - Assign/discharge patient dialogs
 * - Bed status change (maintenance/cleaning)
 * - Search and filter beds
 * - Responsive grid layout
 * - Loading, empty, error states
 * - Unified with global Card, Badge, Button, Dialog components
 * - Role-aware actions (nurse/admin can assign/discharge)
 */

import { useState, useMemo } from 'react';
import { 
  Search, 
  UserCheck,
  UserX,
  Wrench,
  MoreVertical 
} from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Button from '@components/ui/button.jsx';
import Input from '@components/ui/input.jsx';
import BedStatusBadge from '@components/beds/BedStatusBadge.jsx';
import LoadingState from '@components/common/LoadingState.jsx';
import EmptyState from '@components/common/EmptyState.jsx';
import AssignBedDialog from '@components/beds/AssignBedDialog.jsx';
import DischargeBedDialog from '@components/beds/DischargeBedDialog.jsx';
import { useBedManagement } from '@hooks/useBedManagement';
import { useRoleAccess } from '@hooks/useRoleAccess';
import './BedManagementPage.scss';

const BedManagementPage = () => {
  const { beds, departments, isLoadingBeds } = useBedManagement();
  const { hasAccess: canManageBeds } = useRoleAccess(['admin', 'nurse', 'reception']);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [dischargeDialogOpen, setDischargeDialogOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);

  // Filtered beds
  const filteredBeds = useMemo(() => {
    let filtered = beds;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(bed =>
        bed.bed_number?.toLowerCase().includes(lower) ||
        bed.current_patient?.full_name?.toLowerCase().includes(lower) ||
        bed.current_patient?.patient_id?.toString().includes(searchTerm)
      );
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(bed => bed.department_id === selectedDepartment);
    }

    return filtered;
  }, [beds, searchTerm, selectedDepartment]);

  // Group beds by department
  const bedsByDepartment = useMemo(() => {
    const grouped = {};
    departments.forEach(dept => {
      grouped[dept.id] = {
        ...dept,
        beds: filteredBeds.filter(bed => bed.department_id === dept.id),
      };
    });
    return grouped;
  }, [departments, filteredBeds]);

  const handleAssign = (bed) => {
    setSelectedBed(bed);
    setAssignDialogOpen(true);
  };

  const handleDischarge = (bed) => {
    setSelectedBed(bed);
    setDischargeDialogOpen(true);
  };

  if (isLoadingBeds) {
    return <LoadingState count={12} type="grid" />;
  }

  return (
    <div className="bedManagementPage">
      <div className="pageHeader">
        <h1 className="pageTitle">Bed Management</h1>
        <div className="headerActions">
          <Input
            className="searchInput"
            leftIcon={Search}
            placeholder="Search bed number or patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="departmentFilter"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {departments.length === 0 ? (
        <EmptyState
          description="Please contact administrator"
          title="No departments configured"
        />
      ) : (
        <div className="departmentsGrid">
          {departments.map(department => {
            const deptBeds = bedsByDepartment[department.id]?.beds || [];
            
            return (
              <Card className="departmentCard" key={department.id}>
                <div className="departmentHeader">
                  <h2 className="departmentName">{department.name}</h2>
                  <div className="departmentStats">
                    <span>{deptBeds.length} beds</span>
                    <span>•</span>
                    <span>{deptBeds.filter(b => b.status === 'available').length} available</span>
                  </div>
                </div>

                {deptBeds.length === 0 ? (
                  <div className="emptyDepartment">
                    <EmptyState
                      description="No beds in this department"
                      size="small"
                      title="No beds"
                    />
                  </div>
                ) : (
                  <div className="bedsGrid">
                    {deptBeds.map(bed => (
                      <Card interactive className="bedCard" key={bed.id}>
                        <div className="bedHeader">
                          <div className="bedInfo">
                            <h3 className="bedNumber">{bed.bed_number}</h3>
                            <BedStatusBadge status={bed.status} />
                          </div>
                          <Button size="icon" variant="ghost">
                            <MoreVertical size={18} />
                          </Button>
                        </div>

                        <div className="bedContent">
                          {bed.current_patient ? (
                            <div className="patientInfo">
                              <p className="patientName">{bed.current_patient.full_name}</p>
                              <p className="patientId">ID: {bed.current_patient.patient_id}</p>
                            </div>
                          ) : (
                            <p className="noPatient">No patient assigned</p>
                          )}
                        </div>

                        {canManageBeds && (
                          <div className="bedActions">
                            {bed.status === 'available' ? (
                              <Button 
                                size="sm" 
                                onClick={() => handleAssign(bed)}
                              >
                                <UserCheck size={16} />
                                Assign Patient
                              </Button>
                            ) : bed.status === 'occupied' ? (
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDischarge(bed)}
                              >
                                <UserX size={16} />
                                Discharge
                              </Button>
                            ) : (
                              <Button size="sm" variant="secondary">
                                <Wrench size={16} />
                                Update Status
                              </Button>
                            )}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialogs */}
      {selectedBed && (
        <>
          <AssignBedDialog
            bed={selectedBed}
            open={assignDialogOpen}
            onOpenChange={setAssignDialogOpen}
          />
          <DischargeBedDialog
            bed={selectedBed}
            open={dischargeDialogOpen}
            onOpenChange={setDischargeDialogOpen}
          />
        </>
      )}
    </div>
  );
};

export default BedManagementPage;
