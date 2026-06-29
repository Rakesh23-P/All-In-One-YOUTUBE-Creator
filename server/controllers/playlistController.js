const Playlist = require('../models/Playlist');
const Video = require('../models/Video');

// @desc    Get all playlists of a creator
// @route   GET /api/playlists
// @access  Private
const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ creatorId: req.user.id })
      .populate('videoIds', 'title duration thumbnailUrl status views');

    res.status(200).json({ success: true, count: playlists.length, data: playlists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a playlist
// @route   POST /api/playlists
// @access  Private
const createPlaylist = async (req, res) => {
  try {
    const { name, description, videoIds } = req.body;

    const playlist = await Playlist.create({
      name,
      description: description || '',
      creatorId: req.user.id,
      videoIds: videoIds || []
    });

    // Update the video models if videoIds were pre-supplied
    if (videoIds && videoIds.length > 0) {
      await Video.updateMany(
        { _id: { $in: videoIds }, creatorId: req.user.id },
        { playlistId: playlist._id }
      );
    }

    res.status(201).json({ success: true, data: playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add video to a playlist
// @route   POST /api/playlists/:id/add
// @access  Private
const addVideoToPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, creatorId: req.user.id });
    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    const { videoId } = req.body;
    const video = await Video.findOne({ _id: videoId, creatorId: req.user.id });
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found or unauthorized' });
    }

    // Add to playlist
    playlist.videoIds.addToSet(videoId);
    await playlist.save();

    // Link video to playlist
    video.playlistId = playlist._id;
    await video.save();

    res.status(200).json({ success: true, data: playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove video from a playlist
// @route   POST /api/playlists/:id/remove
// @access  Private
const removeVideoFromPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, creatorId: req.user.id });
    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    const { videoId } = req.body;

    playlist.videoIds.pull(videoId);
    await playlist.save();

    // Unlink video
    await Video.findOneAndUpdate(
      { _id: videoId, creatorId: req.user.id },
      { playlistId: null }
    );

    res.status(200).json({ success: true, data: playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete playlist
// @route   DELETE /api/playlists/:id
// @access  Private
const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, creatorId: req.user.id });
    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    // Unlink all related videos
    await Video.updateMany(
      { playlistId: playlist._id },
      { playlistId: null }
    );

    await playlist.deleteOne();

    res.status(200).json({ success: true, message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPlaylists,
  createPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
};
