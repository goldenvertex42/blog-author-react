import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { server } from "../../mocks/server";
import { http, HttpResponse } from 'msw';
import RegisterForm from './RegisterForm';

describe('RegisterForm', () => {
  it('renders all seven input fields and the submit button', () => {
    render(<RegisterForm />);
    
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/admin secret code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('updates all fields when the user types', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    await user.type(usernameInput, 'janedoe');
    
    expect(usernameInput).toHaveValue('janedoe');
  });

  it('calls onSuccess when registration is successful', async () => {
    const onSuccessMock = vi.fn();
    const user = userEvent.setup();
    
    render(<RegisterForm onSuccess={onSuccessMock} />);

    await user.type(screen.getByLabelText(/first name/i), 'Jane');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/username/i), 'janedoe');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password123!');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123!');
    await user.type(screen.getByLabelText(/admin secret code/i), 'super-secret-blog-code');

    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalledTimes(1);
    }, { timeout: 2000 });
  });


  it('correctly maps and displays multiple validation errors from the server', async () => {
    server.use(
      http.post('http://localhost:3000/auth/register', () => {
        return HttpResponse.json({
          errors: [
            { path: 'email', msg: 'Email is invalid' },
            { path: 'password', msg: 'Password too short' },
            { path: 'adminCode', msg: 'Incorrect secret code' }
          ]
        }, { status: 400 });
      })
    );

    render(<RegisterForm />);
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/email is invalid/i)).toBeInTheDocument();
    expect(await screen.findByText(/password too short/i)).toBeInTheDocument();
    expect(await screen.findByText(/incorrect secret code/i)).toBeInTheDocument();
  });

  it('shows generic server error on 500 status', async () => {
    server.use(
      http.post('http://localhost:3000/auth/register', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<RegisterForm />);
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/could not create user/i)).toBeInTheDocument();
    expect(screen.getByText(/could not create user/i)).toHaveClass('error-banner');
  });

  it('shows connection error when fetch fails', async () => {
    server.use(
      http.post('http://localhost:3000/auth/register', () => {
        return HttpResponse.error();
      })
    );

    render(<RegisterForm />);
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/could not connect to the server/i)).toBeInTheDocument();
  });
});
