import { useState } from "react";
import Input from "../Input/Input";
import Button from "../Button/Button";

export default function RegisterForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status >= 500) {
          setServerError("Could not create user");
        } else if (data.errors) {
          const errorObject = data.errors.reduce((acc, err) => {
            acc[err.path] = err.msg;
            return acc;
          }, {});
          setErrors(errorObject);
        } else {
          setServerError(data.error || "Could not create user");
        }
      } else {
        if (onSuccess) onSuccess(); 
      }
    } catch (err) {
      setServerError("Could not connect to the server");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError && <p className="error-banner">{serverError}</p>}

      <Input
        id="firstName"
        name="firstName"
        label="First Name"
        value={formData.firstName}
        onChange={handleChange}
        error={errors.firstName}
        required
      />

      <Input
        id="lastName"
        name="lastName"
        label="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        error={errors.lastName}
        required
      />

      <Input
        id="username"
        name="username"
        label="Username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        required
      />

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

      <Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        required
      />

      <Input
        id="adminCode"
        name="adminCode"
        label="Admin Secret Code"
        value={formData.adminCode}
        onChange={handleChange}
        error={errors.adminCode}
      />

      <Button type="submit">Register</Button>
    </form>
  );
}
