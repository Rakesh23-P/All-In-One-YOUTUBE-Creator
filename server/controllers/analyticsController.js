const Analytics = require('../models/Analytics');
const Video = require('../models/Video');

// Helper to seed 30 days of mock analytics telemetry
const seedMockAnalytics = async (creatorId) => {
  const seedData = [];
  const now = new Date();
  
  // Starting subscriber count
  let currentSubscribers = Math.floor(Math.random() * 8000) + 1200;

  for (let i = 30; i >= 0; i--) {
    const recordDate = new Date(now);
    recordDate.setDate(now.getDate() - i);

    const dailyViews = Math.floor(Math.random() * 800) + 200;
    const dailyWatchTime = Math.floor(Math.random() * 50) + 10;
    const subscriberIncrease = Math.floor(Math.random() * 30) - 5; // can sometimes lose or gain
    currentSubscribers += subscriberIncrease;

    seedData.push({
      creatorId,
      views: dailyViews,
      watchTime: dailyWatchTime,
      subscribersCount: currentSubscribers,
      date: recordDate
    });
  }

  return await Analytics.insertMany(seedData);
};

// @desc    Get creator analytics timeline
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    let analyticsRecords = await Analytics.find({ creatorId: req.user.id })
      .sort({ date: 1 });

    // Auto-seed for new creators to show beautiful charts immediately
    if (analyticsRecords.length === 0) {
      analyticsRecords = await seedMockAnalytics(req.user.id);
    }

    // Get aggregate counts (Views, Watch Time, Subscribers, Videos)
    const videosCount = await Video.countDocuments({ creatorId: req.user.id });
    
    // Accumulate total views/watchTime from the analytics records
    const totalViews = analyticsRecords.reduce((sum, r) => sum + r.views, 0);
    const totalWatchTime = analyticsRecords.reduce((sum, r) => sum + r.watchTime, 0);
    
    // Get latest subscriber count
    const latestSubscribers = analyticsRecords.length > 0 
      ? analyticsRecords[analyticsRecords.length - 1].subscribersCount 
      : 0;

    res.status(200).json({
      success: true,
      totals: {
        totalVideos: videosCount,
        totalViews,
        totalWatchTime,
        subscribersCount: latestSubscribers
      },
      chartData: analyticsRecords
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAnalytics,
};
