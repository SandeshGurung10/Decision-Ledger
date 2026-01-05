import Decision from '../models/Decision.js';
import AppError from '../utils/AppError.js';

export const createDecision = async (req, res, next) => {
  try {
    const newDecision = await Decision.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      status: 'success',
      data: {
        decision: newDecision,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getAllDecisions = async (req, res, next) => {
  try {
    // 1A) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let query = Decision.find(queryObj).populate('createdBy', 'name email');

    // 1B) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 1C) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // EXECUTE QUERY
    const decisions = await query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: decisions.length,
      data: {
        decisions,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getDecision = async (req, res, next) => {
  try {
    const decision = await Decision.findById(req.params.id)
      .populate('createdBy', 'name email department')
      .populate('reviewedBy', 'name email')
      .populate('stakeholders', 'name email');

    if (!decision) {
      return next(new AppError('No decision found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        decision,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateDecision = async (req, res, next) => {
  try {
    // Prevent updating createdBy or isArchived through standard update
    if (req.body.createdBy || req.body.isArchived) {
      return next(
        new AppError('You cannot update createdBy or isArchived fields here', 400)
      );
    }

    const decision = await Decision.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!decision) {
      return next(new AppError('No decision found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        decision,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const archiveDecision = async (req, res, next) => {
  try {
    const decision = await Decision.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );

    if (!decision) {
      return next(new AppError('No decision found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Decision successfully archived',
    });
  } catch (err) {
    next(err);
  }
};
