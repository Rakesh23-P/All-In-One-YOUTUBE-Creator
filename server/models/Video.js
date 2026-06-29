const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a video title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  description: {
    type: String,
    maxlength: [5000, 'Description cannot exceed 5000 characters'],
    default: '',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  thumbnailUrl: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published'],
    default: 'draft',
  },
  scheduledAt: {
    type: Date,
    default: null,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  duration: {
    type: String,
    default: '0:00',
  },
  playlistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist',
    default: null,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Video', VideoSchema);
