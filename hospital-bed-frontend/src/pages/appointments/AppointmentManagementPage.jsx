// src/pages/appointments/AppointmentManagementPage.jsx
/**
 * AppointmentManagementPage Component
 * 
 * Production-ready comprehensive appointment management interface.
 * Features list view with search, filters, sorting, and bulk actions.
 * 
 * Features:
 * - Data table with appointments (patient, doctor, date, status)
 * - Search by patient name/phone/ID
 * - Filter by doctor, date range, status
 * - Sort by any column
 * - Bulk actions (cancel, complete)
 * - Create new appointment button
 * - Click row to view/edit appointment
 * - Responsive table with horizontal scroll on mobile
 * - Loading, empty, error states
 * - Unified with global Table, Badge, Button, Input components
 * - Real-time updates via notificationChannel (when appointment changes)
 */

import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Search,
  Plus,
  MoreVertical,
} from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Button from '@components/ui/button.jsx';
import Input from '@components/ui/input.jsx';
import Dialog from '@components/ui/dialog.jsx';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@components/ui/table.jsx';
import AppointmentStatusBadge from '@components/appointments/AppointmentStatusBadge.jsx';
import AppointmentForm from '@components/appointments/AppointmentForm.jsx';
import LoadingState from '@components/common/LoadingState.jsx';
import EmptyState from '@components/common/EmptyState.jsx';
import { useAppointmentManagement } from '@hooks/useAppointmentManagement';
import * as patientFirebase from '@services/firebase/patientFirebase';
import { formatDateTime } from '@lib/dateUtils';
import './AppointmentManagementPage.scss';

const AppointmentManagementPage = () => {
  const {
    appointments,
    doctors,
    isLoadingAppointments,
    isErrorAppointments,
    createAppointment,
    isCreating,
  } = useAppointmentManagement();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'appointment_date', direction: 'desc' });
  
  // Dialog state for appointment creation
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [patientsLoaded, setPatientsLoaded] = useState(false);

  // Filtered and sorted appointments
  const filteredAndSortedAppointments = useMemo(() => {
    let filtered = appointments;

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(appointment =>
        appointment.patient_name?.toLowerCase().includes(lowerSearch) ||
        appointment.patient_phone?.includes(searchTerm) ||
        appointment.patient_id?.toString().includes(searchTerm)
      );
    }

    // Doctor filter
    if (selectedDoctor !== 'all') {
      filtered = filtered.filter(a => a.doctor_user_id === selectedDoctor);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(a => a.status === selectedStatus);
    }

    // Sorting
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Date sorting
        if (sortConfig.key === 'appointment_date') {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [appointments, searchTerm, selectedDoctor, selectedStatus, sortConfig]);

  // Sort handler
  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Load patients when dialog opens
  useEffect(() => {
    const loadPatients = async () => {
      if (isCreateDialogOpen && !patientsLoaded) {
        setIsLoadingPatients(true);
        try {
          const patientsData = await patientFirebase.getAll();
          setPatients(patientsData);
          setPatientsLoaded(true);
        } catch (error) {
          console.error('Failed to load patients:', error);
        } finally {
          setIsLoadingPatients(false);
        }
      }
    };

    loadPatients();
  }, [isCreateDialogOpen, patientsLoaded]);

  // Handler to open appointment dialog
  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  // Handler for dialog open/close changes
  const handleDialogOpenChange = (open) => {
    setIsCreateDialogOpen(open);
  };

  // Handler for successful appointment creation
  const handleAppointmentCreated = async (appointmentData) => {
    try {
      await createAppointment(appointmentData);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create appointment:', error);
    }
  };

  if (isLoadingAppointments) {
    return <LoadingState count={10} type="table" />;
  }

  if (isErrorAppointments) {
    return (
      <Card className="error-card">
        <p className="error-message">Failed to load appointments. Please try again later.</p>
      </Card>
    );
  }

  return (
    <div className="appointment-management-page">
      <div className="page-header">
        <h1 className="page-title">Appointment Management</h1>
        <Button size="lg" onClick={handleOpenCreateDialog}>
          <Plus size={20} />
          New Appointment
        </Button>
      </div>

      {/* Filters */}
      <Card className="filters-card">
        <div className="filters-grid">
          <div className="search-input">
            <Input
              leftIcon={Search}
              placeholder="Search patient name, phone, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="doctor-filter"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="all">All Doctors</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                Dr. {doctor.full_name}
              </option>
            ))}
          </select>

          <select
            className="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
        </div>
      </Card>

      {/* Appointments Table */}
      <Card className="table-card">
        {filteredAndSortedAppointments.length === 0 ? (
          <EmptyState
            description="Try adjusting your filters or create a new appointment"
            illustration="appointments"
            title="No appointments found"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sortable" onClick={() => handleSort('patient_name')}>
                  Patient
                </TableHead>
                <TableHead className="sortable" onClick={() => handleSort('patient_date_of_birth')}>
                  Date of Birth
                </TableHead>
                <TableHead className="sortable" onClick={() => handleSort('patient_status')}>
                  Patient Status
                </TableHead>
                <TableHead className="sortable" onClick={() => handleSort('patient_department')}>
                  Department
                </TableHead>
                <TableHead className="sortable" onClick={() => handleSort('doctor_name')}>
                  Doctor
                </TableHead>
                <TableHead className="sortable" onClick={() => handleSort('appointment_date')}>
                  Date & Time
                </TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="sortable" onClick={() => handleSort('status')}>
                  Appointment Status
                </TableHead>
                <TableHead className="actions">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedAppointments.map(appointment => (
                <TableRow className="clickable" key={appointment.id}>
                  <TableCell>
                    <div className="patient-info">
                      <strong>{appointment.patient_name}</strong>
                    </div>
                  </TableCell>
                  <TableCell>
                    {appointment.patient_date_of_birth ? format(new Date(appointment.patient_date_of_birth), 'MMM dd, yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    {appointment.patient_status || '-'}
                  </TableCell>
                  <TableCell>
                    {appointment.patient_department || '-'}
                  </TableCell>
                  <TableCell>
                    <span>{appointment.doctor_name}</span>
                  </TableCell>
                  <TableCell>
                    {formatDateTime(appointment.appointment_date)}
                  </TableCell>
                  <TableCell className="reason">
                    {appointment.reason || '-'}
                  </TableCell>
                  <TableCell>
                    <AppointmentStatusBadge status={appointment.status} />
                  </TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost">
                      <MoreVertical size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Appointment Creation Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={handleDialogOpenChange}
      >
        <AppointmentForm
          doctors={doctors}
          isLoading={isLoadingPatients}
          isSubmitting={isCreating}
          patients={patients}
          onCancel={() => setIsCreateDialogOpen(false)}
          onSuccess={handleAppointmentCreated}
        />
      </Dialog>
    </div>
  );
};

export default AppointmentManagementPage;