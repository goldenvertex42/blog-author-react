import { Routes, Route, Navigate } from 'react-router';
import { useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import Dashboard from './pages/Dashboard/Dashboard';
import PostEditor from './pages/PostEditor/PostEditor';

// 1. The Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Private Author Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/posts/new" 
        element={
          <ProtectedRoute>
            <PostEditor />
          </ProtectedRoute>
        } 
      />

      {/* 404 / Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
