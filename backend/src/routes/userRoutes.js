import express from 'express';
import {
  getMe,
  getUser,
  updateMe,
  deleteMe,       
  getAllUsers,
  updateUser,
  deleteUser,     
} from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// --- SELF routes ---
router.get('/me', getMe, getUser);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);  

// --- ADMIN-only routes ---
router.use(restrictTo('Admin'));
router.route('/').get(getAllUsers);
router.route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);  

export default router;