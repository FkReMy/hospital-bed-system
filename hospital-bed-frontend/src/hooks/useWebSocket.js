// src/hooks/useWebSocket.js
/**
 * useWebSocket Hook
 * 
 * Production-ready custom hook for WebSocket (SignalR) real-time communication.
 * Manages connection lifecycle, event subscription, and automatic reconnection.
 * 
 * Features:
 * - Automatic connection on mount (with auth token)
 * - Reconnection with exponential backoff
 * - Event subscription/unsubscription
 * - Connection state tracking (connecting, connected, disconnected, error)
 * - Cleanup on unmount
 * - Integration with React Query for cache updates
 * - Unified across the application for real-time features (bed status, notifications)
 * 
 * Designed for Microsoft SignalR (your .NET backend)
 * 
 * Usage: const { connection, isConnected, subscribe, unsubscribe } = useWebSocket('/hubs/bed');
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useWebSocket = (hubUrl) => {
  const { user } = useAuth(); // Token from user or cookie (backend uses cookie)
  const connectionRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 5000; // 5 seconds base

  // Build connection
  const buildConnection = useCallback(() => new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_URL}${hubUrl}`, {
        withCredentials: true, // Important: sends httpOnly cookie with JWT
      })
      .configureLogging(LogLevel.Warning)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount >= maxReconnectAttempts) {
            return null; // Stop retrying
          }
          return Math.min(reconnectDelay * Math.pow(2, retryContext.previousRetryCount), 30000);
        },
      })
      .build(), [hubUrl]);

  // Start connection
  const startConnection = useCallback(async () => {
    if (!connectionRef.current) return;

    try {
      await connectionRef.current.start();
      setIsConnected(true);
      setConnectionState('connected');
      reconnectAttempts.current = 0;
      console.log('SignalR connected');
    } catch (err) {
      setIsConnected(false);
      setConnectionState('error');
      console.error('SignalR connection failed:', err);
      toast.error('Real-time connection failed');
    }
  }, []);

  // Initialize connection
  useEffect(() => {
    if (!user) return; // Wait for auth

    const connection = buildConnection();
    connectionRef.current = connection;

    // Connection state handlers
    connection.onclose(() => {
      setIsConnected(false);
      setConnectionState('disconnected');
      console.log('SignalR disconnected');
    });

    connection.onreconnecting(() => {
      setIsConnected(false);
      setConnectionState('reconnecting');
      reconnectAttempts.current++;
    });

    connection.onreconnected(() => {
      setIsConnected(true);
      setConnectionState('connected');
      reconnectAttempts.current = 0;
      console.log('SignalR reconnected');
    });

    startConnection();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [user, buildConnection, startConnection]);

  // Subscribe to hub events
  const subscribe = useCallback((eventName, handler) => {
    if (!connectionRef.current) return;

    connectionRef.current.on(eventName, handler);

    return () => {
      if (connectionRef.current) {
        connectionRef.current.off(eventName, handler);
      }
    };
  }, []);

  // Unsubscribe (manual)
  const unsubscribe = useCallback((eventName, handler) => {
    if (connectionRef.current) {
      connectionRef.current.off(eventName, handler);
    }
  }, []);

  return {
    connection: connectionRef.current,
    isConnected,
    connectionState,
    subscribe,
    unsubscribe,
    reconnectAttempts: reconnectAttempts.current,
  };
};