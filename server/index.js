import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';

// Import routes
import centersRouter from './routes/centers.js';
import programsRouter from './routes/programs.js';
import partnersRouter from './routes/partners.js';
import associationsRouter from './routes/associations.js';
import organizationsRouter from './routes/organizations.js';
import submissionsRouter from './routes/submissions.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/centers', centersRouter);
app.use('/api/programs', programsRouter);
app.use('/api/partners', partnersRouter);
app.use('/api/associations', associationsRouter);
app.use('/api/organizations', organizationsRouter);
app.use('/api/submissions', submissionsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
const startServer = async () => {
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.warn('⚠️ Starting server without database connection');
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  });
};

startServer();
