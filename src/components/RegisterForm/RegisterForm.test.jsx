import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import RegisterForm from './RegisterForm';

describe('RegisterForm Component', () => {
  // Helper to render the form with a mock onSuccess prop
  const renderForm = (onSuccess = vi.fn()) => {
    render(<RegisterForm onSuccess={onSuccess} />);
    return { onSuccess };
  };

  it('renders all required input fields and the submit button', () => {
    renderForm();
    
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/admin secret code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('updates input values when the user types', () => {
    renderForm();
    const emailInput = screen.getByLabelText(/email/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  it('calls onSuccess when registration is successful', async () => {
    const { onSuccess } = renderForm();

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'janedoe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/admin secret code/i), { target: { value: 'super-secret-blog-code' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('displays validation errors received from the server', async () => {
    server.use(
      http.post('http://localhost:3000/auth/register', () => {
        return HttpResponse.json({
          errors: [
            { path: 'email', msg: 'Invalid email address' },
            { path: 'username', msg: 'Username already in use' }
          ]
        }, { status: 400 });
      })
    );

    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/username already in use/i)).toBeInTheDocument();
  });

  it('shows a generic error message if the server crashes', async () => {
    server.use(
      http.post('http://localhost:3000/auth/register', () => {
        return HttpResponse.json({}, { status: 500 });
      })
    );

    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/could not create user/i)).toBeInTheDocument();
  });
});
