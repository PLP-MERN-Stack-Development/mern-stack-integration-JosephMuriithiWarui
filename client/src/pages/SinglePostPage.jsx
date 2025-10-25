import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { useAuth } from '../context/AuthContext'; // Import Auth

// Component to handle new comment submission
const CommentForm = ({ postId, onSuccess }) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment) return;
    
    setLoading(true);
    setError(null);

    // Get the user's token for the protected route
    const token = user?.token;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      
      // Axios request to the dedicated comment route
      const { data } = await axios.post(
        `${API_URL}/posts/${postId}/comments`,
        { comment },
        config
      );
      
      setComment(''); // Clear form
      onSuccess(data.comment); // Pass new comment back to parent
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <p>
        Please <a onClick={() => navigate('/login', { state: { from: `/posts/${postId}` } })}>log in</a> to comment.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <h3>Leave a Comment as {user.name}</h3>
      {error && <p className="error-message">{error}</p>}
      <textarea
        rows="4"
        placeholder="Your comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={loading}
        required
      ></textarea>
      <button type="submit" disabled={loading}>
        {loading ? 'Posting...' : 'Submit Comment'}
      </button>
    </form>
  );
};


const SinglePostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: post, loading, error, request, setData: setPost } = useApi(`/posts/${id}`);
  const { loading: deleting, request: deleteRequest } = useApi(); 

  useEffect(() => {
    request();
  }, [id, request]); 

  // --- DELETE HANDLER ---
  // ... (Keep the existing handleDelete function)

  // --- NEW: Add Comment Handler ---
  const handleCommentAdded = (newComment) => {
    // Optimistic UI Update: Add the new comment to the local post state
    setPost(prevPost => ({
      ...prevPost,
      comments: [newComment, ...(prevPost.comments || [])], // Add to the beginning
      commentsCount: (prevPost.commentsCount || 0) + 1,
    }));
  };

  if (loading) return <p>Loading post...</p>;
  if (error) return <p className="error">Error fetching post: {error}</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div className="single-post-page">
      {/* Display featured image if available */}
      {post.featuredImage && (
        <img src={post.featuredImage} alt={post.title} className="post-featured-image" />
      )}
      
      <h1>{post.title}</h1>
      <p className="meta">
        Category: **{post.category?.name || 'N/A'}** | By: {post.author?.name || 'Anonymous'} | Published: {new Date(post.createdAt).toLocaleDateString()}
      </p>

      {/* Action buttons (Edit/Delete) */}
      <div className="actions">
        <button onClick={() => navigate(`/edit/${post._id}`)} disabled={deleting}>
          Edit Post
        </button>
        <button onClick={handleDelete} disabled={deleting} style={{ marginLeft: '10px', backgroundColor: 'red' }}>
          {deleting ? 'Deleting...' : 'Delete Post'}
        </button>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
      </div>
      
      {/* --- NEW: Comments Section --- */}
      <div className="comments-section">
        <h2>Comments ({post.commentsCount || 0})</h2>
        <CommentForm postId={post._id} onSuccess={handleCommentAdded} />

        <div className="comment-list">
          {post.comments?.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment._id || comment.user + Date.now()} className="comment-item">
                <p className="comment-author">
                    <strong>{comment.name || comment.user?.name}</strong> 
                    <span style={{ fontSize: '0.8em', marginLeft: '10px' }}>
                        {new Date(comment.createdAt).toLocaleString()}
                    </span>
                </p>
                <p>{comment.comment}</p>
              </div>
            ))
          ) : (
            <p>No comments yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SinglePostPage;