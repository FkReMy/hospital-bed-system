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
      className={`fixed top-0 left-0 h-screen bg-white/90 backdrop-blur-md text-gray-900 flex flex-col transition-all duration-300 z-50 shadow-glass-lg ${
        isOpen ? 'w-[280px]' : 'w-20'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center px-6 py-4 gap-4 border-b border-gray-200 min-h-[72px]">
        <img 
          alt="HBMS Logo" 
          className="w-10 h-10" 
          src={logoLight}
        />
        {isOpen && <span className="font-bold text-xl text-green-600">HBMS</span>}
      </div>

      {/* Navigation List */}
      <nav aria-label="Primary navigation" className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-2 px-3">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <NavLink
                  aria-current={({ isActive }) => isActive ? 'page' : undefined}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-green-50 text-green-600 font-medium' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                  to={item.path}
                >
                  <Icon className="flex-shrink-0" size={22} />
                  {isOpen && <span className="transition-opacity duration-200">{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4 space-y-2">
        {/* Logout */}
        <button
          aria-label="Logout"
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-200"
          onClick={handleLogout}
        >
          <LogOut className="flex-shrink-0" size={22} />
          {isOpen && <span className="transition-opacity duration-200">Logout</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className="flex items-center justify-center w-full py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-200"
          onClick={onToggle}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
