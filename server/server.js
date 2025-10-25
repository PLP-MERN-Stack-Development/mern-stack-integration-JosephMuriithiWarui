import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path'; // Needed for static file pathing

import connectDB from './config/db.js';
import postRoutes from './routes/postRoutes.js';      
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';        // <-- NEW: Import User Routes
import uploadRoutes from './routes/uploadRoutes.js';    // <-- NEW: Import Upload Routes
import { notFound, errorHandler } from './middleware/errorMiddleware.js'; 

// Load environment variables
dotenv.config(); 

// Connect to database
connectDB(); 

const app = express();

// --- MIDDLEWARE ---
app.use(express.json()); 
app.use(cors()); 

// --- API ROUTES ---
app.get('/', (req, res) => {
  res.send('API is running... 🚀');
});

// Use the imported routes
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);      // <-- NEW: Use User Routes
app.use('/api/upload', uploadRoutes);   // <-- NEW: Use Upload Routes

// --- STATIC FOLDER (for images) ---
// Note: This is required to serve images stored locally by Multer
const __dirname = path.resolve(); // Gets the current directory path
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// --- ERROR HANDLER MIDDLEWARE (must be last) ---
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🌐`));