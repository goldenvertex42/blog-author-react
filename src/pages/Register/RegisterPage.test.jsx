import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithRouter } from '../../../tests/test-utils';
import RegisterPage, { registerAction } from './RegisterPage';

describe('RegisterPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('renders the registration form and headings correctly', async () => {
    renderWithRouter(<RegisterPage />, { 
      route: '/register', 
      path: '/register',
      userValue: { user: null } 
    });

    expect(await screen.findByRole('heading', { name: /create author account/i })).toBeInTheDocument();
    
    expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: /register as a reader/i })).toHaveAttribute('href', expect.stringContaining('register'));
  });

  it('renders all required input fields from RegisterForm', async () => {
    renderWithRouter(<RegisterPage />, { 
      route: '/register',
      path: '/register'
    });

    expect(await screen.findByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('displays validation errors passed back from the action after submission', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ 
        errors: [
          { path: "confirmPassword", msg: "Passwords do not match" },
          { path: "email", msg: "Email already in use" }
        ] 
      }),
    });

    renderWithRouter(<RegisterPage />, {
      route: '/register',
      path: '/register',
      action: registerAction 
    });

    const submitBtn = await screen.findByRole('button', { name: /register/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(screen.getByText(/email already in use/i)).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: /register/i })).not.toBeDisabled();
  });

  it('displays a general server error banner on 500 failure', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: "Internal Server Error" }),
    });

    renderWithRouter(<RegisterPage />, {
      route: '/register',
      path: '/register',
      action: registerAction
    });

    const submitBtn = await screen.findByRole('button', { name: /register/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/internal server error/i)).toBeInTheDocument();
  });
});
