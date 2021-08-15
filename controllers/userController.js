const { catchAsync } = require('../helpers');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const { deleteOne } = require('./handlerFactory');

// Get all users
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  // Sending response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // Create error if user posts password data
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('This route is not for password updates', 400));

  // Update user doc
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name: req.body.name, email: req.body.email },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({ status: 'success', data: null });
});

// Create an user
exports.createUser = (req, res) => {
  res.json({ status: 'Good' });
};

// Get single user
exports.getSingleUser = (req, res) => {
  res.json({ status: 'Good' });
};

// Update an user
exports.updateUser = (req, res) => {
  res.json({ status: 'Good' });
};

// Delete an user
exports.deleteUser = deleteOne(User);
