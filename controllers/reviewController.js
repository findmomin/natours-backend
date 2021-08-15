const Review = require('../models/reviewModel');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  req.body = { ...req.body, user: req.user.id, tour: req.params.tourId };
  next();
};

exports.getSingleReview = getOne(Review);
exports.getAllReviews = getAll(Review);
exports.createReview = createOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);
