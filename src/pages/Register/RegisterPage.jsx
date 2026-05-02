import RegisterForm from '../../components/RegisterForm/RegisterForm';
import { Link, useNavigate, Navigate, redirect } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import styles from './RegisterPage.module.css';

export async function registerAction({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (data.password !== data.confirmPassword) {
    return { errors: { confirmPassword: "Passwords do not match" } };
  }

  try {
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
    if (result.errors) {
      const errorObject = result.errors.reduce((acc, err) => {
        const fieldName = err.path || err.param; 
        if (fieldName) acc[fieldName] = err.msg;
        return acc;
      }, {});
      return { errors: errorObject };
    }

      return { serverError: result.error || "Registration failed" };
    }

    return redirect("/login");
  } catch (err) {
    return { serverError: "Could not connect to the server" };
  }
}


export default function RegisterPage() {
  return (
    <div className={styles.page_container}>
      <div className={styles.auth_card}>
        <h1>Create Author Account</h1>
        <RegisterForm /> 
        <p className={styles.toggle_text}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <p className={styles.toggle_text}>
          Just want to join the discussion and read posts? 
          <a href={`${import.meta.env.VITE_READER_APP_URL}/register`}>
            Register as a Reader ↗
          </a>
        </p>
      </div>
    </div>
  );
}

