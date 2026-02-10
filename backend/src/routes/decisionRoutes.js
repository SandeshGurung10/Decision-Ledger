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

// 🔒 Protect all routes – user must be logged in
router.use(protect);

// ========================
// ROUTE: GET / POST
// ========================

// GET all decisions (role-aware)
router
  .route('/')
  .get(getAllDecisions)
  .post(
    restrictTo('Admin', 'Decision-Maker'), // Only Admin or Decision-Maker can create
    validate(decisionValidationRules()),
    createDecision
  );

// ========================
// ROUTE: GET / PATCH
// ========================

// GET single decision / PATCH update
router
  .route('/:id')
  .get(getDecision)
  .patch(
    restrictTo('Admin', 'Decision-Maker'), // Only Admin or Decision-Maker can attempt update
    updateDecision // Ownership enforced inside controller
  );

// ========================
// ROUTE: PATCH Archive
// ========================

router
  .route('/:id/archive')
  .patch(
    restrictTo('Admin', 'Decision-Maker'), // Only Admin or Decision-Maker can attempt archive
    archiveDecision // Ownership enforced inside controller
  );

export default router;