import type { Location } from '@draugar/shared';
import type { DraugarSocket } from './types';

export function handleLocationUpdate(
  socket: DraugarSocket,
  location: Omit<Location, 'userId'>
): void {
  // Will broadcast to family group after auth is implemented
  console.log(`[ws] Location update from socket ${socket.id}:`, location);
  // For now, echo back to sender as proof of concept
  socket.emit('location:broadcast', {
    ...location,
    userId: socket.data.userId || 'anonymous',
  });
}

export function handleSubscribe(socket: DraugarSocket): void {
  console.log(`[ws] Socket ${socket.id} subscribed to location updates`);
  // Will join room based on family group after auth
}

export function handleUnsubscribe(socket: DraugarSocket): void {
  console.log(`[ws] Socket ${socket.id} unsubscribed from location updates`);
}
