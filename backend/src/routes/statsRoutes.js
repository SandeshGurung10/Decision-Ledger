import express from 'express';
import { getDashboardStats } from '../controllers/statsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All stats routes require authentication
router.use(protect);

// GET /api/v1/stats/dashboard
router.get('/dashboard', getDashboardStats);

export default router;