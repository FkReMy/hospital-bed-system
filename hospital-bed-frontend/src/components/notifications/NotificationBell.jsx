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
import './NotificationBell.scss';

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
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Notifications${hasUnread ? `, ${unreadCount} unread` : ''}`}
        className={`notification-bell ${hasUnread ? 'has-unread' : ''}`}
        size="icon"
        variant={variant}
        onClick={() => setOpen(!open)}
      >
        <Bell className="bell-icon" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
        
        {hasUnread && (
          <Badge 
            aria-hidden="true" 
            className="unread-badge"
            variant="destructive"
          >
            {displayCount}
          </Badge>
        )}

        {/* Pulse ring for new notifications */}
        {hasUnread && (
          <div aria-hidden="true" className="pulse-ring" />
        )}
      </Button>

      {/* Notification Center Dropdown */}
      <NotificationCenter
        notifications={notifications}
        open={open}
        onMarkAllAsRead={markAllAsRead}
        onMarkAsRead={markAsRead}
        onOpenChange={setOpen}
      />
    </div>
  );
};

export default NotificationBell;