const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router.route('/top-5-cheap').get((req, res, next) => {
  req.query = { sort: '-rating,price', limit: '5' };
  next();
}, tourController.getAllTours);

router.route('/stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthLyPlan);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getSingleTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
