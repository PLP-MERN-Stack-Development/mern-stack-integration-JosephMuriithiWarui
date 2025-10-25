import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute'; // <-- Import ProtectedRoute

// Page Components
import PostListPage from './pages/PostListPage';
import SinglePostPage from './pages/SinglePostPage';
import PostFormPage from './pages/PostFormPage';
import LoginPage from './pages/LoginPage'; // <-- NEW: Import LoginPage
// import RegisterPage from './pages/RegisterPage'; // Will be added for full auth

function App() {
  return (
    <Router>
      <Navbar />
      <main className="page-content">
        <div className="container">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PostListPage />} />
            <Route path="/posts/:id" element={<SinglePostPage />} />
            <Route path="/login" element={<LoginPage />} /> {/* <-- NEW: Login Route */}
            {/* <Route path="/register" element={<RegisterPage />} /> */}
            
            {/* Protected Routes: Only logged-in users can create/edit posts */}
            <Route 
                path="/create" 
                element={<ProtectedRoute><PostFormPage /></ProtectedRoute>} 
            /> 
            <Route 
                path="/edit/:id" 
                element={<ProtectedRoute><PostFormPage /></ProtectedRoute>} 
            />
          </Routes>
        </div>
      </main>
    </Router>
  );
}

export default App;