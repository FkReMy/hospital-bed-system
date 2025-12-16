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

import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingState from '@components/common/LoadingState';
import ProtectedRoute from './ProtectedRoute';

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

// Router wrapper with Suspense fallback
const AppRouter = () => (
  <Suspense fallback={<LoadingState type="full" />}>
    <Routes>
      {/* Public routes */}
      <Route element={<LandingPage />} path="/" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
      <Route element={<AccessDeniedPage />} path="/access-denied" />

      {/* Protected routes - all authenticated users */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminDashboard />} path="/dashboard" />
        <Route element={<AdminDashboard />} path="/dashboard/admin" />
        <Route element={<DoctorDashboard />} path="/dashboard/doctor" />
        <Route element={<NurseDashboard />} path="/dashboard/nurse" />
        <Route element={<ReceptionDashboard />} path="/dashboard/reception" />
        
        <Route element={<BedManagementPage />} path="/beds" />
        
        <Route element={<PatientListPage />} path="/patients" />
        <Route element={<PatientDetailPage />} path="/patients/:id" />
        
        <Route element={<AppointmentManagementPage />} path="/appointments" />
      </Route>

      {/* 404 fallback */}
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  </Suspense>
);

export default AppRouter;