import express from 'express';
import {
  createDecision,
  getAllDecisions,
  getDecision,
  updateDecision,
  deleteDecision,      
  archiveDecision,
  unarchiveDecision,
  reviewDecision,
} from '../controllers/decisionController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validate, decisionValidationRules } from '../middleware/validate.js';

const router = express.Router();

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
  .patch(
    restrictTo('Admin', 'Decision-Maker'),
    updateDecision
  )
  .delete(
    restrictTo('Admin', 'Decision-Maker'), 
    deleteDecision
  );

router
  .route('/:id/archive')
  .patch(
    restrictTo('Admin', 'Decision-Maker'),
    archiveDecision
  );

router
  .route('/:id/unarchive')
  .patch(
    restrictTo('Admin', 'Decision-Maker'),
    unarchiveDecision
  );

router
  .route('/:id/review')
  .patch(
    restrictTo('Admin'),
    reviewDecision
  );

export default router;