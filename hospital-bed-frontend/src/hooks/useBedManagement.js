// src/hooks/useBedManagement.js
/**
 * useBedManagement Hook
 * 
 * Production-ready custom hook centralizing all bed management operations.
 * Handles fetching beds, departments, rooms, assignment/discharge mutations,
 * and cache invalidation for real-time updates.
 * 
 * Features:
 * - Fetches beds with nested patient/room/department data
 * - Real-time cache updates on assign/discharge
 * - Error handling with toast feedback
 * - Loading states for queries and mutations
 * - Unified with React Query and toast notifications
 * - Ready for SignalR real-time push (optimistic updates)
 * 
 * Returns queries and mutations for use in BedManagementPage, HospitalFloorMap, etc.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bedApi } from '@services/api/bedApi';
import toast from 'react-hot-toast';

export const useBedManagement = () => {
  const queryClient = useQueryClient();

  // Fetch all beds (with nested relations)
  const {
    data: beds = [],
    isLoading: isLoadingBeds,
    isError: isErrorBeds,
    error: bedsError,
  } = useQuery({
    queryKey: ['beds'],
    queryFn: bedApi.getAll,
    staleTime: 1000 * 60 * 2, // 2 minutes - beds change infrequently
    refetchOnWindowFocus: false,
  });

  // Fetch departments (for filters/grouping)
  const {
    data: departments = [],
    isLoading: isLoadingDepartments,
  } = useQuery({
    queryKey: ['departments'],
    queryFn: bedApi.getDepartments,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // Assign bed mutation
  const assignBedMutation = useMutation({
    mutationFn: bedApi.assign,
    onMutate: async (payload) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['beds'] });

      // Optimistic update
      const previousBeds = queryClient.getQueryData(['beds']);

      queryClient.setQueryData(['beds'], (old = []) => 
        old.map(bed => 
          bed.id === payload.bed_id 
            ? { ...bed, status: 'occupied', current_patient: { id: payload.patient_id } }
            : bed
        )
      );

      return { previousBeds };
    },
    onError: (err, payload, context) => {
      // Rollback on error
      queryClient.setQueryData(['beds'], context.previousBeds);
      toast.error(err.message || 'Failed to assign bed');
    },
    onSuccess: () => {
      toast.success('Bed assigned successfully');
    },
    onSettled: () => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['beds'] });
    },
  });

  // Discharge bed mutation
  const dischargeBedMutation = useMutation({
    mutationFn: bedApi.discharge,
    onMutate: async (bedId) => {
      await queryClient.cancelQueries({ queryKey: ['beds'] });

      const previousBeds = queryClient.getQueryData(['beds']);

      queryClient.setQueryData(['beds'], (old = []) => 
        old.map(bed => 
          bed.id === bedId 
            ? { ...bed, status: 'available', current_patient: null }
            : bed
        )
      );

      return { previousBeds };
    },
    onError: (err, bedId, context) => {
      queryClient.setQueryData(['beds'], context.previousBeds);
      toast.error(err.message || 'Failed to discharge patient');
    },
    onSuccess: () => {
      toast.success('Patient discharged successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
    },
  });

  return {
    // Data
    beds,
    departments,

    // Loading & Error
    isLoadingBeds,
    isLoadingDepartments,
    isErrorBeds,
    bedsError,

    // Mutations
    assignBed: assignBedMutation.mutate,
    isAssigning: assignBedMutation.isPending,

    dischargeBed: dischargeBedMutation.mutate,
    isDischarging: dischargeBedMutation.isPending,
  };
};