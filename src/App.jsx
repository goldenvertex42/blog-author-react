import { Routes, Route, Navigate } from 'react-router';
import { useAuth } from './context/AuthContext';
import AuthorLayout from './components/layouts/AuthorLayout';

// Pages
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import Dashboard from './pages/Dashboard/Dashboard';
import PostEditor from './pages/PostEditor/PostEditor';
import CommentPage from './pages/CommentPage/CommentPage';

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

      {/* Private Author Routes - Wrapped in Protection AND Layout */}
      <Route
        element={
          <ProtectedRoute>
            <AuthorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="posts/new" element={<PostEditor />} />
        <Route path="posts/edit/:postId" element={<PostEditor />} />
        <Route path="posts/:postId/comments" element={<CommentPage />} />
      </Route>

      {/* 404 / Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
