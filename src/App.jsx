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

import LoginPage, { loginAction } from './pages/Login/LoginPage';
import RegisterPage, { registerAction } from './pages/Register/RegisterPage';
import Dashboard from './pages/Dashboard/Dashboard';
import { postLoader, postListAction } from './components/PostList/PostList';
import PostEditor, { postEditorLoader, postEditorAction } from './pages/PostEditor/PostEditor';
import CommentPage, { commentLoader, commentAction } from './pages/CommentPage/CommentPage';
import { decodeToken } from './context/AuthContext';

const rootLoader = () => {
  const token = localStorage.getItem('blog_author_token');
  if (!token) return { user: null };

  const decoded = decodeToken(token);
  const currentTime = Date.now() / 1000;

  if (decoded && decoded.exp > currentTime) {
    return { user: decoded };
  }

  localStorage.removeItem('blog_author_token');
  return { user: null };
};

const authLoader = () => {
  if (localStorage.getItem('blog_author_token')) {
    return redirect('/');
  }
  return null;
};

const protectedLoader = () => {
  if (!localStorage.getItem('blog_author_token')) {
    return redirect('/login');
  }
  return null;
};

async function logoutAction() {
  await new Promise(res => setTimeout(res, 300)); 
  localStorage.removeItem('blog_author_token');
  return redirect("/login");
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route 
      id='root'
      loader={rootLoader}
      element={<AuthProvider><Outlet /></AuthProvider>}>
      <Route 
        path="/logout" 
        action={logoutAction} 
      />

      <Route loader={authLoader}>
        <Route 
          path="/login" 
          element={<LoginPage />} 
          loader={authLoader} 
          action={loginAction} 
        />

        <Route 
          path="/register" 
          element={<RegisterPage />} 
          loader={authLoader} 
          action={registerAction} 
        />
      </Route>

      <Route element={<AuthorLayout />} loader={protectedLoader}>
        <Route 
          index 
          element={<Dashboard />} 
          loader={postLoader} 
          action={postListAction} 
        />
        
        <Route 
          path="posts/new" 
          element={<PostEditor />} 
          loader={postEditorLoader} 
          action={postEditorAction} 
        />

        <Route 
          path="posts/:postId/edit" 
          element={<PostEditor />} 
          loader={postEditorLoader} 
          action={postEditorAction} 
        />

        <Route 
          path="posts/:postId/comments" 
          element={<CommentPage />} 
          loader={commentLoader} 
          action={commentAction} 
        />
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
