import express from 'express';

const router = express.Router();

// Reference data for dropdowns
router.get('/reference', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      categories: [
        'Strategic',
        'Operational',
        'Financial',
        'HR',
        'Technical',
        'Other'
      ],
      statuses: [
        'Draft',
        'Under Review',
        'Approved',
        'Rejected',
        'Implemented'
      ],
      priorities: [
        'Low',
        'Medium',
        'High',
        'Critical'
      ],
      outcomes: [
        'Pending',
        'Success',
        'Failed',
        'Partially Successful'
      ],
      roles: [
        'Admin',
        'Decision-Maker',
        'Viewer'
      ]
    }
  });
});

export default router;