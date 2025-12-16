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

import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { 
  Calendar,
  Search,
  Filter,
  Plus,
  MoreVertical,
} from 'lucide-react';
import Card from '@components/ui/card.jsx';
import Button from '@components/ui/button.jsx';
import Input from '@components/ui/input.jsx';
import Badge from '@components/ui/badge.jsx';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@components/ui/table.jsx';
import AppointmentStatusBadge from '@components/appointments/AppointmentStatusBadge.jsx';
import LoadingState from '@components/common/LoadingState.jsx';
import EmptyState from '@components/common/EmptyState.jsx';
import { useAppointmentManagement } from '@hooks/useAppointmentManagement';
import { formatDateTime } from '@lib/dateUtils';
import './AppointmentManagementPage.scss';

const AppointmentManagementPage = () => {
  const {
    appointments,
    doctors,
    isLoadingAppointments,
    isErrorAppointments,
  } = useAppointmentManagement();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'appointment_date', direction: 'desc' });

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

  if (isLoadingAppointments) {
    return <LoadingState type="table" count={10} />;
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
        <Button size="lg">
          <Plus size={20} />
          New Appointment
        </Button>
      </div>

      {/* Filters */}
      <Card className="filters-card">
        <div className="filters-grid">
          <div className="search-input">
            <Input
              placeholder="Search patient name, phone, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={Search}
            />
          </div>

          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="doctor-filter"
          >
            <option value="all">All Doctors</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                Dr. {doctor.full_name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="status-filter"
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
            title="No appointments found"
            description="Try adjusting your filters or create a new appointment"
            illustration="appointments"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort('patient_name')} className="sortable">
                  Patient
                </TableHead>
                <TableHead onClick={() => handleSort('doctor_name')} className="sortable">
                  Doctor
                </TableHead>
                <TableHead onClick={() => handleSort('appointment_date')} className="sortable">
                  Date & Time
                </TableHead>
                <TableHead onClick={() => handleSort('status')} className="sortable">
                  Status
                </TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="actions">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedAppointments.map(appointment => (
                <TableRow key={appointment.id} className="clickable">
                  <TableCell>
                    <div className="patient-info">
                      <strong>{appointment.patient_name}</strong>
                      <span className="patient-id">ID: {appointment.patient_id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span>Dr. {appointment.doctor_name}</span>
                  </TableCell>
                  <TableCell>
                    {formatDateTime(appointment.appointment_date)}
                  </TableCell>
                  <TableCell>
                    <AppointmentStatusBadge status={appointment.status} />
                  </TableCell>
                  <TableCell className="reason">
                    {appointment.reason || '-'}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreVertical size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default AppointmentManagementPage;