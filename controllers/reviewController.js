const { catchAsync } = require('../helpers');
const Review = require('../models/reviewModel');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const review = { ...req.body, user: req.user.id, tour: req.params.tourId };

  const createdReview = await Review.create(review);

  res.status(201).json({
    status: 'success',
    data: { review: createdReview },
  });
});
