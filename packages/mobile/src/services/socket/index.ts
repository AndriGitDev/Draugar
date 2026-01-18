import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  EncryptedPayload,
  Location,
} from '@draugar/shared';
import { encryptLocation, decryptLocation } from '../../crypto';

type DraugarSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: DraugarSocket | null = null;

// Callbacks for location updates from other family members
type LocationCallback = (userId: string, location: Location) => void;
const locationCallbacks: Set<LocationCallback> = new Set();

export function onFamilyLocationUpdate(callback: LocationCallback): () => void {
  locationCallbacks.add(callback);
  return () => locationCallbacks.delete(callback);
}

export async function connectSocket(serverUrl: string): Promise<boolean> {
  const token = await SecureStore.getItemAsync('draugar_token');
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

  socket.on('location:broadcast', async ({ senderId, payload }) => {
    // Decrypt the location from another family member
    const location = await decryptLocation(payload);
    if (location) {
      locationCallbacks.forEach((cb) => cb(senderId, location));
    }
  });

  socket.on('error', (message) => {
    console.error('[socket] Error:', message);
  });

  return true;
}

export async function sendLocationUpdate(location: Location): Promise<void> {
  if (!socket?.connected) {
    console.warn('[socket] Not connected, skipping location update');
    return;
  }

  const encrypted = await encryptLocation(location);
  if (encrypted) {
    socket.emit('location:update', encrypted);
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
