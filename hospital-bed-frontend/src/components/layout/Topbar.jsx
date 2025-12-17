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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm" role="banner">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Sidebar toggle (mobile + desktop) */}
        <div className="flex items-center gap-2">
          <Button
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="text-gray-600 hover:bg-gray-100"
            size="icon"
            variant="ghost"
            onClick={onSidebarToggle}
          >
            <Menu size={20} />
          </Button>
        </div>

        {/* Center: Spacer (for future breadcrumbs/search) */}
        <div className="flex-1">
          {/* Future: Breadcrumbs or page title can go here */}
        </div>

        {/* Right: User actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <NotificationBell />

          {/* Role Switcher (only if multiple roles) */}
          <RoleSwitcher />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-2" variant="ghost">
                <Avatar 
                  className="w-8 h-8"
                  initials={user.full_name?.slice(0, 2).toUpperCase() || 'US'}
                />
                <span className="text-sm font-medium text-gray-900 hidden md:inline">{user.full_name}</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <User className="mr-2" size={16} />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 focus:text-red-700" onClick={handleLogout}>
                <LogOut className="mr-2" size={16} />
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
