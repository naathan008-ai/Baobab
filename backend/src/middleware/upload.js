const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = ['uploads/properties', 'uploads/team'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};
createUploadDirs();

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'propertyImages') {
      cb(null, 'uploads/properties/');
    } else if (file.fieldname === 'teamPhoto') {
      cb(null, 'uploads/team/');
    } else {
      cb(null, 'uploads/');
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// Image processing middleware for property images
const processPropertyImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    const processedImages = [];
    const uploadDir = 'uploads/properties/';

    for (const file of req.files) {
      const filename = 'processed-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + '.webp';
      const outputPath = path.join(uploadDir, filename);

      await sharp(file.path)
        .resize(1200, 800, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(outputPath);

      // Delete original file
      fs.unlinkSync(file.path);
      
      processedImages.push(`/uploads/properties/${filename}`);
    }

    req.processedImages = processedImages;
    next();
  } catch (error) {
    console.error('Image processing error:', error);
    next(error);
  }
};

// Process team photo
const processTeamPhoto = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const filename = 'team-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + '.webp';
    const outputPath = path.join('uploads/team/', filename);

    await sharp(req.file.path)
      .resize(400, 400, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(outputPath);

    fs.unlinkSync(req.file.path);
    req.processedPhoto = `/uploads/team/${filename}`;
    next();
  } catch (error) {
    console.error('Team photo processing error:', error);
    next(error);
  }
};

module.exports = { 
  upload, 
  processPropertyImages, 
  processTeamPhoto 
};