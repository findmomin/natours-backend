const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const helpers = require('../helpers');
const AppError = require('../utils/appError');

const signToken = payload =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = helpers.catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken({ id: newUser._id });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = helpers.catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Checking if email and password exist
  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  // Checking if user exist && passwords is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));

  // If everything is ok, send the jwt to client
  const token = signToken({ id: user._id });

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = helpers.catchAsync(async (req, res, next) => {
  // Get token and see if it exists
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  )
    return next(
      new AppError('You are not authorized to access this route', 401)
    );

  // Verify token
  const token = req.body.authorization;

  console.log(token);

  // Check if the user still exists

  // Check if the user changed password, after the jwt was issued

  next();
});
