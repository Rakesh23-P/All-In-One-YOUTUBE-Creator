const express = require('express');
const router = express.Router();
const {
  getPlaylists,
  createPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist
} = require('../controllers/playlistController');
const { protect } = require('../middleware/auth');

router.use(protect); // Secure all playlist endpoints

router.route('/')
  .get(getPlaylists)
  .post(createPlaylist);

router.post('/:id/add', addVideoToPlaylist);
router.post('/:id/remove', removeVideoFromPlaylist);
router.delete('/:id', deletePlaylist);

module.exports = router;
