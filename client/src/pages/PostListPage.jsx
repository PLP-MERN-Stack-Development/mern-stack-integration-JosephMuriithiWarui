import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // For URL/query parameters
import useApi from '../hooks/useApi';
import { useCategories } from '../context/CategoryContext'; // For category filter dropdown

// Component for Pagination (will be created below)
const Paginate = ({ pages, page, keyword = '', category = '' }) => {
  const navigate = useNavigate();
  return (
    pages > 1 && (
      <div className="pagination-controls">
        {[...Array(pages).keys()].map((x) => (
          <button
            key={x + 1}
            className={x + 1 === page ? 'active' : ''}
            onClick={() => {
              // Construct the query string dynamically
              let query = `?pageNumber=${x + 1}`;
              if (keyword) query += `&keyword=${keyword}`;
              if (category) query += `&category=${category}`;
              navigate(query);
            }}
          >
            {x + 1}
          </button>
        ))}
      </div>
    )
  );
};

const PostListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categories } = useCategories();

  // Parse URL query string for keyword, category, and page number
  const urlParams = new URLSearchParams(location.search);
  const keyword = urlParams.get('keyword') || '';
  const categoryId = urlParams.get('category') || '';
  const pageNumber = urlParams.get('pageNumber') || 1;
  
  const [searchTerm, setSearchTerm] = useState(keyword);
  const [selectedCategory, setSelectedCategory] = useState(categoryId);

  // Construct API query based on URL parameters
  const apiQuery = `/posts?keyword=${keyword}&category=${categoryId}&pageNumber=${pageNumber}`;

  // Use the custom hook with the dynamically generated query
  const { data: fetchResult, loading, error, request } = useApi(apiQuery);
  const { posts = [], page, pages } = fetchResult || {};

  // Fetch data only when the URL query changes
  useEffect(() => {
    request('get', apiQuery);
  }, [apiQuery, request]); 

  // --- Search/Filter Handlers ---
  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate with new keyword, resetting page to 1
    const categoryQuery = selectedCategory ? `&category=${selectedCategory}` : '';
    navigate(`/?keyword=${searchTerm}${categoryQuery}`);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    // Navigate with new category, preserving search term, resetting page to 1
    const keywordQuery = searchTerm ? `&keyword=${searchTerm}` : '';
    navigate(`/?category=${newCategory}${keywordQuery}`);
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p className="error">Error fetching posts: {error}</p>;

  return (
    <div className="post-list-page">
      <h1>Latest Blog Posts</h1>

      {/* --- NEW: Search and Filter Bar --- */}
      <div className="filter-bar">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {/* Category Filter */}
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Posts Container */}
      <div className="posts-container">
        {posts.length === 0 ? (
          <p>No posts found matching your criteria.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              {post.featuredImage && (
                <img src={post.featuredImage} alt={post.title} className="post-image" />
              )}
              <h2>{post.title}</h2>
              <p className="category">Category: {post.category?.name || 'N/A'}</p>
              <p className="author">By: {post.author?.name || 'Anonymous'}</p>
              <p>{post.content.substring(0, 150)}...</p>
              <a href={`/posts/${post._id}`}>Read More</a>
            </div>
          ))
        )}
      </div>
      
      {/* --- NEW: Pagination Controls --- */}
      <Paginate 
        pages={pages} 
        page={page} 
        keyword={keyword} 
        category={categoryId} 
      />
    </div>
  );
};

export default PostListPage;