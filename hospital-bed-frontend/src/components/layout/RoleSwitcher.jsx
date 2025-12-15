// src/components/layout/RoleSwitcher.jsx
/**
 * RoleSwitcher Component
 * 
 * Production-ready role switcher for users with multiple roles (common in hospital systems).
 * Allows staff to temporarily switch between their assigned roles (e.g., Doctor → Nurse)
 * without logging out.
 * 
 * Features:
 * - Displays current role with avatar
 * - Dropdown list of available roles
 * - Persists selected role in context/store
 * - Accessible dropdown with keyboard support
 * - Unified with global Avatar, DropdownMenu, Badge components
 * 
 * Integrates with Auth context/store for role management
 */

import React from 'react';
import { ChevronDown, Shield, Stethoscope, UserPlus, User } from 'lucide-react';
import Avatar from '@components/ui/avatar.jsx';
import DropdownMenu from '@components/ui/dropdown-menu.jsx';
import DropdownMenuTrigger from '@components/ui/dropdown-menu-trigger.jsx';
import DropdownMenuContent from '@components/ui/dropdown-menu-content.jsx';
import DropdownMenuItem from '@components/ui/dropdown-menu-item.jsx';
import Badge from '@components/ui/badge.jsx';
import { useAuth } from '@hooks/useAuth.jsx';
import './RoleSwitcher.module.scss';

/**
 * Role configuration - maps role name to icon and color variant
 * Must match backend role names exactly
 */
const roleConfig = {
  admin: { icon: Shield, variant: 'default', label: 'Administrator' },
  doctor: { icon: Stethoscope, variant: 'default', label: 'Doctor' },
  nurse: { icon: UserPlus, variant: 'default', label: 'Nurse' },
  reception: { icon: User, variant: 'secondary', label: 'Reception' },
};

const RoleSwitcher = () => {
  const { user, currentRole, setCurrentRole, userRoles = [] } = useAuth();

  if (!user || userRoles.length <= 1) {
    // No switcher needed if user has only one role
    return null;
  }

  const currentConfig = roleConfig[currentRole] || roleConfig.reception;
  const CurrentIcon = currentConfig.icon;

  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    // Optional: toast.info(`Switched to ${roleConfig[newRole]?.label || newRole} role`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="role-switcher-trigger">
          <Avatar className="role-avatar">
            <div className="avatar-icon">
              <CurrentIcon size={18} />
            </div>
            <AvatarFallback>
              {user.full_name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="role-info">
            <span className="current-role-label">
              {currentConfig.label}
            </span>
            <Badge variant={currentConfig.variant} size="sm">
              {currentRole.toUpperCase()}
            </Badge>
          </div>

          <ChevronDown className="chevron-icon" size={16} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="role-menu">
        {userRoles.map((role) => {
          const config = roleConfig[role] || { icon: User, label: role };
          const RoleIcon = config.icon;

          return (
            <DropdownMenuItem
              key={role}
              onClick={() => handleRoleChange(role)}
              disabled={role === currentRole}
              className="role-item"
            >
              <RoleIcon className="role-item-icon" size={16} />
              <span className="role-item-label">{config.label}</span>
              {role === currentRole && (
                <Badge variant="outline" size="sm" className="current-indicator">
                  Current
                </Badge>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleSwitcher;