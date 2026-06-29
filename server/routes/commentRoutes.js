const express = require('express');
const router = express.Router();
const { getComments, approveComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.use(protect); // Secure all comment endpoints

router.get('/', getComments);
router.put('/:id/approve', approveComment);
router.delete('/:id', deleteComment);

module.exports = router;
