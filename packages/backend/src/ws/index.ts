import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import type { DraugarServer, DraugarSocket } from './types';
import { handleLocationUpdate, handleSubscribe, handleUnsubscribe } from './handlers';

export function createWebSocketServer(httpServer: HttpServer): DraugarServer {
  const io: DraugarServer = new Server(httpServer, {
    cors: {
      origin: '*', // Will restrict in production
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: DraugarSocket) => {
    console.log(`[ws] Client connected: ${socket.id}`);

    // Initialize socket data
    socket.data.userId = null;
    socket.data.authenticated = false;

    // Register event handlers
    socket.on('location:update', (location) => handleLocationUpdate(socket, location));
    socket.on('location:subscribe', () => handleSubscribe(socket));
    socket.on('location:unsubscribe', () => handleUnsubscribe(socket));

    socket.on('disconnect', (reason) => {
      console.log(`[ws] Client disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
}

export type { DraugarServer, DraugarSocket };
