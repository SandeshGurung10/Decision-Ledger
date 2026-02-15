import express from 'express';
import {
  createDecision,
  getAllDecisions,
  getDecision,
  updateDecision,
  archiveDecision,
  unarchiveDecision,   // ✅ NEW
  reviewDecision,      // ✅ NEW
} from '../controllers/decisionController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validate, decisionValidationRules } from '../middleware/validate.js';

const router = express.Router();

// 🔒 Protect all routes – user must be logged in
router.use(protect);

// ========================
// ROUTE: GET / POST
// ========================
router
  .route('/')
  .get(getAllDecisions)
  .post(
    restrictTo('Admin', 'Decision-Maker'),
    validate(decisionValidationRules()),
    createDecision
  );

// ========================
// ROUTE: GET / PATCH (single decision)
// ========================
router
  .route('/:id')
  .get(getDecision)
  .patch(
    restrictTo('Admin', 'Decision-Maker'),
    updateDecision
  );

// ========================
// ROUTE: Archive/Unarchive
// ========================
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
    unarchiveDecision  // ✅ NEW
  );

// ========================
// ROUTE: Review (Admin only)
// ========================
router
  .route('/:id/review')
  .patch(
    restrictTo('Admin'),
    reviewDecision  // ✅ NEW
  );

export default router;