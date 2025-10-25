import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Custom Hooks and Context
import useApi from '../hooks/useApi';
import { useCategories } from '../context/CategoryContext';

// Define API URL for direct file upload requests (using the Vite proxy)
const API_URL = import.meta.env.VITE_API_URL || '/api'; 

const PostFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Global state for categories
  const { categories, loadingCategories } = useCategories(); 

  // API hook for fetching the current post data (only in edit mode)
  const { data: postData, request: fetchPost } = useApi(`/posts/${id}`);
  
  // Separate hook for the submission and image upload status
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '', // Mongoose ObjectId string
    featuredImage: '', // Path to the uploaded image
  });

  // 1. Fetch data for edit mode on component load
  useEffect(() => {
    if (isEditMode) {
      fetchPost('get', `/posts/${id}`);
    }
  }, [isEditMode, id, fetchPost]);

  // 2. Populate form data when postData is loaded
  useEffect(() => {
    if (isEditMode && postData) {
      setFormData({
        title: postData.title || '',
        content: postData.content || '',
        category: postData.category?._id || '', 
        featuredImage: postData.featuredImage || '',
      });
    }
  }, [isEditMode, postData]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Image Upload Handler ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = new FormData();
    fileData.append('image', file); // 'image' matches the key used in server/routes/uploadRoutes.js
    
    setUploading(true);
    setSubmitError(null);

    try {
      // Get the user's token from AuthContext (must be logged in via ProtectedRoute)
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token; 
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Send JWT for protected upload route
        },
      };

      const { data } = await axios.post(`${API_URL}/upload`, fileData, config);
      
      // Update form data state with the returned path
      setFormData((prev) => ({ ...prev, featuredImage: data.imagePath }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Image upload failed.';
      setSubmitError(errorMessage);
    } finally {
      setUploading(false);
    }
  };


  // --- Form Submission Handler (Create or Update) ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.category) {
        setSubmitError('All required fields (Title, Content, Category) must be filled.');
        return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const method = isEditMode ? 'put' : 'post';
    const url = isEditMode ? `/posts/${id}` : '/posts';

    try {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token; 
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Send JWT for protected route
            },
        };

        const result = await axios[method](`${API_URL}${url}`, formData, config);
        
        // Redirection on successful submission
        navigate(`/posts/${result.data._id}`, { replace: true });

    } catch (error) {
        const errorMessage = error.response?.data?.message || 'An unexpected error occurred during submission.';
        setSubmitError(errorMessage);
        setSubmitting(false);
    }
  };

  // State rendering control
  if (loadingCategories || (isEditMode && !postData)) {
      return <p>Loading resources...</p>;
  }

  return (
    <div className="post-form-page">
      <h1>{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
      
      <form onSubmit={handleSubmit}>

        {/* Title Field */}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required
            disabled={submitting || uploading}
          />
        </div>

        {/* Content Field */}
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea 
            id="content" 
            name="content" 
            rows="10"
            value={formData.content} 
            onChange={handleChange} 
            required
            disabled={submitting || uploading}
          ></textarea>
        </div>

        {/* Category Dropdown */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select 
            id="category" 
            name="category" 
            value={formData.category} 
            onChange={handleChange} 
            required
            disabled={submitting || uploading}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* --- Featured Image Upload --- */}
        <div className="form-group">
          <label htmlFor="featuredImage">Featured Image</label>
          
          {/* Image Preview */}
          {formData.featuredImage && (
            <img 
              src={formData.featuredImage} 
              alt="Featured" 
              style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '10px' }} 
            />
          )}
          
          {/* File Input */}
          <input 
            type="file" 
            id="featuredImage" 
            onChange={handleFileUpload} 
            disabled={submitting || uploading}
          />
          {uploading && <p style={{ color: 'blue' }}>Uploading image...</p>}
          
          {/* Hidden input to ensure featuredImage path is sent with the form */}
          <input 
            type="hidden" 
            name="featuredImage" 
            value={formData.featuredImage || ''} 
          />
        </div>
        
        {/* Error Message */}
        {submitError && <p className="error-message" style={{ color: 'red' }}>{submitError}</p>}

        {/* Submit Button */}
        <button type="submit" disabled={submitting || uploading}>
          {submitting ? 'Processing...' : (isEditMode ? 'Update Post' : 'Publish Post')}
        </button>
      </form>
    </div>
  );
};

export default PostFormPage;
