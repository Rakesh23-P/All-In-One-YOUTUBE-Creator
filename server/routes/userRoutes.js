const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('avatar'), updateUserProfile);

module.exports = router;
