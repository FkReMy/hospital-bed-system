// src/components/navigation/RoleAwareNav.jsx
/**
 * RoleAwareNav Component
 * 
 * Production-ready, reusable navigation list that filters items based on the
 * current user's role. Used primarily in the Sidebar for role-specific menu items.
 * 
 * Features:
 * - Automatically hides/shows nav items based on allowed roles
 * - Supports nested sub-menus (future-proof)
 * - Active state highlighting via NavLink
 * - Icon + label layout with collapse support
 * - Fully accessible
 * - Unified with global NavLink and Lucide icons
 * 
 * Integrates with useAuth hook for currentRole
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import './RoleAwareNav.scss';

/**
 * Props:
 * - items: Array of navigation items
 *   Each item: {
 *     path: string,
 *     label: string,
 *     icon: LucideIcon,
 *     roles: string[] - allowed roles (e.g., ['admin', 'doctor'])
 *     children?: Array - for future sub-menus
 *   }
 * - isSidebarOpen: boolean - controls label visibility
 */
const RoleAwareNav = ({ items = [], isSidebarOpen = true }) => {
  const { currentRole } = useAuth();

  // Filter items visible to current role
  const visibleItems = React.useMemo(() => {
    return items.filter(item => 
      item.roles.includes(currentRole)
    );
  }, [items, currentRole]);

  if (visibleItems.length === 0) {
    return null; // Nothing to show for this role
  }

  return (
    <nav className="role-aware-nav" aria-label="Role-based navigation">
      <ul className="nav-list">
        {visibleItems.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.path} className="nav-item">
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
                end // Matches exact path for nested routes
                aria-current={({ isActive }) => isActive ? 'page' : undefined}
              >
                {Icon && <Icon className="nav-icon" size={22} aria-hidden="true" />}
                {isSidebarOpen && (
                  <span className="nav-label">{item.label}</span>
                )}
              </NavLink>

              {/* Future: Sub-menu support */}
              {/* {item.children && isSidebarOpen && (
                <ul className="sub-nav">
                  {item.children.map(sub => (...))}
                </ul>
              )} */}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default RoleAwareNav;