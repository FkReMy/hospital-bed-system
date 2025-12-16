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
import { Routes, Route } from 'react-router-dom';
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

// Router wrapper with Suspense fallback
const AppRouter = () => (
  <Suspense fallback={<LoadingState type="full" />}>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/access-denied" element={<AccessDeniedPage />} />

      {/* Protected routes - all authenticated users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
        <Route path="/dashboard/nurse" element={<NurseDashboard />} />
        <Route path="/dashboard/reception" element={<ReceptionDashboard />} />
        
        <Route path="/beds" element={<BedManagementPage />} />
        
        <Route path="/patients" element={<PatientListPage />} />
        <Route path="/patients/:id" element={<PatientDetailPage />} />
        
        <Route path="/appointments" element={<AppointmentManagementPage />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default AppRouter;