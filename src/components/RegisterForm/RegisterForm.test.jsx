import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from "react-router";
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import RegisterForm from './RegisterForm';

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('RegisterForm Component', () => {
  // Helper to render with Router context
  const renderForm = () => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );
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

  it('submits the form and redirects to login on success', async () => {
    renderForm();

    // Fill out minimum required fields
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'janedoe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123!' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Wait for the mock API response and navigation to be triggered
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('displays validation errors received from the server', async () => {
    // Override the default MSW handler to simulate a validation failure (400)
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

    // Check that error messages from the backend appear in the UI
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