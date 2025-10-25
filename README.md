### MERN Stack Blog Application

### 📝 Project Overview

This is a complete, full-stack blog application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It features a robust RESTful API, JWT-based user authentication, dedicated middleware for file uploads, and a responsive React client utilizing custom hooks and context for state management.

The application allows authenticated users to create, edit, and delete blog posts, manage categories, and interact via comments.

### ✨ Features

### Core Functionality

Post Management (CRUD): Create, Read, Update, and Delete blog posts.

Category Management: Define and filter posts by categories.

Real-time Interaction: Use React hooks and API services for seamless data flow.

### Advanced Features

JWT User Authentication: Secure registration and login, with protected routes for post creation/editing.

Image Uploads: Dedicated endpoint using Multer to handle featured image uploads, with files served statically.

Pagination: Efficiently loads posts in batches (10 posts per page) to optimize performance.

Search and Filtering: Filter posts by keyword (title/content) and category ID using URL query parameters.

Comments System: Embedded document structure in MongoDB allows logged-in users to add comments to posts.

Modern UI: Responsive, modern design implemented with custom CSS.

### 💻 Tech Stack

Component

Technology

Role

### Frontend

React, Vite

UI, Component Structure, State Management (Context, Hooks)

### Styling

Custom CSS

Modern, responsive styling (no external CSS framework)

### Backend

Node.js, Express.js

RESTful API, Routing, Middleware

### Database

MongoDB, Mongoose

NoSQL Data persistence, Object Data Modeling

### Authentication

JSON Web Tokens (JWT), bcryptjs

User authentication, password hashing, and authorization

File Handling

multer

Middleware for handling multipart/form-data (image uploads)

### 🚀 Getting Started

Prerequisites

You must have the following installed on your machine:

Node.js (LTS version recommended)

MongoDB Atlas Account (or local MongoDB instance)

npm (or yarn)

1. Project Setup

# Clone the repository structure
# Assuming you are starting from the mern-blog/ folder structure
cd mern-blog/

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install


2. Configure Environment Variables

Create a file named .env in the mern-blog/server directory with the following content:

# MongoDB Atlas Connection String. Replace credentials and cluster name.
MONGODB_URI=mongodb+srv://<YourUsername>:<YourPassword>@<YourCluster>.mongodb.net/mern_blog_db?retryWrites=true&w=majority

# Port for the Express server
PORT=5000

# Secret Key for JWTs (MUST be a long, unique, secure string)
JWT_SECRET=YOUR_VERY_LONG_AND_SECURE_JWT_SECRET


3. Run the Application

You will need two separate terminal windows.

Terminal 1: Start the Server (API)

In the mern-blog/server directory:

npm run server


The console should show success messages for both MongoDB Connection and Server running on port 5000.

Terminal 2: Start the Client (React App)

In the mern-blog/client directory:

npm run dev


The application will open in your browser, typically at http://localhost:5173/.

4. Create Necessary Folders

The server needs a place to store uploaded images. This folder is usually ignored by Git, so you must create it manually after cloning:

# In the mern-blog/server directory
mkdir uploads
