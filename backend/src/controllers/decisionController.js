import Decision from '../models/Decision.js';
import AppError from '../utils/AppError.js';


const checkOwnershipOrAdmin = (decision, user) => {
  return decision.createdBy.equals(user._id) || user.role === 'Admin';
};


export const createDecision = async (req, res, next) => {
  try {
    const newDecision = await Decision.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      status: 'success',
      data: { decision: newDecision },
    });
  } catch (err) {
    next(err);
  }
};

// ⭐ ENHANCED: GET all decisions with filters, search, and pagination
export const getAllDecisions = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort,
      isArchived,
      status,        
      category,      
      priority,      
      search         
    } = req.query;

    // Build query object explicitly (safer than spreading all params)
    const queryObj = {};

    // Handle archived filter
    if (isArchived === 'all') {
      // Show all - don't set isArchived
    } else if (isArchived === 'true') {
      queryObj.isArchived = true;
    } else {
      queryObj.isArchived = false; 
    }

    // NEW: Status filter
    if (status && status !== 'all') {
      queryObj.status = status;
    }

    // NEW: Category filter
    if (category && category !== 'all') {
      queryObj.category = category;
    }

    // NEW: Priority filter
    if (priority && priority !== 'all') {
      queryObj.priority = priority;
    }

    // Role-based visibility
    if (req.user.role === 'Decision-Maker') {
      queryObj.createdBy = req.user._id; // only own decisions
    } else if (req.user.role === 'Viewer') {
      queryObj.status = 'Approved'; // only approved decisions
    }
    

    
    if (search) {
      queryObj.$or = [
        { title: { $regex: search, $options: 'i' } },           
        { description: { $regex: search, $options: 'i' } },
        { rationale: { $regex: search, $options: 'i' } }
      ];
    }

    // Build query
    let query = Decision.find(queryObj).populate('createdBy', 'name email');

    // Sorting
    if (sort) {
      const sortBy = sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); 
    }

    // Pagination
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(parseInt(limit));

    // Execute query
    const decisions = await query;

    // Get total count for pagination
    const total = await Decision.countDocuments(queryObj);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: 'success',
      results: decisions.length,
      total,
      page: parseInt(page),
      totalPages,
      hasNext: page < totalPages,      
      hasPrev: page > 1,                
      data: { decisions },
    });
  } catch (err) {
    next(err);
  }
};

// GET single decision with permission check
export const getDecision = async (req, res, next) => {
  try {
    const decision = await Decision.findById(req.params.id)
      .populate('createdBy', 'name email department')
      .populate('reviewedBy', 'name email')
      .populate('stakeholders', 'name email');

    if (!decision) {
      return next(new AppError('No decision found with that ID', 404));
    }

    // Permission checks
    if (req.user.role === 'Viewer' && decision.status !== 'Approved') {
      return next(new AppError('You do not have permission to view this decision', 403));
    }

    if (req.user.role === 'Decision-Maker') {
      const isOwner = decision.createdBy._id.equals(req.user._id);
      const isApproved = decision.status === 'Approved';
      
      if (!isOwner && !isApproved) {
        return next(new AppError('You do not have permission to view this decision', 403));
      }
    }

    res.status(200).json({
      status: 'success',
      data: { decision },
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE decision – creator or admin only
export const updateDecision = async (req, res, next) => {
  try {
    // Prevent changing these fields
    if (req.body.createdBy || req.body.isArchived || req.body.reviewedBy) {
      return next(
        new AppError('You cannot update createdBy, isArchived, or reviewedBy fields here', 400)
      );
    }

    const decision = await Decision.findById(req.params.id);
    if (!decision) {
      return next(new AppError('No decision found with that ID', 404));
    }

    // Check if archived
    if (decision.isArchived) {
      return next(new AppError('Cannot update archived decisions. Unarchive first.', 400));
    }

    if (!checkOwnershipOrAdmin(decision, req.user)) {
      return next(
        new AppError('You do not have permission to update this decision', 403)
      );
    }

    Object.assign(decision, req.body);
    await decision.save();

    res.status(200).json({
      status: 'success',
      data: { decision },
    });
  } catch (err) {
    next(err);
  }
};

// ARCHIVE decision – creator or admin only
export const archiveDecision = async (req, res, next) => {
  try {
    const decision = await Decision.findById(req.params.id);
    if (!decision) {
      return next(new AppError('No decision found with that ID', 404));
    }

    if (decision.isArchived) {
      return next(new AppError('Decision is already archived', 400));
    }

    if (!checkOwnershipOrAdmin(decision, req.user)) {
      return next(
        new AppError('You do not have permission to archive this decision', 403)
      );
    }

    decision.isArchived = true;
    await decision.save();

    res.status(200).json({
      status: 'success',
      message: 'Decision successfully archived',
      data: { decision },
    });
  } catch (err) {
    next(err);
  }
};

// UNARCHIVE decision – creator or admin only
export const unarchiveDecision = async (req, res, next) => {
  try {
    const decision = await Decision.findById(req.params.id);
    
    if (!decision) {
      return next(new AppError('No decision found with that ID', 404));
    }

    if (!decision.isArchived) {
      return next(new AppError('Decision is not archived', 400));
    }

    if (!checkOwnershipOrAdmin(decision, req.user)) {
      return next(
        new AppError('You do not have permission to unarchive this decision', 403)
      );
    }

    decision.isArchived = false;
    await decision.save();

    res.status(200).json({
      status: 'success',
      message: 'Decision successfully unarchived',
      data: { decision },
    });
  } catch (err) {
    next(err);
  }
};

// REVIEW decision (Admin only)
export const reviewDecision = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return next(new AppError('Status must be Approved or Rejected', 400));
    }

    const decision = await Decision.findById(req.params.id);
    if (!decision) {
      return next(new AppError('No decision found with that ID', 404));
    }

    if (decision.isArchived) {
      return next(new AppError('Cannot review archived decisions', 400));
    }

    // Update decision
    decision.status = status;
    decision.reviewedBy = req.user._id;
    decision.decidedAt = Date.now();
    await decision.save();

    const updatedDecision = await Decision.findById(decision._id)
      .populate('createdBy', 'name email')
      .populate('reviewedBy', 'name email');

    res.status(200).json({
      status: 'success',
      message: `Decision ${status.toLowerCase()}`,
      data: { decision: updatedDecision },
    });
  } catch (err) {
    next(err);
  }
};

// DELETE decision – creator or admin only
export const deleteDecision = async (req, res, next) => {
  try {
    const decision = await Decision.findById(req.params.id);
    
    if (!decision) {
      return next(new AppError('No decision found with that ID', 404));
    }

    if (!checkOwnershipOrAdmin(decision, req.user)) {
      return next(
        new AppError('You do not have permission to delete this decision', 403)
      );
    }

    // Permanently delete
    await Decision.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};