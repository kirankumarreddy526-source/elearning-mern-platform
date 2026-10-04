const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a file buffer or stream to Cloudinary
 * @param {Buffer} fileBuffer - Buffer from multer
 * @param {string} folder - Folder name in Cloudinary
 * @param {string} resourceType - 'auto', 'image', 'video', or 'raw' (for PDFs)
 * @returns {Promise<object>} - Upload result containing secure_url and public_id
 */
const uploadToCloudinary = (fileBuffer, folder = 'elearning_materials', resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    // If Cloudinary keys are placeholders, provide a graceful mock upload response for local dev
    if (
      !process.env.CLOUDINARY_API_KEY ||
      process.env.CLOUDINARY_API_KEY === '123456789012345' ||
      process.env.CLOUDINARY_CLOUD_NAME === 'demo_cloud'
    ) {
      const mockId = 'mock_' + Date.now();
      let mockUrl = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80';
      if (resourceType === 'video') {
        mockUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      } else if (resourceType === 'raw') {
        mockUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
      }
      return resolve({
        secure_url: mockUrl,
        public_id: mockId,
        isMock: true
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = { cloudinary, uploadToCloudinary };
