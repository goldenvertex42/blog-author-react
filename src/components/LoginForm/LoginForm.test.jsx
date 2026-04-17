import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { server } from "../../mocks/server";
import { http, HttpResponse } from 'msw';
import { AuthProvider } from '../../context/AuthContext';
import LoginForm from './LoginForm';

const renderWithAuth = (ui) => render(<AuthProvider>{ui}</AuthProvider>);

describe('LoginForm', () => {
  it('renders email and password inputs and a submit button', () => {
    renderWithAuth(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('updates input values on change', () => {
    renderWithAuth(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  it('handles successful login and clears errors', async () => {
    renderWithAuth(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument();
    });
  });

  it('displays specific validation errors from the server', async () => {
    server.use(
      http.post('http://localhost:3000/auth/login', () => {
        return HttpResponse.json({
          errors: [{ path: 'email', msg: 'Email format is invalid' }]
        }, { status: 400 });
      })
    );

    renderWithAuth(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    const errorMsg = await screen.findByText(/email format is invalid/i);
    expect(errorMsg).toBeInTheDocument();
  });

  it('displays a generic error message on 401 failure', async () => {
    server.use(
      http.post('http://localhost:3000/auth/login', () => {
        return HttpResponse.json(
          { error: 'Invalid email or password' }, 
          { status: 401 }
        );
      })
    );

    renderWithAuth(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@test.com' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    const errorMessage = await screen.findByText(/invalid email or password/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
