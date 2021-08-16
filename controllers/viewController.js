const { catchAsync } = require('../helpers');
const Tour = require('../models/tourModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  // Get all tours
  const tours = await Tour.find();

  res.status(200).render('overview', { title: 'All Tours', tours });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // Get the tour
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  res.status(200).render('tour', { tour });
});
