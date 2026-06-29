const multer = require('multer');
const path = require('path');

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Files will be saved in server/uploads/ directory
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // Generate unique file names
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExt = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExt);
  }
});

// File filter validator for images and videos
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|webp|gif/;
  const allowedVideoTypes = /mp4|mkv|avi|mov|webm/;
  
  const extName = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype;

  // Image and video validation logic
  if (file.fieldname === 'video') {
    const isVideo = allowedVideoTypes.test(extName) && mimeType.startsWith('video/');
    if (isVideo) {
      return cb(null, true);
    }
    return cb(new Error('Only video files (MP4, MKV, AVI, MOV, WEBM) are allowed!'));
  } else {
    // Default: avatar, thumbnail, or general image
    const isImage = allowedImageTypes.test(extName) && mimeType.startsWith('image/');
    if (isImage) {
      return cb(null, true);
    }
    return cb(new Error('Only image files (JPG, JPEG, PNG, WEBP, GIF) are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // Limit files to 100MB (adjust as needed for engineering project)
  }
});

module.exports = upload;
