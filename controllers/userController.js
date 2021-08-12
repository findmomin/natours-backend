const { catchAsync } = require('../helpers');
const User = require('../models/userModel');

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
exports.deleteUser = (req, res) => {
  res.json({ status: 'Good' });
};
