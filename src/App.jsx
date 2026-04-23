import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  Link, 
  Outlet, 
  redirect 
} from 'react-router';

import { AuthProvider } from './context/AuthContext';
import AuthorLayout from './components/layouts/AuthorLayout';

// Pages
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import Dashboard from './pages/Dashboard/Dashboard';
import PostEditor from './pages/PostEditor/PostEditor';
import CommentPage from './pages/CommentPage/CommentPage';

// Redirect logged-in users away from Login/Register
const authLoader = () => {
  if (localStorage.getItem('token')) {
    return redirect('/');
  }
  return null;
};

// Protect author-only routes via loader
const protectedLoader = () => {
  if (!localStorage.getItem('token')) {
    return redirect('/login');
  }
  return null;
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProvider><Outlet /></AuthProvider>}>
      
      {/* Public Auth Routes with authLoader */}
      <Route loader={authLoader}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Private Author Routes with protectedLoader */}
      <Route element={<AuthorLayout />} loader={protectedLoader}>
        <Route index element={<Dashboard />} />
        <Route path="posts/new" element={<PostEditor />} />
        <Route path="posts/edit/:postId" element={<PostEditor />} />
        <Route path="posts/:postId/comments" element={<CommentPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={
        <div className="not-found">
          <h1>404 - Page Not Found</h1>
          <p>Sorry, we couldn't find what you were looking for.</p>
          <Link to="/" className="btn btn-primary">Return Home</Link>
        </div>
      } />
    </Route>
  )
);
