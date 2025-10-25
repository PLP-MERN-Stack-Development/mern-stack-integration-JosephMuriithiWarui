import multer from 'multer';
import path from 'path';
import fs from 'fs'; // Node's file system module

// 1. Storage configuration
const storage = multer.diskStorage({
  // Define destination function
  destination(req, file, cb) {
    const uploadPath = 'uploads/';
    // Check if the uploads directory exists, if not, create it
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  
  // Define filename format: fieldname-timestamp.ext
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// 2. File type checking (Images only)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp|gif/; // Allowed file types
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true); // Accept file
  } else {
    cb(new Error('Only image files (JPEG, PNG, WEBP, GIF) are allowed!')); // Reject file
  }
};

// 3. Export Multer setup
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
  },
});

export default upload;