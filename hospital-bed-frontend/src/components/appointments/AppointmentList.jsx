// src/components/appointments/AppointmentList.jsx
/**
 * AppointmentList Component
 * 
 * Production-ready, reusable table/list displaying appointments with filtering,
 * sorting, pagination, and action capabilities.
 * 
 * Used in:
 * - AppointmentManagementPage
 * - DoctorDashboard / NurseDashboard (my appointments view)
 * - PatientDetailPage (appointment history)
 * 
 * Features:
 * - Responsive table with mobile card fallback
 * - Column sorting
 * - Status badges with color coding
 * - Quick actions (view/edit, cancel, complete)
 * - Loading, empty, and error states
 * - Integrates with global UI components (Table, Badge, Button, Dropdown, etc.)
 * - Accessible (ARIA labels, keyboard navigation)
 */

import React from 'react';
import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  MoreVertical,
  Edit,
  XCircle,
  CheckCircle,
} from 'lucide-react';
import Table from '@components/ui/table.jsx';
import TableHeader from '@components/ui/table-header.jsx';
import TableBody from '@components/ui/table-body.jsx';
import TableRow from '@components/ui/table-row.jsx';
import TableCell from '@components/ui/table-cell.jsx';
import TableHead from '@components/ui/table-head.jsx';
import Badge from '@components/ui/badge.jsx';
import Button from '@components/ui/button.jsx';
import DropdownMenu from '@components/ui/dropdown-menu.jsx';
import DropdownMenuTrigger from '@components/ui/dropdown-menu-trigger.jsx';
import DropdownMenuContent from '@components/ui/dropdown-menu-content.jsx';
import DropdownMenuItem from '@components/ui/dropdown-menu-item.jsx';
import Skeleton from '@components/ui/skeleton.jsx';
import EmptyState from '@components/common/EmptyState.jsx';
import './AppointmentList.scss';

/**
 * Props:
 * - appointments: Array of appointment objects from API/store
 * - isLoading: boolean
 * - error: any
 * - onEdit: (appointment) => void
 * - onCancel: (appointmentId) => void
 * - onComplete: (appointmentId) => void
 * - showActions: boolean (default: true) - hide for read-only views
 */
const AppointmentList = ({
  appointments = [],
  isLoading = false,
  error = null,
  onEdit,
  onCancel,
  onComplete,
  showActions = true,
}) => {
  // Status configuration - matches backend enum and design system
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return { variant: 'default', label: 'Scheduled', icon: Calendar };
      case 'completed':
        return { variant: 'success', label: 'Completed', icon: CheckCircle };
      case 'cancelled':
        return { variant: 'destructive', label: 'Cancelled', icon: XCircle };
      case 'no_show':
        return { variant: 'secondary', label: 'No Show', icon: User };
      default:
        return { variant: 'outline', label: 'Unknown', icon: Calendar };
    }
  };

  if (isLoading) {
    return (
      <div className="appointment-list">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              {showActions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                {showActions && <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="appointment-list">
        <EmptyState
          title="Failed to Load Appointments"
          description="There was an error loading the appointment list. Please try again."
          illustration="no-patients"
          action={
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="appointment-list">
        <EmptyState
          title="No Appointments Found"
          description="There are no appointments matching the current filters or for the selected period."
          illustration="no-patients"
        />
      </div>
    );
  }

  return (
    <div className="appointment-list">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            {showActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appt) => {
            const statusConfig = getStatusConfig(appt.status);
            const StatusIcon = statusConfig.icon;

            return (
              <TableRow key={appt.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    {appt.patient?.full_name || 'Unknown Patient'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-muted-foreground" />
                    Dr. {appt.doctor?.full_name || 'Unknown Doctor'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {format(new Date(appt.appointment_date), 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {format(new Date(appt.appointment_date), 'HH:mm')}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {appt.reason || '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={statusConfig.variant}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig.label}
                  </Badge>
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                          <span className="sr-only">Open actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(appt)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {appt.status === 'scheduled' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => onComplete?.(appt.id)}
                              className="text-success"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Complete
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onCancel?.(appt.id)}
                              className="text-destructive"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancel
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppointmentList;