import Post from '../models/PostModel.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

// --- GET /api/posts - Get all blog posts with search/pagination/filter ---
const getPosts = asyncHandler(async (req, res) => {
  // 1. PAGINATION SETUP
  const pageSize = 10; // Number of posts per page
  const page = Number(req.query.pageNumber) || 1; // Current page number

  // 2. SEARCH & FILTER SETUP
  const keyword = req.query.keyword
    ? {
        // Search by title or content (case-insensitive regex)
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { content: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const categoryFilter = req.query.category
    ? { category: req.query.category } // Filter by category ID
    : {};

  // Combine filters
  const filter = { ...keyword, ...categoryFilter };

  // 3. COUNT TOTAL & CALCULATE PAGES
  const count = await Post.countDocuments(filter);
  const pages = Math.ceil(count / pageSize);

  // 4. FETCH DATA
  const posts = await Post.find(filter)
    .populate('category', 'name slug')
    .populate('author', 'name') // Populate author name
    .limit(pageSize)
    .skip(pageSize * (page - 1)) // Skip records for pagination
    .sort({ createdAt: -1 }); // Sort by newest first

  res.json({ posts, page, pages }); // Return posts and pagination info
});

// --- GET /api/posts/:id - Get a specific blog post ---
const getPostById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(404);
    throw new Error('Invalid Post ID');
  }

  const post = await Post.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('author', 'name email')
    .populate('comments.user', 'name'); // Populate user name for comments

  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// --- POST /api/posts - Create a new blog post (PROTECTED) ---
const createPost = asyncHandler(async (req, res) => {
  const { title, content, category, featuredImage } = req.body;
  
  // Basic validation (Mongoose model handles the rest)
  if (!title || !content || !category) {
    res.status(400);
    throw new Error('Please provide title, content, and category.');
  }

  const post = new Post({
    title,
    content,
    category, 
    author: req.user._id, // Set author ID from the protected middleware (req.user)
    featuredImage: featuredImage || '/images/default-post.jpg', // Save image path
  });

  const createdPost = await post.save();
  // Populate relevant fields before sending response
  const populatedPost = await Post.findById(createdPost._id)
    .populate('category', 'name slug')
    .populate('author', 'name email');

  res.status(201).json(populatedPost); // 201 Created
});

// --- PUT /api/posts/:id - Update an existing blog post (PROTECTED) ---
const updatePost = asyncHandler(async (req, res) => {
  const { title, content, category, featuredImage } = req.body;

  const post = await Post.findById(req.params.id);

  if (post) {
    // Optional Authorization Check: Ensure only the author or an admin can update
    if (post.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(403);
        throw new Error('Not authorized to update this post');
    }

    post.title = title !== undefined ? title : post.title;
    post.content = content !== undefined ? content : post.content;
    post.category = category !== undefined ? category : post.category;
    post.featuredImage = featuredImage !== undefined ? featuredImage : post.featuredImage;

    const updatedPost = await post.save();
    
    // Populate relevant fields before sending response
    const populatedPost = await Post.findById(updatedPost._id)
      .populate('category', 'name slug')
      .populate('author', 'name email');

    res.json(populatedPost);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// --- DELETE /api/posts/:id - Delete a blog post (PROTECTED) ---
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    // Optional Authorization Check: Ensure only the author or an admin can delete
    if (post.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(403);
        throw new Error('Not authorized to delete this post');
    }
    
    await Post.deleteOne({ _id: req.params.id });
    res.json({ message: 'Post removed' });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// --- POST /api/posts/:id/comments - Create a new comment (PROTECTED) ---
const createPostComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const postId = req.params.id;

  const post = await Post.findById(postId);

  if (post) {
    if (!comment) {
      res.status(400);
      throw new Error('Comment cannot be empty.');
    }

    const newComment = {
      name: req.user.name, // Use name from protected user object
      comment: comment,
      user: req.user._id,
    };

    // Add the new comment to the beginning of the comments array (LIFO)
    post.comments.unshift(newComment); 
    
    // Update the comment count
    post.commentsCount = post.comments.length;

    await post.save();
    
    // Re-fetch or manually populate the new comment user name before responding
    const lastComment = post.comments[0];
    lastComment.user = { name: req.user.name }; 
    
    res.status(201).json({ message: 'Comment added', comment: lastComment });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

export { 
  getPosts, 
  getPostById, 
  createPost, 
  updatePost, 
  deletePost,
  createPostComment 
};