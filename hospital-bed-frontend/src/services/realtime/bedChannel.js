// src/services/realtime/bedChannel.js
/**
 * bedChannel Service
 * 
 * Production-ready SignalR hub connection manager for real-time bed updates.
 * Handles connection lifecycle, event subscription, and integration with React Query cache.
 * 
 * Features:
 * - Automatic connection/reconnection via useWebSocket hook
 * - Subscribes to bed status changes (assign, discharge, status update)
 * - Optimistic cache updates for instant UI feedback
 * - Unified with useWebSocket and React Query
 * - Error handling and reconnection state
 * - Ready for multiple hubs (expandable)
 * 
 * Events from backend:
 * - BedAssigned: { bedId, patientId, patientName }
 * - BedDischarged: { bedId }
 * - BedStatusUpdated: { bedId, status }
 */

import { useEffect } from 'react';
import { useWebSocket } from '@hooks/useWebSocket';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const BED_HUB_URL = '/hubs/bed';

export const useBedChannel = () => {
  const { connection, isConnected, subscribe } = useWebSocket(BED_HUB_URL);
  const queryClient = useQueryClient();

  // Handle bed assignment update
  const handleBedAssigned = (data) => {
    queryClient.setQueryData(['beds'], (old = []) =>
      old.map((bed) =>
        bed.id === data.bedId
          ? {
              ...bed,
              status: 'occupied',
              current_patient: {
                id: data.patientId,
                full_name: data.patientName,
              },
            }
          : bed
      )
    );

    toast.success(`Bed ${data.bedNumber || data.bedId} assigned to ${data.patientName}`);
  };

  // Handle bed discharge update
  const handleBedDischarged = (data) => {
    queryClient.setQueryData(['beds'], (old = []) =>
      old.map((bed) =>
        bed.id === data.bedId
          ? {
              ...bed,
              status: 'available',
              current_patient: null,
            }
          : bed
      )
    );

    toast.success(`Bed ${data.bedNumber || data.bedId} discharged`);
  };

  // Handle bed status change (maintenance, cleaning, etc.)
  const handleBedStatusUpdated = (data) => {
    queryClient.setQueryData(['beds'], (old = []) =>
      old.map((bed) =>
        bed.id === data.bedId
          ? { ...bed, status: data.status }
          : bed
      )
    );

    const statusMap = {
      available: 'now available',
      occupied: 'now occupied',
      cleaning: 'under cleaning',
      maintenance: 'under maintenance',
    };

    toast(`Bed ${data.bedNumber || data.bedId} ${statusMap[data.status] || data.status}`);
  };

  // Subscribe to events when connected
  useEffect(() => {
    if (!isConnected || !connection) return;

    const cleanups = [
      subscribe('BedAssigned', handleBedAssigned),
      subscribe('BedDischarged', handleBedDischarged),
      subscribe('BedStatusUpdated', handleBedStatusUpdated),
    ];

    return () => {
      cleanups.forEach((cleanup) => cleanup?.());
    };
  }, [isConnected, connection, subscribe]);

  return {
    isConnected,
    connection,
  };
};