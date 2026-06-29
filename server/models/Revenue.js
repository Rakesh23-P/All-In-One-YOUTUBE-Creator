const mongoose = require('mongoose');

const RevenueSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  adRevenue: {
    type: Number,
    default: 0,
    min: [0, 'Revenue cannot be negative'],
  },
  sponsorRevenue: {
    type: Number,
    default: 0,
    min: [0, 'Revenue cannot be negative'],
  },
  merchRevenue: {
    type: Number,
    default: 0,
    min: [0, 'Revenue cannot be negative'],
  },
  totalRevenue: {
    type: Number,
    default: 0,
  },
  monthYear: {
    type: String,
    required: [true, 'Please add a month-year label (e.g., "YYYY-MM")'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto calculate total revenue before saving
RevenueSchema.pre('save', function (next) {
  this.totalRevenue = this.adRevenue + this.sponsorRevenue + this.merchRevenue;
  next();
});

module.exports = mongoose.model('Revenue', RevenueSchema);
