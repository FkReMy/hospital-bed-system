// src/App.jsx
// Root application component - orchestrates routing, authentication, theme, and layout

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Optional lightweight toast notifications (can be replaced later)
import AppRouter from '@router/index.jsx';
import { AuthProvider } from '@hooks/useAuth.jsx'; // Centralized auth context
import { ThemeProvider } from '@hooks/useTheme.jsx'; // Dark/light theme support
import AppShell from '@components/layout/AppShell.jsx'; // Unified layout wrapper (sidebar, topbar, etc.)

/**
 * Main App component
 * - Wraps the entire application with essential providers
 * - Uses BrowserRouter for client-side routing
 * - Provides global auth and theme contexts
 * - Renders the unified AppShell layout with dynamic routing inside
 */
function App() {
  return (
    <React.Fragment>
      {/* BrowserRouter enables SPA navigation */}
      <BrowserRouter>
        {/* ThemeProvider manages dark/light mode across the app */}
        <ThemeProvider>
          {/* AuthProvider manages JWT, user roles, login/logout state */}
          <AuthProvider>
            {/* AppShell provides consistent layout: Sidebar, Topbar, main content area */}
            {/* All protected and public routes are rendered inside via AppRouter */}
            <AppShell>
              <AppRouter />
            </AppShell>

            {/* Global toast notifications - positioned top-center, auto-dismiss */}
            <Toaster
              position="top-center"
              reverseOrder={false}
              gutter={12}
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
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;