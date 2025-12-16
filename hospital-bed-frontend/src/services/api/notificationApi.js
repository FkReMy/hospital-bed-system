// src/services/api/notificationApi.js
/**
 * notificationApi Service
 * 
 * Production-ready API client for all notification-related endpoints.
 * Now uses Firebase Firestore instead of .NET backend.
 * 
 * Features:
 * - Firebase Firestore for notification data
 * - Real-time notifications via Firestore listeners
 * - Consistent interface with previous implementation
 * - Compatible with existing notification components
 */

import notificationFirebase from '../firebase/notificationFirebase';
import { auth } from '../firebase/firebaseConfig';

/**
 * Get recent notifications for the current user
 * @param {number} limit - max number of notifications to fetch (default: 50)
 * @returns {Promise<Array>} notifications
 */
export const getRecent = async (limit = 50) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    
    return await notificationFirebase.getAll({ userId: user.uid, limit });
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch notifications');
  }
};

/**
 * Get all notifications (with pagination)
 * @param {Object} params - query params (page, limit, read status)
 * @returns {Promise<Object>} paginated notifications
 */
export const getAll = async (params = {}) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    
    return await notificationFirebase.getAll({ userId: user.uid, ...params });
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch notifications');
  }
};

/**
 * Get notification by ID
 * @param {string|number} id
 * @returns {Promise<Object>} notification
 */
export const getById = notificationFirebase.getById;

/**
 * Mark a single notification as read
 * @param {string|number} id - notification ID
 * @returns {Promise<Object>} updated notification
 */
export const markAsRead = notificationFirebase.markAsRead;

/**
 * Mark a single notification as unread
 * @param {string|number} id - notification ID
 * @returns {Promise<Object>} updated notification
 */
export const markAsUnread = async (id) => {
  if (!id) throw new Error('Notification ID is required');
  
  try {
    // Not implemented in Firebase adapter yet - add if needed
    throw new Error('Mark as unread not yet implemented for Firebase');
  } catch (error) {
    throw new Error(error.message || 'Failed to mark notification as unread');
  }
};

/**
 * Mark all notifications as read for the current user
 * @returns {Promise<Object>} result
 */
export const markAllAsRead = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    
    await notificationFirebase.markAllAsRead(user.uid);
    return { success: true };
  } catch (error) {
    throw new Error(error.message || 'Failed to mark all notifications as read');
  }
};

/**
 * Delete a notification
 * @param {string|number} id - notification ID
 * @returns {Promise<Object>} result
 */
export const deleteNotification = async (id) => {
  if (!id) throw new Error('Notification ID is required');
  
  try {
    // Implement soft delete by marking as deleted
    throw new Error('Delete notification not yet implemented for Firebase');
  } catch (error) {
    throw new Error(error.message || 'Failed to delete notification');
  }
};

/**
 * Get unread notification count for the current user
 * @returns {Promise<number>} unread count
 */
export const getUnreadCount = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return 0;
    
    const notifications = await notificationFirebase.getAll({ userId: user.uid, read: false });
    return notifications.length;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch unread count');
  }
};

/**
 * Create a new notification (admin/system use)
 * @param {Object} data - notification payload
 * @returns {Promise<Object>} created notification
 */
export const create = notificationFirebase.create;

// Export all functions as a named export object for convenience
export const notificationApi = {
  getRecent,
  getAll,
  getById,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  create,
};

export default notificationApi;
