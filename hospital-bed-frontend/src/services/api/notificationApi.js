// src/services/api/notificationApi.js
/**
 * notificationApi Service
 * 
 * Production-ready API client for all notification-related endpoints.
 * Centralizes HTTP requests with proper error handling, auth, and base URL.
 * 
 * Features:
 * - Uses axiosInstance with JWT from httpOnly cookie
 * - Consistent error handling with meaningful messages
 * - Real-time notification polling and updates
 * - Mark as read/unread functionality
 * - Unified with other api services (bedApi, appointmentApi, etc.)
 * - Ready for React Query integration and SignalR real-time updates
 */

import { axiosInstance } from './axiosInstance';

/**
 * Base path for notification endpoints
 */
const BASE_PATH = '/api/notifications';

/**
 * Get recent notifications for the current user
 * @param {number} limit - max number of notifications to fetch (default: 50)
 * @returns {Promise<Array>} notifications
 */
export const getRecent = async (limit = 50) => {
  try {
    const response = await axiosInstance.get(BASE_PATH, { 
      params: { limit } 
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
  }
};

/**
 * Get all notifications (with pagination)
 * @param {Object} params - query params (page, limit, read status)
 * @returns {Promise<Object>} paginated notifications
 */
export const getAll = async (params = {}) => {
  try {
    const response = await axiosInstance.get(BASE_PATH, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
  }
};

/**
 * Get notification by ID
 * @param {string|number} id
 * @returns {Promise<Object>} notification
 */
export const getById = async (id) => {
  if (!id) throw new Error('Notification ID is required');
  
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch notification');
  }
};

/**
 * Mark a single notification as read
 * @param {string|number} id - notification ID
 * @returns {Promise<Object>} updated notification
 */
export const markAsRead = async (id) => {
  if (!id) throw new Error('Notification ID is required');
  
  try {
    const response = await axiosInstance.patch(`${BASE_PATH}/${id}/read`, { read: true });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
  }
};

/**
 * Mark a single notification as unread
 * @param {string|number} id - notification ID
 * @returns {Promise<Object>} updated notification
 */
export const markAsUnread = async (id) => {
  if (!id) throw new Error('Notification ID is required');
  
  try {
    const response = await axiosInstance.patch(`${BASE_PATH}/${id}/read`, { read: false });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to mark notification as unread');
  }
};

/**
 * Mark all notifications as read for the current user
 * @returns {Promise<Object>} result
 */
export const markAllAsRead = async () => {
  try {
    const response = await axiosInstance.post(`${BASE_PATH}/mark-all-read`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to mark all notifications as read');
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
    const response = await axiosInstance.delete(`${BASE_PATH}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete notification');
  }
};

/**
 * Get unread notification count for the current user
 * @returns {Promise<number>} unread count
 */
export const getUnreadCount = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/unread-count`);
    return response.data?.count || 0;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch unread count');
  }
};

/**
 * Create a new notification (admin/system use)
 * @param {Object} data - notification payload
 * @returns {Promise<Object>} created notification
 */
export const create = async (data) => {
  try {
    const response = await axiosInstance.post(BASE_PATH, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create notification');
  }
};

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
