const { catchAsync } = require('../helpers');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const { deleteOne, updateOne, getOne, getAll } = require('./handlerFactory');

// Get all users
exports.getAllUsers = getAll(User);

// Get single user
exports.getSingleUser = getOne(User);

// Update an user
exports.updateUser = updateOne(User);

// Delete an user
exports.deleteUser = deleteOne(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

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
