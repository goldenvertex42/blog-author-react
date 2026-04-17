import LoginForm from '../../components/LoginForm/LoginForm';
import { Link, Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { user } = useAuth();

  if (user) return <Navigate to="/" />;

  return (
    <div className={styles.page_container}>
      <div className={styles.auth_card}>
        <h1>Welcome Back</h1>
        <LoginForm />
        <p className={styles.toggle_text}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
