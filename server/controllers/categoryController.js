import Category from '../models/CategoryModel.js';
import asyncHandler from 'express-async-handler';

// --- GET /api/categories - Get all categories ---
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

// --- POST /api/categories - Create a new category ---
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Category name is required.');
  }

  // Simple slug generation
  const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = new Category({ name, slug });
  const createdCategory = await category.save();

  res.status(201).json(createdCategory);
});

export { getCategories, createCategory };