// src/components/beds/AssignBedDialog.jsx
/**
 * AssignBedDialog Component
 * 
 * Production-ready dialog for assigning a patient to an available bed.
 * Used in BedManagementPage, HospitalFloorMap, and BedCard actions.
 * 
 * Features:
 * - Patient search/select (async with debounce)
 * - Bed confirmation with current status
 * - Optional notes field
 * - Validation and submission states
 * - Accessible form with clear feedback
 * - Unified with global components (Dialog, Input, Select, Textarea, Button, Badge)
 * 
 * Integrates with TanStack Query mutation for bed assignment API call
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { User, BedDouble, NotepadText, AlertCircle } from 'lucide-react';
import Dialog from '@components/ui/dialog.jsx';
import DialogContent from '@components/ui/dialog-content.jsx';
import DialogHeader from '@components/ui/dialog-header.jsx';
import DialogTitle from '@components/ui/dialog-title.jsx';
import DialogDescription from '@components/ui/dialog-description.jsx';
import DialogFooter from '@components/ui/dialog-footer.jsx';
import Label from '@components/ui/label.jsx';
import Textarea from '@components/ui/textarea.jsx';
import Button from '@components/ui/button.jsx';
import BedStatusBadge from '@components/beds/BedStatusBadge.jsx';
import './AssignBedDialog.scss';

/**
 * Validation schema - ensures valid patient selection and notes
 */
const assignBedSchema = z.object({
  patientId: z.string().min(1, 'Patient selection is required'),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

/**
 * Props:
 * - bed: The selected bed object (must include id, bed_number, room_number, status, department)
 * - open: boolean - controls dialog visibility
 * - onOpenChange: (open: boolean) => void
 * - onSuccess: (assignmentData) => void - called after successful assignment
 * - patients: Array of available patients (for search/select)
 * - isSubmitting: boolean
 */
const AssignBedDialog = ({
  bed,
  open = false,
  onOpenChange,
  onSuccess,
  patients = [],
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(assignBedSchema),
    defaultValues: {
      patientId: '',
      notes: '',
    },
  });

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  // Filter patients by department to match the bed's department
  // Note: Patients without a department assignment are excluded to ensure proper department matching
  const eligiblePatients = React.useMemo(() => {
    if (!bed?.department_id) {
      return patients;
    }
    
    // Only show patients that have a department AND it matches the bed's department
    return patients.filter(patient => patient.department === bed.department_id);
  }, [patients, bed]);
  
  const selectedPatientId = watch('patientId');
  
  // Find selected patient to show department mismatch warning
  const selectedPatient = React.useMemo(
    () => patients.find(p => p.id === selectedPatientId),
    [patients, selectedPatientId]
  );
  
  const departmentMismatch = React.useMemo(() => {
    if (!selectedPatient || !bed?.department_id) return false;
    const patientDept = selectedPatient.department;
    // Only show warning if patient has a department AND it doesn't match bed's department
    return patientDept && patientDept !== bed.department_id;
  }, [selectedPatient, bed]);

  const onSubmit = (data) => {
    const assignmentPayload = {
      bed_id: bed.id,
      patient_id: data.patientId,
      assigned_at: new Date().toISOString(),
      notes: data.notes?.trim() || null,
    };

    // In real usage: pass to mutation.mutate(assignmentPayload)
    onSuccess?.(assignmentPayload);
  };

  if (!bed) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="assignBedDialog max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Bed to Patient</DialogTitle>
          <DialogDescription>
            Select a patient and add optional notes for bed assignment.
          </DialogDescription>
        </DialogHeader>

        {/* Bed Information Summary */}
        <div className="bedSummary space-y-4 p-4 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BedDouble className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold text-lg">{bed.bed_number}</p>
                <p className="text-sm text-muted-foreground">
                  Room {bed.room_number} • {bed.department?.name || 'Unknown Department'}
                </p>
              </div>
            </div>
            <BedStatusBadge status={bed.status} />
          </div>

          {bed.status !== 'available' && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              This bed is currently not available for assignment.
            </div>
          )}
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Patient Selection */}
          <div className="space-y-2">
            <Label required htmlFor="patientId">
              <User className="inline w-4 h-4 mr-2" />
              Patient
            </Label>
            <select
              id="patientId"
              {...register('patientId')}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              disabled={isSubmitting || bed.status !== 'available'}
            >
              <option value="">Select a patient...</option>
              {eligiblePatients.map((patient) => {
                const name = patient.fullName || patient.full_name;
                const dob = patient.dateOfBirth || patient.date_of_birth;
                const dept = patient.department;
                let dobText = '';
                if (dob) {
                  try {
                    dobText = ` (DOB: ${format(new Date(dob), 'MMM dd, yyyy')})`;
                  } catch {
                    // Skip invalid date - don't show DOB for malformed dates
                  }
                }
                let deptText = '';
                if (dept) {
                  deptText = ` - ${dept}`;
                }
                return (
                  <option key={patient.id} value={patient.id}>
                    {name}{dobText}{deptText}
                  </option>
                );
              })}
            </select>
            {errors.patientId && (
              <p className="text-sm text-destructive">{errors.patientId.message}</p>
            )}
            {eligiblePatients.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No patients available in {bed.department?.name || 'this department'}.
                Patients must be in the same department as the bed.
              </p>
            )}
            {departmentMismatch && (
              <div className="flex items-center gap-2 text-destructive text-sm p-2 bg-destructive/10 rounded">
                <AlertCircle className="w-4 h-4" />
                Warning: Selected patient&apos;s department does not match the bed&apos;s department.
              </div>
            )}
          </div>

          {/* Assignment Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">
              <NotepadText className="inline w-4 h-4 mr-2" />
              Assignment Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              {...register('notes')}
              disabled={isSubmitting}
              placeholder="e.g., Patient requires monitoring every 4 hours..."
              rows={3}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              disabled={isSubmitting}
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={bed.status !== 'available' || isSubmitting}
              isLoading={isSubmitting}
              type="submit"
            >
              Assign Bed
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignBedDialog;
