// src/App.jsx
// Root application component - orchestrates routing, authentication, and layout

import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Optional lightweight toast notifications (can be replaced later)
import AppRouter from './router/index.jsx';
import { AuthProvider } from './hooks/useAuth.js'; // Centralized auth context

/**
 * Main App component
 * - Wraps the entire application with essential providers
 * - Uses BrowserRouter for client-side routing
 * - Provides global auth context
 * - AppShell layout is applied only to protected routes via ProtectedRoute component
 */
function App() {
  return (
    <>
      {/* BrowserRouter enables SPA navigation */}
      <BrowserRouter>
        {/* AuthProvider manages JWT, user roles, login/logout state */}
        <AuthProvider>
          {/* AppRouter renders all routes (public and protected) */}
          {/* AppShell is applied only to protected routes in ProtectedRoute.jsx */}
          <AppRouter />

          {/* Global toast notifications - positioned top-center, auto-dismiss */}
          <Toaster
            gutter={12}
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg, #333)',
                color: 'var(--toast-color, #fff)',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#22C55E',  // Soft Green for success
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',  // Soft Red for error
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;