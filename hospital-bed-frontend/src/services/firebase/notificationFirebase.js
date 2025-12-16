// src/services/firebase/notificationFirebase.js
/**
 * Firebase Notification Management Service
 * 
 * Firebase adapter for notification-related operations.
 * Replaces the .NET backend notification endpoints with Firestore.
 * 
 * Features:
 * - CRUD operations for notifications
 * - Real-time notification updates (via Firestore listeners)
 * - Compatible with existing notificationApi interface
 */

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query,
  where,
  orderBy as firestoreOrderBy,
  limit as firestoreLimit,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const NOTIFICATIONS_COLLECTION = 'notifications';

/**
 * Get all notifications for a user
 * @param {Object} params - optional filters (userId, read, limit)
 * @returns {Promise<Array>} notifications
 */
export const getAll = async (params = {}) => {
  try {
    let notificationsQuery = collection(db, NOTIFICATIONS_COLLECTION);
    
    const constraints = [];
    
    if (params.userId) {
      constraints.push(where('user_id', '==', params.userId));
    }
    if (params.read !== undefined) {
      constraints.push(where('read', '==', params.read));
    }
    
    constraints.push(firestoreOrderBy('created_at', 'desc'));
    
    if (params.limit) {
      constraints.push(firestoreLimit(parseInt(params.limit)));
    }
    
    if (constraints.length > 0) {
      notificationsQuery = query(notificationsQuery, ...constraints);
    }

    const snapshot = await getDocs(notificationsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Get notifications error:', error);
    throw new Error(error.message || 'Failed to fetch notifications');
  }
};

/**
 * Get notification by ID
 * @param {string} id
 * @returns {Promise<Object>} notification
 */
export const getById = async (id) => {
  if (!id) throw new Error('Notification ID is required');
  
  try {
    const notificationDoc = await getDoc(doc(db, NOTIFICATIONS_COLLECTION, id));
    
    if (!notificationDoc.exists()) {
      throw new Error('Notification not found');
    }

    return { id: notificationDoc.id, ...notificationDoc.data() };
  } catch (error) {
    console.error('Get notification error:', error);
    throw new Error(error.message || 'Failed to fetch notification');
  }
};

/**
 * Create new notification
 * @param {Object} data - notification payload
 * @returns {Promise<Object>} created notification
 */
export const create = async (data) => {
  try {
    const notificationRef = doc(collection(db, NOTIFICATIONS_COLLECTION));
    
    const newNotification = {
      ...data,
      read: false,
      created_at: Timestamp.now(),
    };

    await setDoc(notificationRef, newNotification);

    return { id: notificationRef.id, ...newNotification };
  } catch (error) {
    console.error('Create notification error:', error);
    throw new Error(error.message || 'Failed to create notification');
  }
};

/**
 * Mark notification as read
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const markAsRead = async (id) => {
  if (!id) throw new Error('Notification ID is required');
  
  try {
    const notificationRef = doc(db, NOTIFICATIONS_COLLECTION, id);
    const notificationDoc = await getDoc(notificationRef);
    
    if (!notificationDoc.exists()) {
      throw new Error('Notification not found');
    }

    await updateDoc(notificationRef, {
      read: true,
      read_at: Timestamp.now(),
    });

    return { id, read: true };
  } catch (error) {
    console.error('Mark notification as read error:', error);
    throw new Error(error.message || 'Failed to mark notification as read');
  }
};

/**
 * Mark all notifications as read for a user
 * @param {string} userId
 * @returns {Promise<void>}
 */
export const markAllAsRead = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  
  try {
    const notificationsQuery = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('user_id', '==', userId),
      where('read', '==', false)
    );

    const snapshot = await getDocs(notificationsQuery);
    
    const updatePromises = snapshot.docs.map(doc => 
      updateDoc(doc.ref, {
        read: true,
        read_at: Timestamp.now(),
      })
    );

    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    throw new Error(error.message || 'Failed to mark all notifications as read');
  }
};

/**
 * Subscribe to real-time notifications for a user
 * @param {string} userId
 * @param {Function} callback - called when notifications change
 * @returns {Function} unsubscribe function
 */
export const subscribeToNotifications = (userId, callback) => {
  if (!userId) throw new Error('User ID is required');
  
  try {
    const notificationsQuery = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('user_id', '==', userId),
      firestoreOrderBy('created_at', 'desc'),
      firestoreLimit(50)
    );

    return onSnapshot(notificationsQuery, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(notifications);
    }, (error) => {
      console.error('Notification subscription error:', error);
    });
  } catch (error) {
    console.error('Subscribe to notifications error:', error);
    throw new Error(error.message || 'Failed to subscribe to notifications');
  }
};

// Export as named object and default
export const notificationFirebase = {
  getAll,
  getById,
  create,
  markAsRead,
  markAllAsRead,
  subscribeToNotifications,
};

export default notificationFirebase;
