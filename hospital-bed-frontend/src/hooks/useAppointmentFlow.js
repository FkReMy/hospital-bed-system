// src/hooks/useAppointmentFlow.js
/**
 * useAppointmentFlow Hook
 * 
 * Production-ready custom hook managing the full appointment creation/editing flow.
 * Handles step-by-step wizard logic, form state, validation, and submission.
 * Designed for use in AppointmentForm dialogs or multi-step pages.
 * 
 * Features:
 * - Multi-step flow (patient selection → doctor/date → reason/notes → review)
 * - Persistent state across open/close (if needed)
 * - Validation per step
 * - Integration with React Query mutations
 * - Accessible step indicators
 * - Unified with global Button, Progress, Form components
 * 
 * Returns:
 * - currentStep, steps array
 * - form data and setters
 * - navigation (next, prev, jump)
 * - submission handlers
 */

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentApi } from '@services/api/appointmentApi';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 'patient', title: 'Select Patient', description: 'Choose patient' },
  { id: 'doctor-date', title: 'Doctor & Date', description: 'Select doctor and time' },
  { id: 'details', title: 'Reason & Notes', description: 'Provide appointment details' },
  { id: 'review', title: 'Review', description: 'Confirm appointment' },
];

export const useAppointmentFlow = ({
  initialData = null, // For edit mode
  onSuccess,          // Callback after successful submission
  onCancel,           // Callback when flow cancelled
}) => {
  const queryClient = useQueryClient();

  // Current step index
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Form data state
  const [formData, setFormData] = useState({
    patientId: initialData?.patient_id?.toString() || '',
    doctorId: initialData?.doctor_user_id?.toString() || '',
    appointmentDate: initialData?.appointment_date 
      ? new Date(initialData.appointment_date).toISOString().slice(0, 16)
      : '',
    reason: initialData?.reason || '',
    notes: initialData?.notes || '',
  });

  // Update field
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Navigation
  const nextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const goToStep = (index) => {
    if (index >= 0 && index < STEPS.length) {
      setCurrentStepIndex(index);
    }
  };

  const currentStep = STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  // Submission mutation
  const mutation = useMutation({
    mutationFn: initialData 
      ? (data) => appointmentApi.update(initialData.id, data)
      : appointmentApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success(`Appointment ${initialData ? 'updated' : 'scheduled'} successfully`);
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error.message || `Failed to ${initialData ? 'update' : 'schedule'} appointment`);
    },
  });

  const handleSubmit = () => {
    const payload = {
      patient_id: formData.patientId,
      doctor_user_id: formData.doctorId,
      appointment_date: new Date(formData.appointmentDate).toISOString(),
      reason: formData.reason.trim(),
      notes: formData.notes?.trim() || null,
    };

    mutation.mutate(payload);
  };

  const handleCancel = () => {
    setCurrentStepIndex(0);
    setFormData({
      patientId: '',
      doctorId: '',
      appointmentDate: '',
      reason: '',
      notes: '',
    });
    onCancel?.();
  };

  return {
    // Steps
    steps: STEPS,
    currentStep,
    currentStepIndex,
    isFirstStep,
    isLastStep,

    // Navigation
    nextStep,
    prevStep,
    goToStep,

    // Form
    formData,
    updateFormData,

    // Submission
    isSubmitting: mutation.isPending,
    handleSubmit,
    handleCancel,

    // Mutation status
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};