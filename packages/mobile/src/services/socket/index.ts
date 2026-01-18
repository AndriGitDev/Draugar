import { io, Socket } from 'socket.io-client';
import { getToken } from '../../utils/storage';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  EncryptedPayload,
  Location,
} from '@draugar/shared';
import { encryptLocation, decryptLocation } from '../../crypto';

type DraugarSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: DraugarSocket | null = null;
let ghostMode = false;

// Callbacks for location updates from other family members
type LocationCallback = (userId: string, userName: string, location: Location) => void;
const locationCallbacks: Set<LocationCallback> = new Set();

export function onFamilyLocationUpdate(callback: LocationCallback): () => void {
  locationCallbacks.add(callback);
  return () => locationCallbacks.delete(callback);
}

export async function connectSocket(serverUrl: string): Promise<boolean> {
  console.log('[socket] connectSocket called with URL:', serverUrl);

  const token = await getToken();
  if (!token) {
    console.error('[socket] No auth token found in SecureStore');
    return false;
  }
  console.log('[socket] Token retrieved, length:', token.length);

  console.log('[socket] Creating socket.io connection to', serverUrl);

  socket = io(serverUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('[socket] Connected');
    socket?.emit('location:subscribe');
  });

  socket.on('disconnect', (reason) => {
    console.log('[socket] Disconnected:', reason);
  });

  socket.on('location:broadcast', async ({ senderId, senderName, payload }) => {
    console.log('[socket] Received location:broadcast from', senderName);
    // Decrypt the location from another family member
    const location = await decryptLocation(payload);
    if (location) {
      console.log('[socket] Decrypted location for', senderName, ':', location.latitude, location.longitude);
      locationCallbacks.forEach((cb) => cb(senderId, senderName, location));
    } else {
      console.error('[socket] Failed to decrypt location from', senderName);
    }
  });

  socket.on('error', (message) => {
    console.error('[socket] Error:', message);
  });

  socket.on('connect_error', (error) => {
    console.error('[socket] Connection error:', error.message);
  });

  return true;
}

export function setGhostMode(enabled: boolean): void {
  ghostMode = enabled;
  console.log('[socket] Ghost mode:', enabled ? 'ON' : 'OFF');
}

export function isGhostModeEnabled(): boolean {
  return ghostMode;
}

export async function sendLocationUpdate(location: Location): Promise<void> {
  if (ghostMode) {
    console.log('[socket] Ghost mode active, skipping location broadcast');
    return;
  }

  if (!socket?.connected) {
    console.warn('[socket] Not connected (socket exists:', !!socket, ', connected:', socket?.connected, '), skipping location update');
    return;
  }

  console.log('[socket] Encrypting and sending location update...');
  try {
    const encrypted = await encryptLocation(location);
    if (encrypted) {
      socket.emit('location:update', encrypted);
      console.log('[socket] Location update sent');
    } else {
      console.error('[socket] Failed to encrypt location - no group key?');
    }
  } catch (error) {
    console.error('[socket] Encryption error:', error);
  }
}

export function disconnectSocket(): void {
  if (socket) {
    socket.emit('location:unsubscribe');
    socket.disconnect();
    socket = null;
  }
}

export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}
