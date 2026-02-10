import express from 'express';
import {
  getMe,
  getUser,
  updateMe,
  getAllUsers,
  updateUserRole,
} from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes: user must be logged in
router.use(protect);

// --- SELF routes (accessible to the logged-in user only) ---
router.get('/me', getMe, getUser);
router.patch('/updateMe', updateMe);

// --- ADMIN-only routes ---
router.use(restrictTo('Admin')); 
router.route('/').get(getAllUsers);
router.route('/:id')
  .get(getUser)
  .patch(updateUserRole);

export default router;