const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: 8,
    validate: {
      // Only works on create or save
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password and password confirm must match!',
    },
  },
});

userSchema.pre('save', async function (next) {
  // If the password is modified don't hash it
  if (!this.isModified('password')) return next();

  // Hash the password on creation and delete the passwordConfirm
  // field
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
