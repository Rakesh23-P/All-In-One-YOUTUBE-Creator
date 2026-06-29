const fs = require('fs');
const path = require('path');
const Video = require('../models/Video');
const Playlist = require('../models/Playlist');
const Notification = require('../models/Notification');
const { isCloudinaryConfigured, cloudinary } = require('../config/cloudinary');

// Helper to handle Cloudinary or local file path
const uploadFile = async (file, folder) => {
  if (!file) return '';
  const filePath = file.path;

  if (isCloudinaryConfigured) {
    try {
      const resourceType = folder.includes('videos') ? 'video' : 'image';
      const result = await cloudinary.uploader.upload(filePath, {
        folder: `youtube_creator_manager/${folder}`,
        resource_type: resourceType
      });
      // Delete local file after upload
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return result.secure_url;
    } catch (uploadError) {
      console.error(`Cloudinary Upload Error for ${folder}:`, uploadError);
      return `/uploads/${path.basename(filePath)}`;
    }
  } else {
    return `/uploads/${path.basename(filePath)}`;
  }
};

// @desc    Get all creator videos
// @route   GET /api/videos
// @access  Private
const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ creatorId: req.user.id })
      .populate('playlistId', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, count: videos.length, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get video by id
// @route   GET /api/videos/:id
// @access  Private
const getVideoById = async (req, res) => {
  try {
    const video = await Video.findOne({ _id: req.params.id, creatorId: req.user.id })
      .populate('playlistId', 'name');

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found or unauthorized' });
    }

    res.status(200).json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create/Upload a video
// @route   POST /api/videos
// @access  Private
const createVideo = async (req, res) => {
  try {
    const { title, description, duration, status, scheduledAt, playlistId } = req.body;

    const videoFile = req.files && req.files.video ? req.files.video[0] : null;
    const thumbnailFile = req.files && req.files.thumbnail ? req.files.thumbnail[0] : null;

    if (!videoFile && !req.body.videoUrl) {
      return res.status(400).json({ success: false, message: 'Please upload a video file or supply a videoUrl' });
    }

    // Process files
    const videoUrl = videoFile ? await uploadFile(videoFile, 'videos') : req.body.videoUrl;
    const thumbnailUrl = thumbnailFile ? await uploadFile(thumbnailFile, 'thumbnails') : (req.body.thumbnailUrl || '');

    const video = await Video.create({
      title,
      description,
      duration: duration || '0:00',
      status: status || 'draft',
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      playlistId: playlistId || null,
      videoUrl,
      thumbnailUrl,
      creatorId: req.user.id,
      // For engineering presentation, inject realistic initial random stats if published
      views: status === 'published' ? Math.floor(Math.random() * 500) + 50 : 0,
      likes: status === 'published' ? Math.floor(Math.random() * 40) + 5 : 0,
      dislikes: status === 'published' ? Math.floor(Math.random() * 3) : 0
    });

    // Link to Playlist if specified
    if (playlistId) {
      await Playlist.findByIdAndUpdate(playlistId, {
        $addToSet: { videoIds: video._id }
      });
    }

    // Create Notification
    await Notification.create({
      recipientId: req.user.id,
      title: 'Video Uploaded',
      message: `Your video "${video.title}" has been uploaded successfully in ${video.status} status.`
    });

    res.status(201).json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update video details
// @route   PUT /api/videos/:id
// @access  Private
const updateVideo = async (req, res) => {
  try {
    let video = await Video.findOne({ _id: req.params.id, creatorId: req.user.id });

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found or unauthorized' });
    }

    const { title, description, duration, status, scheduledAt, playlistId } = req.body;

    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (duration) video.duration = duration;
    if (status) video.status = status;
    if (scheduledAt !== undefined) video.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;

    // Handle playlist update
    if (playlistId !== undefined && playlistId !== String(video.playlistId)) {
      // Remove from old playlist
      if (video.playlistId) {
        await Playlist.findByIdAndUpdate(video.playlistId, {
          $pull: { videoIds: video._id }
        });
      }
      // Add to new playlist
      if (playlistId) {
        await Playlist.findByIdAndUpdate(playlistId, {
          $addToSet: { videoIds: video._id }
        });
        video.playlistId = playlistId;
      } else {
        video.playlistId = null;
      }
    }

    // Process file if new thumbnail uploaded
    const thumbnailFile = req.files && req.files.thumbnail ? req.files.thumbnail[0] : null;
    if (thumbnailFile) {
      video.thumbnailUrl = await uploadFile(thumbnailFile, 'thumbnails');
    } else if (req.body.thumbnailUrl) {
      video.thumbnailUrl = req.body.thumbnailUrl;
    }

    const updatedVideo = await video.save();

    res.status(200).json({ success: true, data: updatedVideo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ _id: req.params.id, creatorId: req.user.id });

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found or unauthorized' });
    }

    // Remove from playlist reference if exists
    if (video.playlistId) {
      await Playlist.findByIdAndUpdate(video.playlistId, {
        $pull: { videoIds: video._id }
      });
    }

    // Clean up local uploads if file is stored locally
    if (video.videoUrl && video.videoUrl.startsWith('/uploads/')) {
      const localVideoPath = path.join(__dirname, '..', video.videoUrl);
      if (fs.existsSync(localVideoPath)) {
        fs.unlinkSync(localVideoPath);
      }
    }
    if (video.thumbnailUrl && video.thumbnailUrl.startsWith('/uploads/')) {
      const localThumbnailPath = path.join(__dirname, '..', video.thumbnailUrl);
      if (fs.existsSync(localThumbnailPath)) {
        fs.unlinkSync(localThumbnailPath);
      }
    }

    await video.deleteOne();

    res.status(200).json({ success: true, message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
};
