import type { Location } from './location';

// Client -> Server messages
export interface ClientToServerEvents {
  'location:update': (location: Omit<Location, 'userId'>) => void;
  'location:subscribe': () => void;
  'location:unsubscribe': () => void;
}

// Server -> Client messages
export interface ServerToClientEvents {
  'location:broadcast': (location: Location) => void;
  'user:online': (userId: string) => void;
  'user:offline': (userId: string) => void;
  'error': (message: string) => void;
}

// Inter-server events (if using multiple servers later)
export interface InterServerEvents {}

// Socket data (attached to each socket)
export interface SocketData {
  userId: string | null;
  authenticated: boolean;
}
