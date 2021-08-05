const Tour = require('../models/tourModel');

// Get tours
exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    const defaultLimit = 100;
    const defaultPage = 1;

    excludedFields.forEach((field) => delete queryObj[field]);
    const updatedQueryObj = JSON.parse(
      JSON.stringify(queryObj).replace(
        /\b(gt|gte|lt|lte)\b/g,
        (match) => `$${match}`
      )
    );

    // Building query
    let query = Tour.find(updatedQueryObj);

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.replace(/,/g, ' ');

      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.replace(/,/g, ' ');

      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const limit = +req.query.limit || defaultLimit;
    const skip = ((+req.query.page || defaultPage) - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const tourCount = await Tour.countDocuments();

      if (skip >= tourCount) throw new Error('This page does not exist');
    }

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
