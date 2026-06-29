const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a playlist name'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  videoIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
