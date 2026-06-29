const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

const {
  validate,
  registerRules,
  loginRules,
  resetPasswordRules
} = require('../middleware/validation');

router.post('/register', registerRules(), validate, registerUser);
router.post('/login', loginRules(), validate, loginUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPasswordRules(), validate, resetPassword);

module.exports = router;
