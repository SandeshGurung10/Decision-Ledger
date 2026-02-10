import express from 'express';
import { register, login } from '../controllers/authController.js';
import { validate, userValidationRules, loginValidationRules } from '../middleware/validate.js';

const router = express.Router();

// -------------------- Public Routes -------------------- //
// Register new users (role is forced to 'Decision-Maker' in controller)
router.post('/register', validate(userValidationRules()), register);

// Login users
router.post('/login', validate(loginValidationRules()), login);

export default router;