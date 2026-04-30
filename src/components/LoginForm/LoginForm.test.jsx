import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithRouter } from '../../../tests/test-utils';
import LoginForm from './LoginForm';
import { loginAction } from '../../pages/Login/LoginPage';

describe('LoginForm Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    window.localStorage.clear();
  });

  it('renders email and password inputs and a submit button', async () => {
    renderWithRouter(<LoginForm />, {
      route: '/login',
      path: '/login'
    });

    expect(await screen.findByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('displays specific validation errors from the action', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ 
        errors: [{ path: 'email', msg: 'Email format is invalid' }] 
      }),
    });

    renderWithRouter(<LoginForm />, {
      route: '/login',
      path: '/login',
      action: loginAction
    });

    const submitBtn = await screen.findByRole('button', { name: /login/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/email format is invalid/i)).toBeInTheDocument();
  });

  it('displays a generic error message on 401 failure', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Invalid email or password.' }),
    });

    renderWithRouter(<LoginForm />, {
      route: '/login',
      path: '/login',
      action: loginAction
    });

    const submitBtn = await screen.findByRole('button', { name: /login/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
  });
});
