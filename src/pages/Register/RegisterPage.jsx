import RegisterForm from '../../components/RegisterForm/RegisterForm';
import { Link, useNavigate, Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.page_container}>
      <div className={styles.auth_card}>
        <h1>Create Author Account</h1>
        <RegisterForm onSuccess={() => navigate('/login')} />
        <p className={styles.toggle_text}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

