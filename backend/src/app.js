import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import decisionRoutes from './routes/decisionRoutes.js';

import errorHandler from './middleware/errorHandler.js';
import AppError from './utils/AppError.js';
import statsRoutes from './routes/statsRoutes.js';
import referenceRoutes from './routes/referenceRoutes.js';


const app = express();

// -------------------- Middleware -------------------- //
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------- Routes -------------------- //
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/decisions', decisionRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1', referenceRoutes);

// Basic health check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

// Handle unknown routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorHandler);

export default app;