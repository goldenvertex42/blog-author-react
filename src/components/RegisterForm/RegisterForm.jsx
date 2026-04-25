import { Form, useActionData, useNavigation } from "react-router";
import Input from "../Input/Input";
import Button from "../Button/Button";

export default function RegisterForm() {
  const actionData = useActionData(); // Accesses the return value of registerAction
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const errors = actionData?.errors || {};
  const serverError = actionData?.serverError;

  return (
    <Form method="post" noValidate>
      {serverError && <p className="error-banner">{serverError}</p>}
      
      <Input 
        id="firstName" name="firstName" label="First Name" 
        error={errors.firstName} required 
      />
      <Input 
        id="lastName" name="lastName" label="Last Name" 
        error={errors.lastName} required 
      />
      <Input 
        id="username" name="username" label="Username" 
        error={errors.username} required 
      />
      <Input 
        id="email" name="email" type="email" label="Email" 
        error={errors.email} required 
      />
      <Input 
        id="password" name="password" type="password" label="Password" 
        error={errors.password} required 
      />
      <Input 
        id="confirmPassword" name="confirmPassword" type="password" label="Confirm Password" 
        error={errors.confirmPassword} required 
      />
      <Input 
        id="adminCode" name="adminCode" label="Admin Secret Code" 
        error={errors.adminCode} 
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Registering..." : "Register"}
      </Button>
    </Form>
  );
}
