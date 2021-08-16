const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// Doesn't require auth
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

// Requires auth
router.get('/me', userController.getMe, userController.getSingleUser);
router.patch('/updateMe', userController.updateMe);
router.patch('/updatePassword', authController.updatePassword);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

// Requires auth and admin permission
router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getSingleUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
