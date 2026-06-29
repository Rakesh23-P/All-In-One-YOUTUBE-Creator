const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // The content creator who owns the video
  },
  authorName: {
    type: String,
    required: true,
    default: 'YouTube Viewer',
  },
  userIcon: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    required: [true, 'Please add comment content'],
    trim: true,
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral',
  },
  isApproved: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Comment', CommentSchema);
