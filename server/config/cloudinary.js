const cloudinary = require('cloudinary').v2;

const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('Cloudinary storage engine configured successfully.');
} else {
  console.warn('Cloudinary credentials missing. Server will fallback to local filesystem storage under "uploads/"');
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured: !!isCloudinaryConfigured
};
