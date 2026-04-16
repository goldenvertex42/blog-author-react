import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Button from './components/Button/Button';
import RegisterForm from './components/RegisterForm/RegisterForm';
import LoginForm from './components/LoginForm/LoginForm';
import './App.css';

const AppContent = () => {
  const { user, loading, logout } = useAuth();
  const [isLoginView, setIsLoginView] = useState(false);

  if (loading) {
    return <div className="loading-screen" data-testid="loading">Checking authentication...</div>;
  }

  if (!user) {
    return (
      <div className="auth-container">
        <h1>{isLoginView ? 'Welcome Back' : 'Create Author Account'}</h1>
        
        {isLoginView ? <LoginForm /> : <RegisterForm onSuccess={() => setIsLoginView(true)} />}

        <Button 
          className="toggle-btn" 
          onClick={() => setIsLoginView(!isLoginView)}
        >
          {isLoginView ? "Don't have an account? Register" : "Already have an account? Login"}
        </Button>
      </div>
    );
  }

  return (
    <div className="dashboard" data-testid="dashboard">
      <nav>
        <span>Welcome, <strong>{user.username}</strong></span>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </nav>
      <main>
        <h1>Author Dashboard</h1>
        <p>Manage your blog posts here.</p>
      </main>
    </div>
  );
};

function App() {
  return <AppContent />;
}

export default App;
