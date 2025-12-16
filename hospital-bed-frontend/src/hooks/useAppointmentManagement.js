// src/hooks/useAppointmentManagement.js
/**
 * useAppointmentManagement Hook
 * 
 * Production-ready custom hook centralizing all appointment management operations.
 * Handles fetching appointments, creating, updating, and deleting appointments,
 * and cache invalidation for real-time updates.
 * 
 * Features:
 * - Fetches appointments with optional filters
 * - Real-time cache updates on create/update/delete
 * - Error handling with toast feedback
 * - Loading states for queries and mutations
 * - Unified with React Query and toast notifications
 * - Ready for SignalR real-time push (optimistic updates)
 * 
 * Returns queries and mutations for use in AppointmentManagementPage, Dashboards, etc.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as appointmentApi from '@services/api/appointmentApi';
import toast from 'react-hot-toast';

export const useAppointmentManagement = (filters = {}) => {
  const queryClient = useQueryClient();

  // Fetch all appointments (with optional filters)
  const {
    data: appointments = [],
    isLoading: isLoadingAppointments,
    isError: isErrorAppointments,
    error: appointmentsError,
    refetch: refetchAppointments,
  } = useQuery({
    queryKey: ['appointments', filters],
    queryFn: () => appointmentApi.getAll(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: appointmentApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Appointment scheduled successfully');
      return data;
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to schedule appointment');
    },
  });

  // Update appointment mutation
  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, data }) => appointmentApi.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['appointments'] });

      // Optimistic update
      const previousAppointments = queryClient.getQueryData(['appointments', filters]);

      queryClient.setQueryData(['appointments', filters], (old = []) =>
        old.map(appointment =>
          appointment.id === id ? { ...appointment, ...data } : appointment
        )
      );

      return { previousAppointments };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousAppointments) {
        queryClient.setQueryData(['appointments', filters], context.previousAppointments);
      }
      toast.error(err.message || 'Failed to update appointment');
    },
    onSuccess: () => {
      toast.success('Appointment updated successfully');
    },
    onSettled: () => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  // Delete/cancel appointment mutation
  const deleteAppointmentMutation = useMutation({
    mutationFn: appointmentApi.deleteAppointment,
    onMutate: async (appointmentId) => {
      await queryClient.cancelQueries({ queryKey: ['appointments'] });

      const previousAppointments = queryClient.getQueryData(['appointments', filters]);

      queryClient.setQueryData(['appointments', filters], (old = []) =>
        old.filter(appointment => appointment.id !== appointmentId)
      );

      return { previousAppointments };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousAppointments) {
        queryClient.setQueryData(['appointments', filters], context.previousAppointments);
      }
      toast.error(err.message || 'Failed to cancel appointment');
    },
    onSuccess: () => {
      toast.success('Appointment cancelled successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  // Helper functions
  const createAppointment = (data) => {
    return createAppointmentMutation.mutateAsync(data);
  };

  const updateAppointment = (id, data) => {
    return updateAppointmentMutation.mutateAsync({ id, data });
  };

  const deleteAppointment = (id) => {
    return deleteAppointmentMutation.mutateAsync(id);
  };

  // Get appointments by status
  const getAppointmentsByStatus = (status) => {
    return appointments.filter(apt => apt.status === status);
  };

  // Get upcoming appointments
  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments.filter(apt => new Date(apt.appointment_date) >= now)
      .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));
  };

  // Get past appointments
  const getPastAppointments = () => {
    const now = new Date();
    return appointments.filter(apt => new Date(apt.appointment_date) < now)
      .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));
  };

  // Get today's appointments
  const getTodayAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return appointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date);
      return aptDate >= today && aptDate < tomorrow;
    });
  };

  return {
    // Queries
    appointments,
    isLoadingAppointments,
    isErrorAppointments,
    appointmentsError,
    refetchAppointments,

    // Mutations
    createAppointment,
    updateAppointment,
    deleteAppointment,
    isCreating: createAppointmentMutation.isPending,
    isUpdating: updateAppointmentMutation.isPending,
    isDeleting: deleteAppointmentMutation.isPending,

    // Helper functions
    getAppointmentsByStatus,
    getUpcomingAppointments,
    getPastAppointments,
    getTodayAppointments,
  };
};
