import Decision from '../models/Decision.js';
import User from '../models/User.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const userRole = req.user.role;
    const userId = req.user._id;

    // Base query based on role
    let query = { isArchived: false };
    
    if (userRole === 'Viewer') {
      query.status = 'Approved';
    } else if (userRole === 'Decision-Maker') {
      query.$or = [
        { createdBy: userId },
        { status: 'Approved' }
      ];
    }
    // Admin sees all (no additional filter)

    // Parallel queries for better performance
    const [
      totalDecisions,
      draftCount,
      underReviewCount,
      approvedCount,
      rejectedCount,
      implementedCount,
      categoryStats,
      priorityStats,
      recentDecisions,
      totalUsers
    ] = await Promise.all([
      // Total count
      Decision.countDocuments(query),
      
      // Status counts
      Decision.countDocuments({ ...query, status: 'Draft' }),
      Decision.countDocuments({ ...query, status: 'Under Review' }),
      Decision.countDocuments({ ...query, status: 'Approved' }),
      Decision.countDocuments({ ...query, status: 'Rejected' }),
      Decision.countDocuments({ ...query, status: 'Implemented' }),
      
      // Category breakdown
      Decision.aggregate([
        { $match: query },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      // Priority breakdown
      Decision.aggregate([
        { $match: query },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      
      // Recent decisions (last 5)
      Decision.find(query)
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('createdBy', 'name email')
        .select('title status category priority createdAt'),
      
      // Total users (Admin only)
      userRole === 'Admin' ? User.countDocuments({ active: true }) : null
    ]);

    // Format category stats for frontend
    const formattedCategoryStats = categoryStats.map(item => ({
      category: item._id || 'Uncategorized',
      count: item.count
    }));

    // Format priority stats for frontend
    const formattedPriorityStats = priorityStats.map(item => ({
      priority: item._id || 'Not Set',
      count: item.count
    }));

    // Response
    res.status(200).json({
      status: 'success',
      data: {
        overview: {
          total: totalDecisions,
          draft: draftCount,
          underReview: underReviewCount,
          approved: approvedCount,
          rejected: rejectedCount,
          implemented: implementedCount,
          ...(totalUsers !== null && { totalUsers })  // Only for Admin
        },
        byCategory: formattedCategoryStats,
        byPriority: formattedPriorityStats,
        recentDecisions
      }
    });
  } catch (err) {
    next(err);
  }
};