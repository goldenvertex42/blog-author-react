import { useEffect } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import Input from "../Input/Input";
import Button from "../Button/Button";

export default function LoginForm() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const errors = actionData?.errors || {};
  const serverError = actionData?.serverError;


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
