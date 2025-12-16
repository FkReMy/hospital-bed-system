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
    <div aria-label="Notifications" className="notification-center-popover" role="dialog">
      <Card className="notification-center">
        {/* Header */}
        <div className="center-header">
          <div className="header-title">
            <Bell className="header-icon" size={18} />
            <h3 className="header-text">Notifications</h3>
            {unreadCount > 0 && (
              <Badge className="unread-count" variant="destructive">
                {unreadCount}
              </Badge>
            )}
          </div>

          {unreadCount > 0 && (
            <Button
              className="mark-all-read"
              size="sm"
              variant="ghost"
              onClick={onMarkAllAsRead}
            >
              <Check size={14} />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Body */}
        <div className="center-body">
          {notifications.length === 0 ? (
            <EmptyState
              className="center-empty"
              description="You're all caught up!"
              illustration="empty-beds" // Reuse calm illustration
              title="No notifications"
            />
          ) : (
            <ul aria-live="polite" className="notification-list">
              {notifications.map((notification) => {
                const { icon: TypeIcon, variant } = getTypeConfig(notification.type);
                const isUnread = !notification.read;

                return (
                  <li 
                    className={`notification-item ${isUnread ? 'unread' : ''}`} 
                    key={notification.id}
                  >
                    <div className="item-icon">
                      <div className={`icon-wrapper ${variant}`}>
                        <TypeIcon size={16} />
                      </div>
                    </div>

                    <div className="item-content">
                      <p className="item-message">{notification.message}</p>
                      <time className="item-time">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </time>
                    </div>

                    {isUnread && (
                      <Button
                        aria-label="Mark as read"
                        className="mark-read-button"
                        size="icon"
                        variant="ghost"
                        onClick={() => onMarkAsRead(notification.id)}
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