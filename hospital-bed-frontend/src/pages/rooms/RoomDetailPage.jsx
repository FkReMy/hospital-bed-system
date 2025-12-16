// src/pages/rooms/RoomDetailPage.jsx
/**
 * RoomDetailPage Component
 * 
 * Production-ready detailed view of a single hospital room.
 * Shows room overview, bed list with real-time status, and patient assignments.
 * 
 * Features:
 * - Room header with name, department, and capacity
 * - Bed grid with status, patient info, and actions
 * - Real-time updates via SignalR (bedChannel)
 * - Assign/discharge actions for authorized roles
 * - Loading, empty, error states
 * - Responsive grid layout
 * - Unified with global Card, Badge, Button, LoadingState, EmptyState components
 */

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  DoorClosed, 
  BedDouble, 
  UserCheck,
  UserX,
  Wrench
} from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Badge from '@components/ui/badge.jsx';
import Button from '@components/ui/button.jsx';
import BedStatusBadge from '@components/beds/BedStatusBadge.jsx';
import LoadingState from '@components/common/LoadingState.jsx';
import EmptyState from '@components/common/EmptyState.jsx';
import AssignBedDialog from '@components/beds/AssignBedDialog.jsx';
import DischargeBedDialog from '@components/beds/DischargeBedDialog.jsx';
import { useBedManagement } from '@hooks/useBedManagement';
import { useRoleAccess } from '@hooks/useRoleAccess';
import './RoomDetailPage.module.scss';

const RoomDetailPage = () => {
  const { roomId } = useParams();
  const { beds, rooms, departments, isLoadingBeds } = useBedManagement();
  const { hasAccess: canManageBeds } = useRoleAccess(['admin', 'nurse', 'reception']);

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [dischargeDialogOpen, setDischargeDialogOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);

  // Find room
  const room = rooms.find(r => r.id === roomId);

  // Filter beds for this room
  const roomBeds = beds.filter(bed => bed.room_id === roomId);

  // Find department
  const department = departments.find(d => d.id === room?.department_id);

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

  if (!room) {
    return (
      <Card className="error-card">
        <EmptyState
          title="Room not found"
          description="Please check the room ID or contact administrator"
        />
      </Card>
    );
  }

  return (
    <div className="room-detail-page">
      {/* Room Header */}
      <div className="room-header">
        <div className="room-info">
          <DoorClosed className="room-icon" />
          <div>
            <h1 className="room-name">{room.name || `Room ${room.room_number}`}</h1>
            <p className="room-department">
              {department?.name || 'General Department'}
            </p>
            <p className="room-capacity">
              Capacity: {room.capacity || roomBeds.length} beds
            </p>
          </div>
        </div>
      </div>

      {/* Bed Grid */}
      <Card className="beds-section">
        <h2 className="section-title">Beds in {room.name || `Room ${room.room_number}`}</h2>
        
        {roomBeds.length === 0 ? (
          <EmptyState
            title="No beds in this room"
            description="Beds will appear here when added"
            size="medium"
          />
        ) : (
          <div className="beds-grid">
            {roomBeds.map(bed => (
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

export default RoomDetailPage;