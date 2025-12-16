// src/services/realtime/notificationChannel.js
/**
 * notificationChannel Service
 * 
 * Production-ready SignalR hub connection manager for real-time notifications.
 * Handles connection lifecycle, event subscription, and integration with React Query cache.
 * 
 * Features:
 * - Automatic connection/reconnection via useWebSocket hook
 * - Subscribes to notification events (new, read, deleted)
 * - Updates notification feed cache instantly
 * - Updates unread count
 * - Toast feedback for new notifications
 * - Unified with useWebSocket and useNotificationFeed
 * 
 * Events from backend:
 * - NotificationReceived: { id, message, type, created_at }
 * - NotificationRead: { id }
 * - NotificationDeleted: { id }
 */

import { useEffect } from 'react';
import { useWebSocket } from '@hooks/useWebSocket';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const NOTIFICATION_HUB_URL = '/hubs/notification';

export const useNotificationChannel = () => {
  const { connection, isConnected, subscribe } = useWebSocket(NOTIFICATION_HUB_URL);
  const queryClient = useQueryClient();

  // Handle new notification
  const handleNotificationReceived = (notification) => {
    // Add to top of list
    queryClient.setQueryData(['notifications'], (old = []) => [
      notification,
      ...old,
    ]);

    // Show toast
    const typeMap = {
      info: 'info',
      success: 'success',
      warning: 'warning',
      error: 'error',
    };

    toast[typeMap[notification.type] || 'info'](notification.message, {
      duration: 6000,
      position: 'top-right',
    });
  };

  // Handle notification marked as read
  const handleNotificationRead = (notificationId) => {
    queryClient.setQueryData(['notifications'], (old = []) =>
      old.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  // Handle notification deleted (rare)
  const handleNotificationDeleted = (notificationId) => {
    queryClient.setQueryData(['notifications'], (old = []) =>
      old.filter((n) => n.id !== notificationId)
    );
  };

  // Subscribe to events when connected
  useEffect(() => {
    if (!isConnected || !connection) return;

    const cleanups = [
      subscribe('NotificationReceived', handleNotificationReceived),
      subscribe('NotificationRead', handleNotificationRead),
      subscribe('NotificationDeleted', handleNotificationDeleted),
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