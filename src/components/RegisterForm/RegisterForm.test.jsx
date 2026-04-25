import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithRouter } from '../../../tests/test-utils';
import RegisterForm from './RegisterForm';
import { registerAction } from '../../pages/Register/RegisterPage';

describe('RegisterForm', () => {
  it('renders all registration fields', async () => {
    renderWithRouter(<RegisterForm />, {
      route: '/register',
      path: '/register',
      userValue: { user: null } 
    });

    expect(await screen.findByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('displays validation errors after a failed submission', async () => {
    // 1. Mock fetch carefully. 
    // Ensure global.fetch is mocked BEFORE rendering.
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        errors: [{ path: 'username', msg: 'Username is taken' }]
      }),
    });

    renderWithRouter(<RegisterForm />, {
      route: '/register',
      path: '/register',
      action: registerAction 
    });

    const submitBtn = await screen.findByRole('button', { name: /register/i });
    
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/username is taken/i)).toBeInTheDocument();
  });

  it('displays a general server error banner', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Database connection failed' }),
    });

    renderWithRouter(<RegisterForm />, {
      route: '/register',
      path: '/register',
      action: registerAction
    });

    const submitBtn = await screen.findByRole('button', { name: /register/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/database connection failed/i)).toBeInTheDocument();
  });

  it('disables the submit button while registering', async () => {
    global.fetch = vi.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({})
      }), 100))
    );

    renderWithRouter(<RegisterForm />, {
      route: '/register',
      path: '/register',
      action: registerAction
    });

    const button = await screen.findByRole('button', { name: /register/i });
    
    expect(button).not.toBeDisabled();

    fireEvent.click(button);
    
    expect(await screen.findByText(/registering\.\.\./i)).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

});
