// src/components/notifications/NotificationCenter.jsx
/**
 * NotificationCenter Component
 * 
 * Production-ready dropdown panel displaying recent notifications.
 * Triggered by NotificationBell in the Topbar.
 * 
 * Features:
 * - List of notifications with timestamp, message, and type
 * - Unread/read state with visual indicator
 * - Mark as read / Mark all as read actions
 * - Empty state when no notifications
 * - Scrollable list with max height
 * - Accessible (ARIA live region, keyboard navigation)
 * - Unified with global Card, Button, Badge, EmptyState components
 * - Premium glassmorphic dropdown design
 */

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Bell, 
  Check, 
  CheckCheck,
  AlertCircle,
  Info,
} from 'lucide-react';
import Button from '@components/ui/button.jsx';
import Card from '@components/ui/card.jsx';
import Badge from '@components/ui/badge.jsx';
import EmptyState from '@components/common/EmptyState.jsx';
import './NotificationCenter.scss';

/**
 * Props:
 * - open: boolean - controls visibility
 * - onOpenChange: (open: boolean) => void
 * - notifications: Array of notification objects
 *   { id, message, type ('info'|'success'|'warning'|'error'), created_at, read }
 * - onMarkAsRead: (id) => void
 * - onMarkAllAsRead: () => void
 */
const NotificationCenter = ({
  open,
  onOpenChange,
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeConfig = (type) => {
    switch (type) {
      case 'success':
        return { icon: CheckCheck, variant: 'success' };
      case 'warning':
        return { icon: AlertCircle, variant: 'secondary' };
      case 'error':
        return { icon: AlertCircle, variant: 'destructive' };
      default:
        return { icon: Info, variant: 'default' };
    }
  };

  if (!open) return null;

  return (
    <div className="notificationCenterPopover" role="dialog" aria-label="Notifications">
      <Card className="notificationCenter">
        {/* Header */}
        <div className="centerHeader">
          <div className="headerTitle">
            <Bell className="headerIcon" size={18} />
            <h3 className="headerText">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="unreadCount">
                {unreadCount}
              </Badge>
            )}
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="markAllRead"
            >
              <Check size={14} />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Body */}
        <div className="centerBody">
          {notifications.length === 0 ? (
            <EmptyState
              title="No notifications"
              description="You're all caught up!"
              illustration="empty-beds" // Reuse calm illustration
              className="centerEmpty"
            />
          ) : (
            <ul className="notificationList" aria-live="polite">
              {notifications.map((notification) => {
                const { icon: TypeIcon, variant } = getTypeConfig(notification.type);
                const isUnread = !notification.read;

                return (
                  <li 
                    key={notification.id} 
                    className={`notification-item ${isUnread ? 'unread' : ''}`}
                  >
                    <div className="itemIcon">
                      <div className={`icon-wrapper ${variant}`}>
                        <TypeIcon size={16} />
                      </div>
                    </div>

                    <div className="itemContent">
                      <p className="itemMessage">{notification.message}</p>
                      <time className="itemTime">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </time>
                    </div>

                    {isUnread && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onMarkAsRead(notification.id)}
                        aria-label="Mark as read"
                        className="markReadButton"
                      >
                        <Check size={14} />
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NotificationCenter;