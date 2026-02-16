import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import {
  getMe,
  getUser,
  updateMe,
  deleteMe,
  getAllUsers,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// Protect all routes after this
router.use(protect);

// Routes for any authenticated user
router.get('/me', getMe, getUser);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

// Restrict to admin only for the following
router.use(restrictTo('Admin'));
router.get('/', getAllUsers);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;