// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },

  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@router': path.resolve(__dirname, './src/router'),
      '@store': path.resolve(__dirname, './src/store'),
      '@services': path.resolve(__dirname, './src/services'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },

  server: {
    port: 5000,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: 'all',
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
    port: 5000,
    strictPort: true,
    host: '0.0.0.0',
  },

  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000, // Increase limit to 1000kB
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
        api: 'modern-compiler', // Faster SCSS compilation
      },
    },
  },
});