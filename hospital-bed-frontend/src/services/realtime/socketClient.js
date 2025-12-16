// src/services/realtime/socketClient.js
/**
 * socketClient Service (Deprecated)
 * 
 * This file is intentionally left as a deprecated stub.
 * 
 * The real-time functionality has been fully migrated to the modern,
 * secure, and production-ready SignalR implementation using:
 * - @microsoft/signalr
 * - useWebSocket hook (with httpOnly cookie auth)
 * - Specific channel hooks (bedChannel.js, notificationChannel.js)
 * 
 * Reasons for deprecation:
 * - Legacy socket.io or raw WebSocket was replaced with Microsoft SignalR
 *   (native to .NET backend)
 * - Better security: httpOnly JWT cookie authentication
 * - Automatic reconnection, hub routing, and binary support
 * - Unified connection management via useWebSocket
 * 
 * DO NOT USE THIS FILE - it will be removed in future cleanup.
 * 
 * All real-time features now use:
 * import { useWebSocket } from '@hooks/useWebSocket';
 * import { useBedChannel } from '@services/realtime/bedChannel';
 * import { useNotificationChannel } from '@services/realtime/notificationChannel';
 */

console.warn(
  'socketClient.js is deprecated and no longer used. ' +
  'Real-time features are now handled via SignalR in useWebSocket and channel hooks.'
);

const socketClient = {
  connect: () => {
    console.warn('socketClient.connect() is deprecated');
    return Promise.resolve();
  },
  disconnect: () => {
    console.warn('socketClient.disconnect() is deprecated');
  },
  on: () => {
    console.warn('socketClient.on() is deprecated');
  },
  off: () => {
    console.warn('socketClient.off() is deprecated');
  },
};

export default socketClient;