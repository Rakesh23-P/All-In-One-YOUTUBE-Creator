const Comment = require('../models/Comment');
const Video = require('../models/Video');

// @desc    Get comments for creator's videos
// @route   GET /api/comments
// @access  Private
const getComments = async (req, res) => {
  try {
    // Find creator's videos
    const videos = await Video.find({ creatorId: req.user.id });
    const videoIds = videos.map(v => v._id);

    // Find comments referencing those videos
    const comments = await Comment.find({ videoId: { $in: videoIds } })
      .populate('videoId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: comments.length, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or restrict comment visibility (moderation toggle)
// @route   PUT /api/comments/:id/approve
// @access  Private
const approveComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Verify creator ownership
    if (String(comment.creatorId) !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized comment action' });
    }

    // Toggle approval status
    comment.isApproved = !comment.isApproved;
    await comment.save();

    res.status(200).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Verify creator ownership
    if (String(comment.creatorId) !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized comment action' });
    }

    await comment.deleteOne();

    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getComments,
  approveComment,
  deleteComment,
};
