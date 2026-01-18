import type { EncryptedPayload } from '../crypto/types';

// Client -> Server messages
export interface ClientToServerEvents {
  // Location update contains encrypted payload (userId is in JWT auth, not payload)
  'location:update': (payload: EncryptedPayload) => void;
  'location:subscribe': () => void;
  'location:unsubscribe': () => void;
}

// Server -> Client messages
export interface ServerToClientEvents {
  // Broadcast includes senderId and senderName so receiver knows who sent it
  'location:broadcast': (data: { senderId: string; senderName: string; payload: EncryptedPayload }) => void;
  'user:online': (userId: string) => void;
  'user:offline': (userId: string) => void;
  'error': (message: string) => void;
}

// Inter-server events (if using multiple servers later)
export interface InterServerEvents {}

// Socket data (attached to each socket)
export interface SocketData {
  userId: string | null;
  userName: string | null;
  authenticated: boolean;
}
