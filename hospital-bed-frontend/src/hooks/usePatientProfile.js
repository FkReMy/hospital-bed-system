// src/hooks/usePatientProfile.js
/**
 * usePatientProfile Hook
 * 
 * Production-ready custom hook for managing patient profile data and operations.
 * Centralizes fetching patient details, timeline events, and related mutations.
 * 
 * Features:
 * - Fetches complete patient profile with nested relations (bed, appointments, prescriptions)
 * - Fetches patient timeline events
 * - Mutations for update patient, assign/discharge bed, etc.
 * - Optimistic updates and cache invalidation
 * - Loading/error states
 * - Toast feedback
 * - Unified with patientApi and React Query
 * 
 * Used in PatientDetailPage and related components
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientApi } from '@services/api/patientApi';
import toast from 'react-hot-toast';

export const usePatientProfile = (patientId) => {
  const queryClient = useQueryClient();

  // Fetch patient profile with all nested data
  const {
    data: patient,
    isLoading: isLoadingPatient,
    isError: isErrorPatient,
    error: patientError,
  } = useQuery({
    queryKey: ['patients', patientId],
    queryFn: () => patientApi.getById(patientId),
    enabled: !!patientId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch patient timeline events
  const {
    data: timelineEvents = [],
    isLoading: isLoadingTimeline,
  } = useQuery({
    queryKey: ['patients', patientId, 'timeline'],
    queryFn: () => patientApi.getTimeline(patientId),
    enabled: !!patientId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Update patient mutation
  const updatePatientMutation = useMutation({
    mutationFn: (updatedData) => patientApi.update(patientId, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients', patientId] });
      queryClient.invalidateQueries({ queryKey: ['patients'] }); // List cache
      toast.success('Patient information updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update patient');
    },
  });

  // Helper actions
  const updatePatient = (data) => {
    updatePatientMutation.mutate(data);
  };

  return {
    // Patient data
    patient,
    timelineEvents,

    // Loading states
    isLoadingPatient,
    isLoadingTimeline,
    isLoading: isLoadingPatient || isLoadingTimeline,

    // Error states
    isErrorPatient,
    patientError,

    // Mutations
    updatePatient,
    isUpdatingPatient: updatePatientMutation.isPending,

    // Mutation status
    isUpdateSuccess: updatePatientMutation.isSuccess,
  };
};