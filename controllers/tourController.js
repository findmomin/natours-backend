const Tour = require('../models/tourModel');

// Get tours
exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach((field) => delete queryObj[field]);
    const updatedQueryObj = JSON.parse(
      JSON.stringify(queryObj).replace(
        /\b(gt|gte|lt|lte)\b/g,
        (match) => `$${match}`
      )
    );

    // Building query
    const query = Tour.find(updatedQueryObj);

    // Getting data from query
    const tours = await query;

    // Sending response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// Get single tour
exports.getSingleTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// Post a tour
exports.createTour = async (req, res) => {
  try {
    const createdTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: createdTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Please send a valid tour',
    });
  }
};

// Update a tour
exports.updateTour = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// Delete a tour
exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTour = await Tour.findByIdAndDelete(id);

    res.status(201).json({
      status: 'success',
      data: {
        tour: deletedTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
