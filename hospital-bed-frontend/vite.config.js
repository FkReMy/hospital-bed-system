// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@services': path.resolve(__dirname, './src/services'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },

  server: {
    port: 3000,
    strictPort: true,
    host: true, // Allows access from local network (useful for testing on mobile/tablet)
    proxy: {
      // Proxy all API requests to the .NET backend (adjust port if needed)
      '/api': {
        target: 'https://localhost:7150', // Default ASP.NET Core HTTPS dev server port
        changeOrigin: true,
        secure: false, // Ignore self-signed cert in dev
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      // Proxy SignalR hub for real-time updates
      '/hub': {
        target: 'wss://localhost:7150',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },

  preview: {
    port: 3000,
    strictPort: true,
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react'], // If using lucide icons globally
        },
      },
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@styles/_variables.scss" as *; @use "@styles/_mixins.scss" as *;`,
        api: 'modern-compiler', // Faster SCSS compilation
      },
    },
  },
});