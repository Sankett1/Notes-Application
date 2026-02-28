import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';
import logsRoutes from './routes/logs.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/logs', logsRoutes);

// Root route
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Notes App API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      notes: '/api/notes',
      logs: '/api/logs'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  // Generic error
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// Connect to database
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║     Notes App Backend Server           ║
║     http://localhost:${PORT}             ║
║     Environment: ${process.env.NODE_ENV || 'development'}           ║
╚════════════════════════════════════════╝
    `);
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

export default app;
