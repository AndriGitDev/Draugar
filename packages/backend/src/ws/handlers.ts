import type { EncryptedPayload } from '@draugar/shared';
import type { DraugarSocket, DraugarServer } from './types';

export function handleLocationUpdate(
  io: DraugarServer,
  socket: DraugarSocket,
  payload: EncryptedPayload
): void {
  const senderId = socket.data.userId;
  const senderName = socket.data.userName || 'Unknown';

  if (!senderId || !socket.data.authenticated) {
    socket.emit('error', 'Not authenticated');
    return;
  }

  // Broadcast to all OTHER authenticated sockets
  // In future: filter by group membership from database
  // For now: broadcast to all authenticated users (single family group)
  socket.broadcast.emit('location:broadcast', {
    senderId,
    senderName,
    payload,
  });

  console.log(`[ws] Location broadcast from user ${senderId} (${senderName})`);
}

// Keep handleSubscribe and handleUnsubscribe - they'll be used for room-based filtering later
export function handleSubscribe(socket: DraugarSocket): void {
  console.log(`[ws] Socket ${socket.id} subscribed to location updates`);
  // TODO: Join room based on group membership
}

export function handleUnsubscribe(socket: DraugarSocket): void {
  console.log(`[ws] Socket ${socket.id} unsubscribed from location updates`);
  // TODO: Leave room
}
