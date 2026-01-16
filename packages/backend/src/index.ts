import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { createWebSocketServer } from './ws';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = createWebSocketServer(server);
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api', routes);

// WebSocket status endpoint
app.get('/api/ws-status', (req, res) => {
  res.json({
    connections: io.engine.clientsCount,
  });
});

// Error handling (must be last)
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  console.log(`[backend] Server running on http://localhost:${PORT}`);
  console.log(`[backend] Health check: http://localhost:${PORT}/api/health`);
  console.log(`[backend] WebSocket ready on ws://localhost:${PORT}`);
});
