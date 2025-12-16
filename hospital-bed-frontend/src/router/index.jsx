// src/router/index.jsx
/**
 * Main Router Configuration
 * 
 * Production-ready React Router v6 configuration for the HBMS staff dashboard.
 * Defines all application routes with proper protection, lazy loading, and error handling.
 * 
 * Features:
 * - Protected routes with role-based access
 * - Lazy loading for performance
 * - Global error boundary
 * - 404 Not Found page
 * - Login route with redirect after success
 * - Unified with AuthProvider and useAuth
 * - Clean, maintainable route structure
 */

import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoadingState from '@components/common/LoadingState';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import DoctorRoute from './DoctorRoute';
import NurseRoute from './NurseRoute';
import ReceptionRoute from './ReceptionRoute';

// Lazy load pages for performance
const LoginPage = lazy(() => import('@pages/login/LoginPage'));
const DashboardPage = lazy(() => import('@pages/dashboard/DashboardPage'));
const BedManagementPage = lazy(() => import('@pages/beds/BedManagementPage'));
const PatientListPage = lazy(() => import('@pages/patients/PatientListPage'));
const PatientDetailPage = lazy(() => import('@pages/patients/PatientDetailPage'));
const AppointmentManagementPage = lazy(() => import('@pages/appointments/AppointmentManagementPage'));
const ReportsPage = lazy(() => import('@pages/reports/ReportsPage'));
const SettingsPage = lazy(() => import('@pages/settings/SettingsPage'));
const AccessDeniedPage = lazy(() => import('@pages/access-denied/AccessDeniedPage'));
const NotFoundPage = lazy(() => import('@pages/not-found/NotFoundPage'));

// Global error element
const ErrorBoundary = ({ error }) => (
  <div className="error-boundary">
    <h2>Something went wrong</h2>
    <p>{error?.message || 'Unknown error'}</p>
  </div>
);

// Router configuration
const router = createBrowserRouter([
  // Public routes
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/access-denied',
    element: <AccessDeniedPage />,
  },

  // Protected routes - all authenticated users
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'beds',
        element: <BedManagementPage />,
      },
      {
        path: 'patients',
        element: <PatientListPage />,
      },
      {
        path: 'patients/:id',
        element: <PatientDetailPage />,
      },
      {
        path: 'appointments',
        element: <AppointmentManagementPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },

  // Admin-only routes
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      // Add more admin routes here (user management, system settings, etc.)
    ],
  },

  // Doctor-specific routes (if needed beyond general access)
  {
    path: '/doctor',
    element: <DoctorRoute />,
    children: [
      // Doctor-specific views (e.g., patient rounds, prescriptions)
    ],
  },

  // Nurse-specific routes
  {
    path: '/nurse',
    element: <NurseRoute />,
    children: [
      // Nurse-specific views
    ],
  },

  // Reception-specific routes
  {
    path: '/reception',
    element: <ReceptionRoute />,
    children: [
      // Reception-specific views
    ],
  },

  // 404 fallback
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

// Router wrapper with Suspense fallback
const AppRouter = () => (
  <Suspense fallback={<LoadingState type="full" />}>
    <RouterProvider router={router} />
  </Suspense>
);

export default AppRouter;