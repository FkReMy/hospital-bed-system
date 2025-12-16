// src/services/api/axiosInstance.js
/**
 * axiosInstance Configuration
 * 
 * Production-ready centralized Axios instance for all API requests.
 * 
 * Features:
 * - Base URL from VITE environment
 * - JSON content-type header
 * - withCredentials: true → sends httpOnly JWT cookie automatically
 * - Request/response interceptors for auth, errors, loading
 * - Global error handling with toast notifications
 * - 401 auto-redirect to login
 * - Unified across all api services (authApi, bedApi, patientApi, etc.)
 * - Secure: no manual token handling
 */

import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Critical: sends httpOnly cookie with every request
  timeout: 30000, // 30 second timeout
});

// Request interceptor - add auth, logging
axiosInstance.interceptors.request.use(
  (config) => {
    // Can add global headers here if needed in future
    // console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Successful response
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';

    // Handle specific status codes
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      toast.error('Session expired. Please log in again.');
      
      // Clear any cached auth data
      if (typeof window !== 'undefined') {
        // Use navigate if available, fallback to window location
        const navigate = window.navigate || (() => window.location.href = '/login');
        navigate('/login');
      }
    } else if (error.response?.status === 403) {
      toast.error('Access denied');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.status >= 400) {
      toast.error(message);
    } else if (error.code === 'ERR_NETWORK') {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error(message);
    }

    console.error('API Error:', error.response?.status, error.response?.data || error.message);

    return Promise.reject(error);
  }
);

export { axiosInstance };
export default axiosInstance;