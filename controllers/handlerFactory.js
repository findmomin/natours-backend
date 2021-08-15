const { catchAsync } = require('../helpers');
const AppError = require('../utils/appError');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError('No tour found with that id', 404));

    res.status(201).json({
      status: 'success',
      data: null,
    });
  });
