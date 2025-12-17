// src/components/layout/AppShell.jsx
/**
 * AppShell Component
 * 
 * Production-ready main layout wrapper for the authenticated staff dashboard.
 * Provides consistent structure across all protected pages:
 * - Collapsible Sidebar with navigation
 * - Topbar with user info, notifications, and theme toggle
 * - Main content area with padding and scroll
 * - Mobile-responsive behavior
 * 
 * Features:
 * - Persistent sidebar state (collapsed/expanded)
 * - Role-aware navigation (via children or router)
 * - Unified with global Sidebar, Topbar components
 * - Accessible landmarks (nav, main)
 * - Glassmorphic aesthetic with premium feel
 */

import React from 'react';
import Sidebar from '@components/layout/Sidebar.jsx';
import Topbar from '@components/layout/Topbar.jsx';
import './AppShell.scss';

/**
 * Props:
 * - children: ReactNode - main page content (from router)
 * - sidebarOpen: boolean - controlled sidebar state (optional)
 * - onSidebarToggle: () => void - callback for toggle
 */
const AppShell = ({ 
  children 
}) => {
  // Sidebar collapsed state - persisted in localStorage
  const [sidebarOpen, setSidebarOpen] = React.useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved ? JSON.parse(saved) : true;
  });

  // Toggle handler with persistence
  const toggleSidebar = () => {
    setSidebarOpen(prev => {
      const newState = !prev;
      localStorage.setItem('sidebarOpen', JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - fixed position */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar} 
      />

      {/* Main layout container */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'ml-[280px]' : 'ml-20'
        }`}
      >
        {/* Topbar - sticky */}
        <Topbar 
          sidebarOpen={sidebarOpen}
          onSidebarToggle={toggleSidebar}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6" role="main">
          <div className="max-w-[1920px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
