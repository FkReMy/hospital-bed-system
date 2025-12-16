// src/components/layout/Sidebar.jsx
/**
 * Sidebar Component
 * 
 * Production-ready, collapsible sidebar navigation for the authenticated staff dashboard.
 * Provides role-aware navigation items with icons, labels, and active state highlighting.
 * 
 * Features:
 * - Collapsible with smooth transition
 * - Persistent open/closed state (localStorage)
 * - Role-based menu items (filtered by current role)
 * - Brand logo with light/dark variants
 * - Toggle button integration
 * - Fully accessible (ARIA labels, keyboard navigation)
 * - Premium glassmorphic design
 * 
 * Used exclusively in AppShell
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Activity,      // Dashboard
  BedDouble,     // Beds
  Users,         // Patients
  Calendar,      // Appointments
  FileText,      // Reports
  Settings,      // Settings/Profile
  LogOut,        // Logout
  ChevronLeft,   // Collapse
  ChevronRight,  // Expand
} from 'lucide-react';
import logoLight from '@assets/images/logo-light.svg';
import logoDark from '@assets/images/logo-dark.svg';
import { useAuth } from '@hooks/useAuth';
import './Sidebar.module.scss';

/**
 * Navigation configuration - defines all possible routes with role permissions
 * Must match your router paths exactly
 */
const navigationConfig = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: Activity,
    roles: ['admin', 'doctor', 'nurse', 'reception'],
  },
  {
    path: '/beds',
    label: 'Bed Management',
    icon: BedDouble,
    roles: ['admin', 'nurse', 'reception'],
  },
  {
    path: '/patients',
    label: 'Patients',
    icon: Users,
    roles: ['admin', 'doctor', 'nurse', 'reception'],
  },
  {
    path: '/appointments',
    label: 'Appointments',
    icon: Calendar,
    roles: ['admin', 'doctor', 'nurse', 'reception'],
  },
  {
    path: '/reports',
    label: 'Reports',
    icon: FileText,
    roles: ['admin'],
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: Settings,
    roles: ['admin', 'doctor', 'nurse', 'reception'],
  },
];

const Sidebar = ({ isOpen, onToggle }) => {
  const { currentRole, logout } = useAuth();

  // Filter navigation items based on current role
  const visibleNavItems = navigationConfig.filter(item =>
    item.roles.includes(currentRole)
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <aside 
      className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}
      aria-label="Main navigation"
    >
      {/* Brand Header */}
      <div className="sidebar-brand">
        <img 
          src={isOpen ? logoLight : logoDark} 
          alt="HBMS Logo" 
          className="brand-logo"
        />
        {isOpen && <span className="brand-text">HBMS</span>}
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav" aria-label="Primary navigation">
        <ul className="nav-list">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  aria-current={({ isActive }) => isActive ? 'page' : undefined}
                >
                  <Icon className="nav-icon" size={22} />
                  {isOpen && <span className="nav-label">{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Actions */}
      <div className="sidebar-footer">
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="nav-link logout-link"
          aria-label="Logout"
        >
          <LogOut className="nav-icon" size={22} />
          {isOpen && <span className="nav-label">Logout</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className="toggle-button"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={isOpen}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;