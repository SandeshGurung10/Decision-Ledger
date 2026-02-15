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

// UPDATE user (Admin only) - role, name, department
export const updateUser = async (req, res, next) => {
  try {
    const { role, name, department } = req.body;
    
    // Define allowed fields for admin to update
    const allowedFields = {};
    
    // Validate and add role if provided
    if (role) {
      const validRoles = ['Admin', 'Decision-Maker', 'Viewer'];
      if (!validRoles.includes(role)) {
        return next(new AppError('Invalid role. Must be Admin, Decision-Maker, or Viewer', 400));
      }
      allowedFields.role = role;
    }
    
    // Add name if provided
    if (name) {
      if (name.trim().length === 0) {
        return next(new AppError('Name cannot be empty', 400));
      }
      allowedFields.name = name.trim();
    }
    
    // Add department if provided
    if (department) {
      allowedFields.department = department.trim();
    }
    
    // Check if at least one field is being updated
    if (Object.keys(allowedFields).length === 0) {
      return next(new AppError('Please provide at least one field to update (role, name, or department)', 400));
    }
    
    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      allowedFields,
      { new: true, runValidators: true }
    ).select('-password -passwordResetToken -active');

    if (!updatedUser) {
      return next(new AppError('No user found with that ID', 404));
    }

    // Audit log - show what was changed
    const changedFields = Object.keys(allowedFields).join(', ');
    console.log(
      `Admin ${req.user.email} updated ${updatedUser.email}: Changed ${changedFields}`
    );

    res.status(200).json({
      status: 'success',
      message: `Successfully updated user's ${changedFields}`,
      data: { user: updatedUser },
    });
  } catch (err) {
    next(err);
  }
};