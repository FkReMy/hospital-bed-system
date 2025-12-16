// src/main.jsx
// Application entry point - bootstraps the React app with global providers

import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App.jsx';

// Global styles - imported once here to ensure consistent application across the entire app
import '@styles/global.scss';

// Import accessibility testing tools in development
if (import.meta.env.DEV) {
  import('./lib/a11yTests.js');
}

// Create a single QueryClient instance for the entire application
// Configured for production-ready defaults with sensible caching and retry behavior
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global stale time: data is considered fresh for 5 minutes
      staleTime: 1000 * 60 * 5,
      // Retry failed queries up to 3 times (except 4xx errors)
      retry: (failureCount, error) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false; // Do not retry client errors
        }
        return failureCount < 3;
      },
      // Disable automatic refetch on window focus in production (can be overridden per-query)
      refetchOnWindowFocus: false,
      // Disable refetch on reconnect by default
      refetchOnReconnect: false,
    },
    mutations: {
      // Optional: global mutation defaults can be added here
    },
  },
});

// StrictMode is enabled in development only to help catch potential issues early
// In production, React automatically removes the double-render behavior
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element. Check if <div id="root"></div> exists in index.html');
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    {/* QueryClientProvider wraps the entire app for server-state management */}
    <QueryClientProvider client={queryClient}>
      {/* Main application component with routing, layout, auth, etc. */}
      <App />

      {/* React Query Devtools - only shown in development for debugging */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </React.StrictMode>
);