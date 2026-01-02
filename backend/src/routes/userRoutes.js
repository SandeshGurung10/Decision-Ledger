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

// Protect all routes after this middleware
router.use(protect);

router.get('/me', getMe, getUser);
router.patch('/updateMe', updateMe);

// Restrict all routes after this middleware to Admin only
router.use(restrictTo('Admin'));

router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUserRole);

export default router;
