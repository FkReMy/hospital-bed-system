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
 * - Brand logo
 * - Toggle button integration
 * - Fully accessible (ARIA labels, keyboard navigation)
 * - Premium glassmorphic design
 * 
 * Used exclusively in AppShell
 */

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
import { useAuth } from '@hooks/useAuth';
import './Sidebar.scss';

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
      aria-label="Main navigation"
      className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}
    >
      {/* Brand Header */}
      <div className="sidebarBrand">
        <img 
          alt="HBMS Logo" 
          className="brandLogo" 
          src={logoLight}
        />
        {isOpen && <span className="brandText">HBMS</span>}
      </div>

      {/* Navigation List */}
      <nav aria-label="Primary navigation" className="sidebarNav">
        <ul className="navList">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <li className="navItem" key={item.path}>
                <NavLink
                  aria-current={({ isActive }) => isActive ? 'page' : undefined}
                  className={({ isActive }) => 
                    `navLink ${isActive ? 'active' : ''}`
                  }
                  to={item.path}
                >
                  <Icon className="navIcon" size={22} />
                  {isOpen && <span className="navLabel">{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Actions */}
      <div className="sidebarFooter">
        {/* Logout */}
        <button
          aria-label="Logout"
          className="navLink logoutLink"
          onClick={handleLogout}
        >
          <LogOut className="navIcon" size={22} />
          {isOpen && <span className="navLabel">Logout</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className="toggleButton"
          onClick={onToggle}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
