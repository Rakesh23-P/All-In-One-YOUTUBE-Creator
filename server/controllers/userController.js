const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const { isCloudinaryConfigured, cloudinary } = require('../config/cloudinary');

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile / channel details
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, channelName, channelDescription } = req.body;

    if (name) user.name = name;
    if (channelName !== undefined) user.channelName = channelName;
    if (channelDescription !== undefined) user.channelDescription = channelDescription;

    // Handle avatar file upload
    if (req.file) {
      const filePath = req.file.path;
      if (isCloudinaryConfigured) {
        try {
          const result = await cloudinary.uploader.upload(filePath, {
            folder: 'youtube_creator_manager/avatars',
            resource_type: 'image'
          });
          user.avatar = result.secure_url;
          // Delete local file after successful upload to Cloudinary
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (uploadError) {
          console.error('Cloudinary Avatar Upload Error:', uploadError);
          // Fallback to local file path if Cloudinary upload fails
          const relativePath = `/uploads/${path.basename(filePath)}`;
          user.avatar = relativePath;
        }
      } else {
        // Fallback to local static file URL path
        const relativePath = `/uploads/${path.basename(filePath)}`;
        user.avatar = relativePath;
      }
    }

    const updatedUser = await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        channelName: updatedUser.channelName,
        channelDescription: updatedUser.channelDescription
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
