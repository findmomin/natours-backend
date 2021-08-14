const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const helpers = require('../helpers');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (payload) =>
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
      new AppError('You are not logged in. Please login to get access.', 401)
    );

  let user;

  try {
    // Verify token
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user still exists
    user = await User.findById(decoded.id);

    if (!user)
      return next(
        new AppError('The user belonging to this user does not exist.', 401)
      );

    // Check if the user changed password, after the jwt was issued
    if (user.changesPasswordAfter(decoded.iat))
      return next(
        new AppError('User recently changed password. Please login again.', 401)
      );
  } catch (err) {
    return next(new AppError(err, 401));
  }

  // Grant access to the protected route
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    const { role } = req.user;

    if (!roles.includes(role))
      return next(
        new AppError('You are not authorized to perform this action.', 403)
      );

    next();
  };
};

exports.forgotPassword = helpers.catchAsync(async (req, res, next) => {
  // Get user based on posted email
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(new AppError('There is no user with that email address.', 404));

  // Generate random token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  // Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message: `Reset you password by visiting ${resetURL}`,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = helpers.catchAsync(async (req, res, next) => {
  // Get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  // If the token has not expired and there is a user, set the new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save({ validateBeforeSave: false });

  // Log the user in
  const token = signToken({ id: user._id });

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.updatePassword = helpers.catchAsync(async (req, res, next) => {
  // Get user based on provided password
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(currentPassword, user.password)))
    return next(new AppError('Incorrect email or password', 401));

  // Update the password
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();

  // Log the user in
  const token = signToken({ id: user._id });

  res.status(200).json({
    status: 'success',
    token,
  });
});
