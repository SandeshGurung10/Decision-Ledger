import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import bcrypt from 'bcryptjs'; // Make sure to install: npm install bcryptjs

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

// UPDATE current user (self) - supports profile updates and password change
export const updateMe = async (req, res, next) => {
  try {
    // --- Password change flow ---
    if (req.body.currentPassword && req.body.newPassword) {
      // 1. Get user with password field
      const user = await User.findById(req.user._id).select('+password');
      if (!user) {
        return next(new AppError('User not found', 404));
      }

      // 2. Verify current password
      const isPasswordCorrect = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isPasswordCorrect) {
        return next(new AppError('Current password is incorrect', 401));
      }

      // Optional: check that new password is different from old
      if (req.body.currentPassword === req.body.newPassword) {
        return next(new AppError('New password must be different from current password', 400));
      }

      // 3. Hash new password
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 12);

      // 4. Update password and passwordChangedAt
      user.password = hashedPassword;
      user.passwordChangedAt = Date.now() - 1000; // subtract 1 second to ensure token is issued after change
      await user.save();

      // 5. Send response (avoid sending back sensitive data)
      return res.status(200).json({
        status: 'success',
        message: 'Password updated successfully',
      });
    }

    // --- Profile update flow (original logic) ---
    // Prevent password or role updates via this route (unless it's the password change above)
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

// SOFT DELETE user (Admin only) - sets active to false
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    // Prevent deleting yourself
    if (user._id.equals(req.user._id)) {
      return next(new AppError('You cannot delete your own account', 400));
    }

    // Prevent deleting the last admin
    if (user.role === 'Admin') {
      const adminCount = await User.countDocuments({ role: 'Admin', active: true });
      if (adminCount <= 1) {
        return next(new AppError('Cannot delete the last admin user', 400));
      }
    }

    // Soft delete - set active to false
    user.active = false;
    await user.save();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE current user (self-delete)
export const deleteMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Prevent last admin from deleting themselves
    if (user.role === 'Admin') {
      const adminCount = await User.countDocuments({ role: 'Admin', active: true });
      if (adminCount <= 1) {
        return next(new AppError('Cannot delete the last admin user', 400));
      }
    }

    // Soft delete - set active to false
    await User.findByIdAndUpdate(req.user._id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};