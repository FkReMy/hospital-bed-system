// src/lib/systemCheck.js
/**
 * System Health Check Utility
 * 
 * Validates that all critical components, services, and routes are properly imported
 * and can be loaded without errors.
 * 
 * NOTE: This is designed to run in the BROWSER environment via window.systemCheck().
 * The relative paths are resolved by Vite's module system in the browser context.
 * For Node.js validation, use scripts/validate-imports.js instead.
 * 
 * Usage: 
 * 1. Start dev server: npm run dev
 * 2. Open browser console
 * 3. Run: window.systemCheck()
 */

// Check all critical imports
const checkImports = async () => {
  const results = {
    passed: [],
    failed: [],
  };

  const checks = [
    // Core App Components
    { name: 'App', path: '../App.jsx' },
    { name: 'Router', path: '../router/index.jsx' },
    
    // Auth & Guards
    { name: 'useAuth', path: '../hooks/useAuth.js' },
    { name: 'useAuthGuard', path: '../hooks/useAuthGuard.js' },
    { name: 'ProtectedRoute', path: '../router/ProtectedRoute.jsx' },
    
    // Pages - Auth
    { name: 'LoginPage', path: '../pages/auth/LoginPage.jsx' },
    { name: 'RegisterPage', path: '../pages/auth/RegisterPage.jsx' },
    { name: 'ChangePasswordPage', path: '../pages/auth/ChangePasswordPage.jsx' },
    
    // Pages - Dashboards
    { name: 'AdminDashboard', path: '../pages/dashboards/AdminDashboard.jsx' },
    { name: 'DoctorDashboard', path: '../pages/dashboards/DoctorDashboard.jsx' },
    { name: 'NurseDashboard', path: '../pages/dashboards/NurseDashboard.jsx' },
    { name: 'ReceptionDashboard', path: '../pages/dashboards/ReceptionDashboard.jsx' },
    
    // Pages - Features
    { name: 'BedManagementPage', path: '../pages/beds/BedManagementPage.jsx' },
    { name: 'PatientListPage', path: '../pages/patients/PatientListPage.jsx' },
    { name: 'PatientDetailPage', path: '../pages/patients/PatientDetailPage.jsx' },
    { name: 'AppointmentManagementPage', path: '../pages/appointments/AppointmentManagementPage.jsx' },
    
    // Pages - Errors
    { name: 'NotFoundPage', path: '../pages/errors/NotFoundPage.jsx' },
    { name: 'AccessDeniedPage', path: '../pages/errors/AccessDeniedPage.jsx' },
    
    // Layout Components
    { name: 'AppShell', path: '../components/layout/AppShell.jsx' },
    { name: 'Sidebar', path: '../components/layout/Sidebar.jsx' },
    { name: 'Topbar', path: '../components/layout/Topbar.jsx' },
    
    // Common Components
    { name: 'LoadingState', path: '../components/common/LoadingState.jsx' },
    { name: 'EmptyState', path: '../components/common/EmptyState.jsx' },
    
    // UI Components
    { name: 'Card', path: '../components/ui/card.jsx' },
    { name: 'Button', path: '../components/ui/button.jsx' },
    { name: 'Input', path: '../components/ui/input.jsx' },
    { name: 'Badge', path: '../components/ui/badge.jsx' },
    
    // Services - API
    { name: 'authApi', path: '../services/api/authApi.js' },
    { name: 'bedApi', path: '../services/api/bedApi.js' },
    { name: 'patientApi', path: '../services/api/patientApi.js' },
    { name: 'appointmentApi', path: '../services/api/appointmentApi.js' },
    
    // Services - Firebase
    { name: 'firebaseConfig', path: '../services/firebase/firebaseConfig.js' },
    { name: 'authFirebase', path: '../services/firebase/authFirebase.js' },
    { name: 'bedFirebase', path: '../services/firebase/bedFirebase.js' },
    
    // Hooks
    { name: 'useBedManagement', path: '../hooks/useBedManagement.js' },
    { name: 'useAppointmentManagement', path: '../hooks/useAppointmentManagement.js' },
  ];

  for (const check of checks) {
    try {
      await import(check.path);
      results.passed.push(check.name);
    } catch (error) {
      results.failed.push({ name: check.name, error: error.message });
    }
  }

  return results;
};

// Run checks and log results
export const runSystemCheck = async () => {
  console.log('🔍 Running System Health Check...\n');
  
  const startTime = performance.now();
  const results = await checkImports();
  const endTime = performance.now();
  
  console.log('✅ Passed Checks:', results.passed.length);
  results.passed.forEach(name => console.log(`   ✓ ${name}`));
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed Checks:', results.failed.length);
    results.failed.forEach(({ name, error }) => {
      console.log(`   ✗ ${name}: ${error}`);
    });
  }
  
  console.log(`\n⏱️  Completed in ${(endTime - startTime).toFixed(2)}ms`);
  console.log(`\n📊 Success Rate: ${((results.passed.length / (results.passed.length + results.failed.length)) * 100).toFixed(1)}%`);
  
  return results;
};

// Export for manual testing
if (typeof window !== 'undefined') {
  window.systemCheck = runSystemCheck;
}

export default { runSystemCheck };
