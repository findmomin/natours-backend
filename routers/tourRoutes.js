const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routers/reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get((req, res, next) => {
  req.query = { sort: '-rating,price', limit: '5' };
  next();
}, tourController.getAllTours);

router.route('/stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guides', 'guide'),
    tourController.getMonthLyPlan
  );
router
  .route('/tour-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guides'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getSingleTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guides'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guides'),
    tourController.deleteTour
  );

module.exports = router;
