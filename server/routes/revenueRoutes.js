const express = require('express');
const router = express.Router();
const { getRevenue, addRevenueRecord } = require('../controllers/revenueController');
const { protect } = require('../middleware/auth');

router.use(protect); // Secure all revenue endpoints

router.route('/')
  .get(getRevenue)
  .post(addRevenueRecord);

module.exports = router;
