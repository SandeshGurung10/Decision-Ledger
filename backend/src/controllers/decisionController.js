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


export const getAllDecisions = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);


    if (req.user.role === 'Decision-Maker') {
      queryObj.createdBy = req.user._id; 
    } else if (req.user.role === 'Viewer') {
      queryObj.status = 'Approved'; 
    }
    
    let query = Decision.find(queryObj).populate('createdBy', 'name email');

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const decisions = await query;

    res.status(200).json({
      status: 'success',
      results: decisions.length,
      data: { decisions },
    });
  } catch (err) {
    next(err);
  }
};

// GET single decision
export const getDecision = async (req, res, next) => {
  try {
    const decision = await Decision.findById(req.params.id)
      .populate('createdBy', 'name email department')
      .populate('reviewedBy', 'name email')
      .populate('stakeholders', 'name email');

    if (!decision) return next(new AppError('No decision found with that ID', 404));

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
   
    if (req.body.createdBy || req.body.isArchived) {
      return next(
        new AppError('You cannot update createdBy or isArchived fields here', 400)
      );
    }

    const decision = await Decision.findById(req.params.id);
    if (!decision) return next(new AppError('No decision found with that ID', 404));

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
    if (!decision) return next(new AppError('No decision found with that ID', 404));

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