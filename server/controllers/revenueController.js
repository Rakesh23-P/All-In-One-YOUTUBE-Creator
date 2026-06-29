const Revenue = require('../models/Revenue');

// Helper to generate mock revenue data for new users
const seedMockRevenue = async (creatorId) => {
  const months = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'];
  const seedData = [];

  for (let i = 0; i < months.length; i++) {
    const adRevenue = Math.floor(Math.random() * 2000) + 1200;
    const sponsorRevenue = Math.floor(Math.random() * 1500) + 800;
    const merchRevenue = Math.floor(Math.random() * 600) + 200;

    seedData.push({
      creatorId,
      adRevenue,
      sponsorRevenue,
      merchRevenue,
      monthYear: months[i],
    });
  }

  // Bulk insert and run pre-save hooks (by saving one by one or calculating manually)
  const savedRecords = [];
  for (const data of seedData) {
    const record = new Revenue(data);
    await record.save();
    savedRecords.push(record);
  }
  return savedRecords;
};

// @desc    Get monthly revenue metrics
// @route   GET /api/revenue
// @access  Private
const getRevenue = async (req, res) => {
  try {
    let revenueRecords = await Revenue.find({ creatorId: req.user.id })
      .sort({ monthYear: 1 });

    // Auto-seed for new creators to show beautiful charts immediately
    if (revenueRecords.length === 0) {
      revenueRecords = await seedMockRevenue(req.user.id);
    }

    res.status(200).json({ success: true, count: revenueRecords.length, data: revenueRecords });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add manual revenue record (e.g. for custom sponsorships)
// @route   POST /api/revenue
// @access  Private
const addRevenueRecord = async (req, res) => {
  try {
    const { adRevenue, sponsorRevenue, merchRevenue, monthYear } = req.body;

    // Check if record for this month already exists
    let existingRecord = await Revenue.findOne({ creatorId: req.user.id, monthYear });
    if (existingRecord) {
      existingRecord.adRevenue = adRevenue || existingRecord.adRevenue;
      existingRecord.sponsorRevenue = sponsorRevenue || existingRecord.sponsorRevenue;
      existingRecord.merchRevenue = merchRevenue || existingRecord.merchRevenue;
      await existingRecord.save();
      return res.status(200).json({ success: true, message: 'Revenue updated', data: existingRecord });
    }

    const newRevenue = new Revenue({
      creatorId: req.user.id,
      adRevenue: adRevenue || 0,
      sponsorRevenue: sponsorRevenue || 0,
      merchRevenue: merchRevenue || 0,
      monthYear
    });

    await newRevenue.save();

    res.status(201).json({ success: true, data: newRevenue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRevenue,
  addRevenueRecord,
};
