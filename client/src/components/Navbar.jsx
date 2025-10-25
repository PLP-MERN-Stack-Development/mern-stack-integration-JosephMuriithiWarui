import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          MERN Blog
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/create">New Post</Link>
          {/* Placeholder for Auth */}
          <Link to="/login">Login</Link> 
        </div>
      </div>
    </nav>
  );
};

export default Navbar;