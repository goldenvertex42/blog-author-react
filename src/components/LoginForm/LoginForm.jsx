import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Input from "../Input/Input";
import Button from "../Button/Button";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function LoginForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data.errors) {
          const errorObject = data.errors.reduce((acc, err) => {
            acc[err.path] = err.msg;
            return acc;
          }, {});
          setErrors(errorObject);
        } else {
          setServerError(data.error || "Invalid email or password.");
        }
      } else {
        login(data.token); // Updates global state
      }
    } catch (err) {
      setServerError("Could not connect to the server.");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError && <p className="error-banner">{serverError}</p>}
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
      />
      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required
      />
      <Button type="submit">Login</Button>
    </form>
  );
}
