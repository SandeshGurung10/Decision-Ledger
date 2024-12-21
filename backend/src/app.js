import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import AppError from './utils/AppError.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', authRoutes);

// Basic health check route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;
