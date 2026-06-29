const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Helper to sign JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production_123456', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'creator',
    });

    // Create welcome notification
    await Notification.create({
      recipientId: user._id,
      title: 'Welcome to YOUTUBE STUDIO!',
      message: `Hello ${user.name}, welcome to your All-In-One YouTube Creator Management dashboard! Start by uploading your first video.`
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        channelName: user.channelName
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user (and select password field explicitly)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        channelName: user.channelName
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout user / Clear session (handled client side mostly by discarding token)
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set resetPasswordToken field in DB
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token expire time to 10 minutes
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

    // Log the link (useful for developer testing)
    console.log(`[PASS RESET] Click to reset: ${resetUrl}`);

    // Return token in response for demonstration / project verification simplicity
    res.status(200).json({
      success: true,
      message: 'Password reset link generated and printed to console.',
      resetToken, // Returned directly to simplify college evaluations and React client integration
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    // Hash token from URL param
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
};
