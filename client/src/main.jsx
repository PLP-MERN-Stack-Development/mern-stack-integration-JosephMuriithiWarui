import React from 'react'; 
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CategoryProvider } from './context/CategoryContext.jsx'; 
import { AuthProvider } from './context/AuthContext.jsx'; 
// ... (other imports)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CategoryProvider> 
        <App />
      </CategoryProvider>
    </AuthProvider>
  </React.StrictMode>,
);