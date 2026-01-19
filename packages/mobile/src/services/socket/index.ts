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
  const token = await getToken();
  if (!token) {
    console.error('[socket] No auth token');
    return false;
  }

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
    const location = await decryptLocation(payload);
    if (location) {
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
}

export function isGhostModeEnabled(): boolean {
  return ghostMode;
}

export async function sendLocationUpdate(location: Location): Promise<void> {
  if (ghostMode) return;

  if (!socket?.connected) {
    return;
  }

  try {
    const encrypted = await encryptLocation(location);
    if (encrypted) {
      socket.emit('location:update', encrypted);
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
