const { catchAsync } = require('../helpers');
const Review = require('../models/reviewModel');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const review = { ...req.body, user: req.user.id };

  const createdReview = await Review.create(review);

  res.status(201).json({
    status: 'success',
    data: { review: createdReview },
  });
});
