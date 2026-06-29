const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  deleteUser,
  getAllVideos,
  deleteVideoAdmin
} = require('../controllers/adminController');

const { protect } = require('../middleware/auth');
const { authorizeAdmin } = require('../middleware/admin');

router.use(protect);
router.use(authorizeAdmin); // Secure all admin endpoints with admin role authorization check

router.get('/stats', getAdminStats);
router.route('/users')
  .get(getAllUsers);

router.delete('/users/:id', deleteUser);

router.route('/videos')
  .get(getAllVideos);

router.delete('/videos/:id', deleteVideoAdmin);

module.exports = router;
