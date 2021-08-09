const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// Get tours
exports.getAllTours = catchAsync(async (req, res, next) => {
  // Getting data from query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  // Sending response
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

// Get single tour
exports.getSingleTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

// Post a tour
exports.createTour = catchAsync(async (req, res, next) => {
  const createdTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: createdTour,
    },
  });
});

// Update a tour
exports.updateTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(201).json({
    status: 'success',
    data: {
      tour: updatedTour,
    },
  });
});

// Delete a tour
exports.deleteTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deletedTour = await Tour.findByIdAndDelete(id);

  res.status(201).json({
    status: 'success',
    data: {
      tour: deletedTour,
    },
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: '$difficulty',
        averageRating: { $avg: '$ratingsAverage' },
        averagePrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        numRatings: { $sum: '$ratingsQuantity' },
        numTours: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthLyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTourStarts: -1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
