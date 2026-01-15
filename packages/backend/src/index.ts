import express from 'express';
import dotenv from 'dotenv';
import type { User, Location } from '@draugar/shared';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Type verification - demonstrate shared types are accessible
// This is a compile-time check that types are properly imported
const _typeCheck: User = {
  id: '',
  name: '',
  createdAt: new Date(),
};

const _locationCheck: Location = {
  userId: '',
  latitude: 0,
  longitude: 0,
  timestamp: new Date(),
  accuracy: 0,
};

// Start server
app.listen(PORT, () => {
  console.log(`[backend] Server running on http://localhost:${PORT}`);
  console.log(`[backend] Health check: http://localhost:${PORT}/health`);
});
