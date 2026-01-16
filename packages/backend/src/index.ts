import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api', routes);

// Error handling (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`[backend] Server running on http://localhost:${PORT}`);
  console.log(`[backend] Health check: http://localhost:${PORT}/api/health`);
});
