import LoginForm from '../../components/LoginForm/LoginForm';
import { Link, Navigate, redirect } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import styles from './LoginPage.module.css';

export async function loginAction({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.setItem('token', result.token);
      return { token: result.token }; 
    }
  


    if (!response.ok) {
      if (result.errors) {
        const errorObject = result.errors.reduce((acc, err) => {
          acc[err.path] = err.msg;
          return acc;
        }, {});
        return { errors: errorObject };
      }
      return { serverError: result.error || "Invalid email or password." };
    }

    return { token: result.token };
  } catch (err) {
    return { serverError: "Could not connect to the server." };
  }
}

export default function LoginPage() {
  return (
    <div className={styles.page_container}>
      <div className={styles.auth_card}>
        <h1>Welcome Back, Author</h1>
        <LoginForm />
        <p className={styles.toggle_text}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <p className={styles.readerLoginLink}>
          <a href={`${import.meta.env.VITE_READER_APP_URL}/login`}>
            Reader Login ↗
          </a>
        </p>
      </div>
    </div>
  );
}
