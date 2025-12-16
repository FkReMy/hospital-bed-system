// src/App.jsx
// Root application component - orchestrates routing, authentication, and layout

import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Optional lightweight toast notifications (can be replaced later)
import AppRouter from './router/index.jsx';
import { AuthProvider } from './hooks/useAuth.js'; // Centralized auth context
import AppShell from './components/layout/AppShell.jsx'; // Unified layout wrapper (sidebar, topbar, etc.)

/**
 * Main App component
 * - Wraps the entire application with essential providers
 * - Uses BrowserRouter for client-side routing
 * - Provides global auth context
 * - Renders the unified AppShell layout with dynamic routing inside
 */
function App() {
  return (
    <>
      {/* BrowserRouter enables SPA navigation */}
      <BrowserRouter>
        {/* AuthProvider manages JWT, user roles, login/logout state */}
        <AuthProvider>
          {/* AppShell provides consistent layout: Sidebar, Topbar, main content area */}
          {/* All protected and public routes are rendered inside via AppRouter */}
          <AppShell>
            <AppRouter />
          </AppShell>

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