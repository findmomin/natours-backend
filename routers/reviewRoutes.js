const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(protect, restrictTo('user'), reviewController.createReview);

module.exports = router;
