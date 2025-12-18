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

// src/hooks/useBedManagement.js
import { useEffect } from 'react'; // Add useEffect
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bedApi } from '@services/api/bedApi';
import { patientApi } from '@services/api/patientApi';
import toast from 'react-hot-toast';

export const useBedManagement = () => {
  const queryClient = useQueryClient();

  // 1. Initial Fetch (Static)
  const {
    data: beds = [],
    isLoading: isLoadingBeds,
    isError: isErrorBeds,
    error: bedsError,
  } = useQuery({
    queryKey: ['beds'],
    queryFn: bedApi.getAll,
    staleTime: Infinity, // Rely on real-time updates instead of refetching
    refetchOnWindowFocus: false,
  });

  // 2. Real-time Subscription
  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = bedApi.subscribeToBeds((updatedBeds) => {
      // Directly update React Query cache with fresh data from Firestore
      queryClient.setQueryData(['beds'], updatedBeds);
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, [queryClient]);

  const {
    data: departments = [],
    isLoading: isLoadingDepartments,
  } = useQuery({
    queryKey: ['departments'],
    queryFn: bedApi.getDepartments,
    staleTime: 1000 * 60 * 30,
  });

  // Fetch available patients for bed assignment
  const {
    data: patients = [],
    isLoading: isLoadingPatients,
  } = useQuery({
    queryKey: ['patients'],
    queryFn: patientApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Assign bed mutation
  const assignBedMutation = useMutation({
    mutationFn: bedApi.assign,
    onSuccess: () => {
      toast.success('Bed assigned successfully');
      // No need to invalidate queries; onSnapshot will catch the change automatically
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to assign bed');
    },
  });

  // Discharge bed mutation
  const dischargeBedMutation = useMutation({
    mutationFn: bedApi.discharge,
    onSuccess: () => {
      toast.success('Patient discharged successfully');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to discharge patient');
    },
  });

  return {
    beds,
    departments,
    patients,
    isLoadingBeds,
    isLoadingDepartments,
    isLoadingPatients,
    isErrorBeds,
    bedsError,
    assignBed: assignBedMutation.mutate,
    isAssigning: assignBedMutation.isPending,
    dischargeBed: dischargeBedMutation.mutate,
    isDischarging: dischargeBedMutation.isPending,
  };
};