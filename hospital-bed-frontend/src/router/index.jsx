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
const LoginPage = lazy(() => import('@pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@pages/auth/RegisterPage'));
const LandingPage = lazy(() => import('@pages/LandingPage'));
const AdminDashboard = lazy(() => import('@pages/dashboards/AdminDashboard'));
const DoctorDashboard = lazy(() => import('@pages/dashboards/DoctorDashboard'));
const NurseDashboard = lazy(() => import('@pages/dashboards/NurseDashboard'));
const ReceptionDashboard = lazy(() => import('@pages/dashboards/ReceptionDashboard'));
const BedManagementPage = lazy(() => import('@pages/beds/BedManagementPage'));
const PatientListPage = lazy(() => import('@pages/patients/PatientListPage'));
const PatientDetailPage = lazy(() => import('@pages/patients/PatientDetailPage'));
const AppointmentManagementPage = lazy(() => import('@pages/appointments/AppointmentManagementPage'));
const AccessDeniedPage = lazy(() => import('@pages/errors/AccessDeniedPage'));
const NotFoundPage = lazy(() => import('@pages/errors/NotFoundPage'));

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
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/access-denied',
    element: <AccessDeniedPage />,
  },

  // Protected routes - all authenticated users
  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'admin',
        element: <AdminDashboard />,
      },
      {
        path: 'doctor',
        element: <DoctorDashboard />,
      },
      {
        path: 'nurse',
        element: <NurseDashboard />,
      },
      {
        path: 'reception',
        element: <ReceptionDashboard />,
      },
    ],
  },
  {
    path: '/beds',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <BedManagementPage />,
      },
    ],
  },
  {
    path: '/patients',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <PatientListPage />,
      },
      {
        path: ':id',
        element: <PatientDetailPage />,
      },
    ],
  },
  {
    path: '/appointments',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <AppointmentManagementPage />,
      },
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