import express from 'express';
import { register, login } from '../controllers/authController.js';
import { validate, userValidationRules, loginValidationRules } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validate(userValidationRules()), register);
router.post('/login', validate(loginValidationRules()), login);

export default router;
