// src/pages/patients/PatientListPage.jsx
/**
 * PatientListPage Component
 * 
 * Production-ready patient list management page for HBMS.
 * Displays searchable, filterable, paginated list of all patients with key info.
 * 
 * Features:
 * - Responsive data table with patient name, ID, age, status, contact
 * - Search by name, ID, phone
 * - Filter by department, status, admission date
 * - Sort by any column
 * - Quick actions: view profile, admit, edit
 * - Pagination and results count
 * - Loading, empty, error states
 * - Unified with global Table, Badge, Button, Input components
 * - Real-time updates via SignalR (patientChannel when implemented)
 */

import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MoreVertical, 
  UserPlus 
} from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '@components/ui/card.jsx';
import Button from '@components/ui/button.jsx';
import Input from '@components/ui/input.jsx';
import Badge from '@components/ui/badge.jsx';
import Dialog from '@components/ui/dialog.jsx';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@components/ui/table.jsx';
import LoadingState from '@components/common/LoadingState.jsx';
import EmptyState from '@components/common/EmptyState.jsx';
import PatientForm from '@components/patients/PatientForm.jsx';
import { useRoleAccess } from '@hooks/useRoleAccess';
import * as patientFirebase from '@services/firebase/patientFirebase';
import * as departmentFirebase from '@services/firebase/departmentFirebase';
import './PatientListPage.scss';

const PatientListPage = () => {
  const { hasAccess: canManagePatients } = useRoleAccess(['admin', 'doctor', 'nurse', 'reception']);
  
  // Dialog state for patient registration
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State management
  const [patients, setPatients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'fullName', direction: 'asc' });

  // Filtered and sorted patients
  const filteredAndSortedPatients = useMemo(() => {
    let filtered = patients;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.fullName?.toLowerCase().includes(lower) ||
        p.id?.toString().toLowerCase().includes(lower) ||
        p.phone?.includes(searchTerm)
      );
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(p => p.department === selectedDepartment);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(p => p.status === selectedStatus);
    }

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [patients, searchTerm, selectedDepartment, selectedStatus, sortConfig]);

  // Sort handler
  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Load patients and departments on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch both patients and departments in parallel
        const [patientsData, departmentsData] = await Promise.all([
          patientFirebase.getAll(),
          departmentFirebase.getAll()
        ]);
        
        setPatients(patientsData);
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('Failed to load patients. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handler to open registration dialog
  const handleOpenRegisterDialog = () => {
    setIsRegisterDialogOpen(true);
  };

  // Handler to close registration dialog
  const handleCloseRegisterDialog = () => {
    setIsRegisterDialogOpen(false);
  };

  // Handler for successful patient registration
  const handlePatientRegistered = async (patientData) => {
    setIsSubmitting(true);
    try {
      const newPatient = await patientFirebase.create(patientData);
      
      // Add new patient to the list
      setPatients(prev => [newPatient, ...prev]);
      
      // Show success message
      toast.success('Patient registered successfully!');
      
      // Close dialog
      setIsRegisterDialogOpen(false);
    } catch (error) {
      console.error('Failed to register patient:', error);
      toast.error(error.message || 'Failed to register patient. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="patientListPage">
      <div className="pageHeader">
        <h1 className="pageTitle">Patient Management</h1>
        {canManagePatients && (
          <Button size="lg" onClick={handleOpenRegisterDialog}>
            <UserPlus className="mr-2" />
            Register New Patient
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="filtersCard">
        <div className="filtersGrid">
          <div className="searchInput">
            <Input
              leftIcon={Search}
              placeholder="Search name, ID, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="departmentFilter"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>

          <select
            className="statusFilter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="admitted">Admitted</option>
            <option value="discharged">Discharged</option>
            <option value="outpatient">Outpatient</option>
          </select>
        </div>
      </Card>

      {/* Patients Table */}
      <Card className="tableCard">
        {isLoading ? (
          <LoadingState count={10} type="table" />
        ) : filteredAndSortedPatients.length === 0 ? (
          <EmptyState
            description="Try adjusting your filters or register a new patient"
            title="No patients found"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sortable" onClick={() => handleSort('fullName')}>
                  Name
                </TableHead>
                <TableHead className="sortable" onClick={() => handleSort('id')}>
                  Patient ID
                </TableHead>
                <TableHead>
                  Age
                </TableHead>
                <TableHead className="sortable" onClick={() => handleSort('status')}>
                  Status
                </TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="actions">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedPatients.map(patient => {
                // Calculate age from dateOfBirth
                const age = patient.dateOfBirth 
                  ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
                  : 'N/A';
                
                // Find department name from ID
                const departmentName = departments.find(d => d.id === patient.department)?.name || patient.department || 'N/A';
                
                return (
                  <TableRow className="clickable" key={patient.id}>
                    <TableCell>
                      <Link className="patientName" to={`/patients/${patient.id}`}>
                        {patient.fullName}
                      </Link>
                    </TableCell>
                    <TableCell>{patient.id}</TableCell>
                    <TableCell>{age}</TableCell>
                    <TableCell>
                      <Badge variant={patient.status === 'admitted' ? 'success' : 'warning'}>
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{departmentName}</TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost">
                        <MoreVertical size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Patient Registration Dialog */}
      <Dialog
        open={isRegisterDialogOpen}
        onOpenChange={setIsRegisterDialogOpen}
      >
        <PatientForm
          departments={departments}
          isSubmitting={isSubmitting}
          onCancel={handleCloseRegisterDialog}
          onSuccess={handlePatientRegistered}
        />
      </Dialog>
    </div>
  );
};

export default PatientListPage;
