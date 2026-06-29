const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative'],
  },
  watchTime: {
    type: Number,
    default: 0, // In hours
    min: [0, 'Watch time cannot be negative'],
  },
  subscribersCount: {
    type: Number,
    default: 0,
    min: [0, 'Subscribers count cannot be negative'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
