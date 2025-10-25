import express from 'express';
import upload from '../middleware/uploadMiddleware.js'; // Assuming you have uploadMiddleware.js
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/upload - Requires authentication to upload
router.post('/', protect, upload.single('image'), (req, res) => {
  // Multer saves the file and sets req.file.path
  // We return the standardized path to the client
  res.send({ imagePath: `/${req.file.path}`.replace(/\\/g, "/") }); 
  // Replace backslashes for consistency across OS
});

export default router;