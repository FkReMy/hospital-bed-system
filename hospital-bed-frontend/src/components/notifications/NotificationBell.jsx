// src/components/notifications/NotificationBell.jsx
/**
 * NotificationBell Component
 * 
 * Production-ready notification bell icon with unread count badge.
 * Used in the Topbar for real-time notification indicator.
 * 
 * Features:
 * - Animated bell with subtle ring on new notifications
 * - Unread count badge (with overflow "+99")
 * - Click to open NotificationCenter (dropdown/popover)
 * - Accessible (ARIA labels, keyboard support)
 * - Unified with global Button, Badge components
 * - Premium design with pulse animation for new alerts
 * 
 * Integrates with notification store/channel for real-time updates
 */

import React from 'react';
import { Bell } from 'lucide-react';
import Button from '@components/ui/button.jsx';
import Badge from '@components/ui/badge.jsx';
import NotificationCenter from '@components/notifications/NotificationCenter.jsx';
import { useNotifications } from '@hooks/useNotifications';
import './NotificationBell.module.scss';

/**
 * Props:
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - variant: button variant (default: 'ghost')
 */
const NotificationBell = ({ 
  size = 'md', 
  variant = 'ghost' 
}) => {
  const { 
    unreadCount, 
    notifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  const [open, setOpen] = React.useState(false);

  const hasUnread = unreadCount > 0;
  const displayCount = unreadCount > 99 ? '99+' : unreadCount;

  return (
    <div className="notification-bell-container">
      <Button
        variant={variant}
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label={`Notifications${hasUnread ? `, ${unreadCount} unread` : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        className={`notification-bell ${hasUnread ? 'has-unread' : ''}`}
      >
        <Bell className="bell-icon" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
        
        {hasUnread && (
          <Badge 
            variant="destructive" 
            className="unread-badge"
            aria-hidden="true"
          >
            {displayCount}
          </Badge>
        )}

        {/* Pulse ring for new notifications */}
        {hasUnread && (
          <div className="pulse-ring" aria-hidden="true" />
        )}
      </Button>

      {/* Notification Center Dropdown */}
      <NotificationCenter
        open={open}
        onOpenChange={setOpen}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
      />
    </div>
  );
};

export default NotificationBell;