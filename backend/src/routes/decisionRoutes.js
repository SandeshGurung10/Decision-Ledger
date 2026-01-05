import express from 'express';
import {
  createDecision,
  getAllDecisions,
  getDecision,
  updateDecision,
  archiveDecision,
} from '../controllers/decisionController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validate, decisionValidationRules } from '../middleware/validate.js';

const router = express.Router();

// Protect all routes
router.use(protect);

router
  .route('/')
  .get(getAllDecisions)
  .post(
    restrictTo('Admin', 'Decision-Maker'),
    validate(decisionValidationRules()),
    createDecision
  );

router
  .route('/:id')
  .get(getDecision)
  .patch(restrictTo('Admin', 'Decision-Maker'), updateDecision);

router
  .route('/:id/archive')
  .patch(restrictTo('Admin', 'Decision-Maker'), archiveDecision);

export default router;
