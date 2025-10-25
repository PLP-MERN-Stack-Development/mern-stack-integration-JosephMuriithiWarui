import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post must have a title'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
    },
    content: {
      type: String,
      required: [true, 'Post must have content'],
    },
    // Reference to the Category model
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', 
      required: true,
    },
    // Placeholder for advanced feature: image upload
    featuredImage: {
      type: String,
      default: '/images/default-post.jpg',
    },
    // Placeholder for advanced feature: user auth
    author: {
      type: String, // Will be ObjectId and ref 'User' later
      default: 'Anonymous', 
    },
    // Placeholder for advanced feature: comments (will be an array of objects/refs later)
    commentsCount: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;