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

import { ChevronDown, Shield, Stethoscope, UserPlus, User } from 'lucide-react';
import Avatar, { AvatarFallback } from '@components/ui/avatar.jsx';
import DropdownMenu from '@components/ui/dropdown-menu.jsx';
import DropdownMenuTrigger from '@components/ui/dropdown-menu-trigger.jsx';
import DropdownMenuContent from '@components/ui/dropdown-menu-content.jsx';
import DropdownMenuItem from '@components/ui/dropdown-menu-item.jsx';
import Badge from '@components/ui/badge.jsx';
import { useAuth } from '@hooks/useAuth';
import './RoleSwitcher.scss';

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
        <button className="roleSwitcherTrigger">
          <Avatar className="roleAvatar">
            <div className="avatarIcon">
              <CurrentIcon size={18} />
            </div>
            <AvatarFallback>
              {user.full_name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="roleInfo">
            <span className="currentRoleLabel">
              {currentConfig.label}
            </span>
            <Badge size="sm" variant={currentConfig.variant}>
              {currentRole.toUpperCase()}
            </Badge>
          </div>

          <ChevronDown className="chevronIcon" size={16} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="roleMenu">
        {userRoles.map((role) => {
          const config = roleConfig[role] || { icon: User, label: role };
          const RoleIcon = config.icon;

          return (
            <DropdownMenuItem
              className="roleItem"
              disabled={role === currentRole}
              key={role}
              onClick={() => handleRoleChange(role)}
            >
              <RoleIcon className="roleItemIcon" size={16} />
              <span className="roleItemLabel">{config.label}</span>
              {role === currentRole && (
                <Badge className="currentIndicator" size="sm" variant="outline">
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
