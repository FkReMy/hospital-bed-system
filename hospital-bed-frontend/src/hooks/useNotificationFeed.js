// src/hooks/useNotificationFeed.js
/**
 * useNotificationFeed Hook
 * 
 * Production-ready custom hook managing the real-time notification feed.
 * Handles fetching, polling, marking read, and integrating with SignalR (when added).
 * 
 * Features:
 * - Fetches recent notifications with pagination
 * - Polling fallback (every 30s) if SignalR not connected
 * - Mark as read / mark all as read mutations
 * - Unread count calculation
 * - Cache integration with React Query
 * - Toast feedback on actions
 * - Unified with notificationApi and global toast
 * - Ready for SignalR real-time push
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@services/api/notificationApi';
import toast from 'react-hot-toast';

export const useNotificationFeed = ({
  limit = 50,           // Max notifications to fetch
  pollInterval = 30000, // 30 seconds polling fallback
} = {}) => {
  const queryClient = useQueryClient();

  // Fetch notifications
  const {
    data: notifications = [],
    isLoading: isLoadingNotifications,
    isError: isErrorNotifications,
    error: notificationsError,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getRecent(limit),
    staleTime: 1000 * 60 * 1, // 1 minute
    refetchInterval: pollInterval,
    refetchOnWindowFocus: true,
  });

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark single notification as read
  const markAsReadMutation = useMutation({
    mutationFn: notificationApi.markAsRead,
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      const previousNotifications = queryClient.getQueryData(['notifications']);

      queryClient.setQueryData(['notifications'], (old = []) =>
        old.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );

      return { previousNotifications };
    },
    onError: (err, notificationId, context) => {
      queryClient.setQueryData(['notifications'], context.previousNotifications);
      toast.error('Failed to mark notification as read');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      const previousNotifications = queryClient.getQueryData(['notifications']);

      queryClient.setQueryData(['notifications'], (old = []) =>
        old.map(n => ({ ...n, read: true }))
      );

      return { previousNotifications };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(['notifications'], context.previousNotifications);
      toast.error('Failed to mark all as read');
    },
    onSuccess: () => {
      toast.success('All notifications marked as read');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Public actions
  const markAsRead = (notificationId) => {
    markAsReadMutation.mutate(notificationId);
  };

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  return {
    // Data
    notifications,
    unreadCount,

    // Loading & Error
    isLoadingNotifications,
    isErrorNotifications,
    notificationsError,

    // Actions
    markAsRead,
    isMarkingAsRead: markAsReadMutation.isPending,

    markAllAsRead,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
  };
};