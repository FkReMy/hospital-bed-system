// src/components/layout/Topbar.jsx
/**
 * Topbar Component
 * 
 * Production-ready top navigation bar for the authenticated staff dashboard.
 * Displays current user, role switcher, notifications, and sidebar toggle.
 * 
 * Features:
 * - Responsive layout with mobile menu support
 * - User avatar with dropdown menu (profile, logout)
 * - RoleSwitcher integration for multi-role users
 * - Notification bell with badge/count
 * - Sidebar collapse/expand toggle
 * - Unified with global Avatar, Button, DropdownMenu components
 * - Premium glassmorphic design with blur
 * 
 * Used exclusively in AppShell
 */

import { 
  Menu,           // Mobile sidebar toggle
  User,           // Profile
  LogOut,
} from 'lucide-react';
import Avatar from '@components/ui/avatar.jsx';
import Button from '@components/ui/button.jsx';
import DropdownMenu from '@components/ui/dropdown-menu.jsx';
import DropdownMenuTrigger from '@components/ui/dropdown-menu-trigger.jsx';
import DropdownMenuContent from '@components/ui/dropdown-menu-content.jsx';
import DropdownMenuItem from '@components/ui/dropdown-menu-item.jsx';
import RoleSwitcher from '@components/layout/RoleSwitcher.jsx';
import { useAuth } from '@hooks/useAuth';
import NotificationBell from '@components/notifications/NotificationBell.jsx';
import './Topbar.scss';

/**
 * Props:
 * - sidebarOpen: boolean - current sidebar state
 * - onSidebarToggle: () => void - toggle callback
 */
const Topbar = ({ sidebarOpen, onSidebarToggle }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

  return (
    <header className="topbar" role="banner">
      <div className="topbarContent">
        {/* Left: Sidebar toggle (mobile + desktop) */}
        <div className="leftSection">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="sidebarToggle"
          >
            <Menu size={20} />
          </Button>
        </div>

        {/* Center: Spacer (for future breadcrumbs/search) */}
        <div className="centerSection">
          {/* Future: Breadcrumbs or page title can go here */}
        </div>

        {/* Right: User actions */}
        <div className="rightSection">
          {/* Notifications */}
          <NotificationBell />

          {/* Role Switcher (only if multiple roles) */}
          <RoleSwitcher />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="userMenuTrigger">
                <Avatar className="userAvatar">
                  <div className="avatarInitial">
                    {user.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <AvatarFallback>
                    {user.full_name?.slice(0, 2).toUpperCase() || 'USER'}
                  </AvatarFallback>
                </Avatar>
                <span className="userName">{user.full_name}</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="userMenu">
              <DropdownMenuItem>
                <User size={16} className="mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="logoutItem">
                <LogOut size={16} className="mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
