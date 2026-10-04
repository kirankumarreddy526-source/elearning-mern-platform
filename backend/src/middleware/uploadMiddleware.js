const multer = require('multer');

// Memory storage to stream directly to Cloudinary
const storage = multer.memoryStorage();

// File filter for images, videos, and PDFs
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
    // Videos
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-matroska',
    // PDFs
    'application/pdf'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: Images, Videos, PDFs`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for videos/materials
  }
});

module.exports = upload;
