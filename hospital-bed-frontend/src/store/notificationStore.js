// src/store/notificationStore.js
/**
 * notificationStore.js (Deprecated)
 * 
 * This file is intentionally left as a deprecated stub.
 * 
 * The application has been fully migrated to a modern, scalable architecture using:
 * - React Query (@tanstack/react-query) for server state
 * - useNotificationFeed hook for all notification data and operations
 * - notificationApi service for HTTP requests
 * - Real-time updates via notificationChannel (SignalR)
 * 
 * Reasons for deprecation:
 * - Global stores introduce unnecessary complexity and stale data risks
 * - React Query provides superior caching, invalidation, loading states, and optimistic updates
 * - useNotificationFeed centralizes all notification logic with proper typing and error handling
 * - Real-time via SignalR notificationChannel eliminates need for manual store updates
 * 
 * DO NOT USE OR REVIVE THIS FILE - all notification state is now managed via:
 * - useNotificationFeed hook (notifications, unreadCount, mark read)
 * - React Query queries (automatic refetch/invalidation)
 * - notificationChannel for real-time updates
 * 
 * This file can be safely deleted once confirmed no imports remain.
 */

console.warn(
  'notificationStore.js is deprecated. ' +
  'Notification data and operations are now managed via useNotificationFeed hook and React Query.'
);

// Stub export to prevent runtime errors if accidentally imported
const notificationStore = {
  notifications: [],
  unreadCount: 0,
  addNotification: () => console.warn('notificationStore.addNotification() is deprecated'),
  markAsRead: () => console.warn('notificationStore.markAsRead() is deprecated'),
  markAllAsRead: () => console.warn('notificationStore.markAllAsRead() is deprecated'),
};

export default notificationStore;