import { useEffect } from "react";
import { Form, useActionData, useNavigation, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import Input from "../Input/Input";
import Button from "../Button/Button";

export default function LoginForm() {
  const { login } = useAuth();
  const actionData = useActionData();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const errors = actionData?.errors || {};
  const serverError = actionData?.serverError;
  
  useEffect(() => {
    if (actionData?.token) {
      login(actionData.token);
      navigate("/");
    }
  }, [actionData, login, navigation]);

  return (
    <Form method="post" noValidate>
      {serverError && <p className="error-banner">{serverError}</p>}
      
      <Input 
        id="email" name="email" type="email" label="Email" 
        error={errors.email} required 
      />
      <Input 
        id="password" name="password" type="password" label="Password" 
        error={errors.password} required 
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
    </Form>
  );
}
