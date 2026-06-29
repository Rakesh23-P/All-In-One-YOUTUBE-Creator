const express = require('express');
const router = express.Router();
const {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo
} = require('../controllers/videoController');

const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validate, videoRules } = require('../middleware/validation');

// Configuration for video and thumbnail upload fields
const uploadFields = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

// Configuration for updating thumbnails
const updateFields = upload.fields([
  { name: 'thumbnail', maxCount: 1 }
]);

router.route('/')
  .get(protect, getVideos)
  .post(protect, uploadFields, videoRules(), validate, createVideo);

router.route('/:id')
  .get(protect, getVideoById)
  .put(protect, updateFields, videoRules(), validate, updateVideo)
  .delete(protect, deleteVideo);

module.exports = router;
