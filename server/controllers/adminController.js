const User = require('../models/User');
const Video = require('../models/Video');
const Comment = require('../models/Comment');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalCreators = await User.countDocuments({ role: 'creator' });
    const totalVideos = await Video.countDocuments();
    const totalComments = await Comment.countDocuments();

    // Sum all views across all videos on the platform
    const videos = await Video.find({}, 'views');
    const platformViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalCreators,
        totalVideos,
        totalComments,
        platformViews
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users on platform
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'creator' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user account (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete user's comments and videos
    await Comment.deleteMany({ creatorId: user._id });
    await Video.deleteMany({ creatorId: user._id });
    await user.deleteOne();

    res.status(200).json({ success: true, message: 'User and all associated content deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all videos on platform
// @route   GET /api/admin/videos
// @access  Private/Admin
const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate('creatorId', 'name email channelName')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: videos.length, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete video from platform (Admin only)
// @route   DELETE /api/admin/videos/:id
// @access  Private/Admin
const deleteVideoAdmin = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    await video.deleteOne();
    res.status(200).json({ success: true, message: 'Video deleted successfully by admin' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  deleteUser,
  getAllVideos,
  deleteVideoAdmin,
};
