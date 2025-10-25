import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/UserModel.js'; // Ensure .js extension is here

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if token exists in the 'Authorization' header (Bearer <token>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (split "Bearer <token>" and take index [1])
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Fetch user from DB based on ID in token and attach to request
      // We exclude the password field
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Success, proceed to the next handler
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  // 4. Handle case where no token is provided
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Middleware for admin access control
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next(); // User is an admin
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
}

export { protect, admin };