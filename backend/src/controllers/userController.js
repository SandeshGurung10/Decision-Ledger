import User from '../models/User.js';
import AppError from '../utils/AppError.js';

// Set req.params.id to current user
export const getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

// GET single user
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      '-password -passwordResetToken -active'
    );

    if (!user) return next(new AppError('No user found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE current user (self)
export const updateMe = async (req, res, next) => {
  try {
    if (req.body.password || req.body.role) {
      return next(
        new AppError('This route is not for password or role updates', 400)
      );
    }

    const allowedFields = ['name', 'department', 'email'];
    const filteredBody = {};
    allowedFields.forEach((field) => {
      if (req.body[field]) filteredBody[field] = req.body[field];
    });

    // Check for duplicate email
    if (filteredBody.email) {
      const existingUser = await User.findOne({ email: filteredBody.email });
      if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
        return next(new AppError('Email already in use', 400));
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      filteredBody,
      { new: true, runValidators: true }
    ).select('-password -passwordResetToken -active');

    res.status(200).json({
      status: 'success',
      data: { user: updatedUser },
    });
  } catch (err) {
    next(err);
  }
};

// GET all users (Admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password -passwordResetToken -active');

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users },
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE user role (Admin only)
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ['Admin', 'Decision-Maker', 'Viewer'];

    if (!role || !validRoles.includes(role)) { 
      return next(new AppError('Invalid role', 400));
    }

    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('No user found with that ID', 404));

    user.role = role; 
    await user.save();

    // Audit log
    console.log(
      `Admin ${req.user.email} changed role of ${user.email} to ${user.role}`
    );

    const sanitizedUser = await User.findById(user._id).select(
      '-password -passwordResetToken -active'
    );

    res.status(200).json({
      status: 'success',
      data: { user: sanitizedUser },
    });
  } catch (err) {
    next(err);
  }
};