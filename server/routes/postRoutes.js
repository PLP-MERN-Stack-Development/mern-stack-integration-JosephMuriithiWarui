import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  createPostComment, // <-- Import the new controller
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Routes for /api/posts
router.route('/').get(getPosts).post(protect, createPost);

// Route for comments: POST /api/posts/:id/comments (Protected)
router.route('/:id/comments').post(protect, createPostComment); 

// Routes for /api/posts/:id
router.route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

export default router;