import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import type { DraugarServer, DraugarSocket } from './types';
import { handleLocationUpdate, handleSubscribe, handleUnsubscribe } from './handlers';
import { verifyToken } from '../utils/jwt';

export function createWebSocketServer(httpServer: HttpServer): DraugarServer {
  const io: DraugarServer = new Server(httpServer, {
    cors: {
      origin: '*', // Will restrict in production
      methods: ['GET', 'POST'],
    },
  });

  // Authentication middleware
  io.use(async (socket: DraugarSocket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      console.log(`[ws] Connection rejected: no token`);
      return next(new Error('Authentication required'));
    }

    try {
      const payload = await verifyToken(token);
      socket.data.userId = payload.userId;
      socket.data.userName = payload.name;
      socket.data.authenticated = true;
      console.log(`[ws] Authenticated user: ${payload.userId} (${payload.name})`);
      next();
    } catch (error) {
      console.log(`[ws] Connection rejected: invalid token`);
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: DraugarSocket) => {
    console.log(`[ws] Client connected: ${socket.id} (user: ${socket.data.userId})`);

    // Register event handlers
    socket.on('location:update', (payload) => handleLocationUpdate(io, socket, payload));
    socket.on('location:subscribe', () => handleSubscribe(socket));
    socket.on('location:unsubscribe', () => handleUnsubscribe(socket));

    socket.on('disconnect', (reason) => {
      console.log(`[ws] Client disconnected: ${socket.id} (${reason})`);
    });
  });

  return io;
}

export type { DraugarServer, DraugarSocket };
