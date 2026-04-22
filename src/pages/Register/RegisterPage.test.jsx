import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router';
import { AuthProvider } from '../../context/AuthContext';
import RegisterPage from './RegisterPage';

const renderRegisterPage = (mockUser = null) => {
  if (mockUser) {
    const payload = { 
      ...mockUser, 
      exp: Math.floor(Date.now() / 1000) + 3600 
    };
    const mockToken = "header." + btoa(JSON.stringify(payload)) + ".signature";
    window.localStorage.setItem('token', mockToken);
  } else {
    window.localStorage.clear();
  }

  return render(
    <MemoryRouter initialEntries={['/register']}>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<h1>Login Page Mock</h1>} />
          <Route path="/" element={<h1>Dashboard Mock</h1>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('RegisterPage Integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders the registration form and a link to login', () => {
    renderRegisterPage(null);
    expect(screen.getByRole('heading', { name: /create author account/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login');
  });

  it('redirects an already authenticated user to the dashboard', async () => {
    renderRegisterPage({ username: 'existinguser' });

    await waitFor(() => {
      expect(screen.getByText(/dashboard mock/i)).toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: /create author account/i })).not.toBeInTheDocument();
    });
  });

  it('navigates to the login page upon successful form submission', async () => {
    const user = userEvent.setup();
    renderRegisterPage(null);

    await user.type(screen.getByLabelText(/first name/i), 'Jane');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/username/i), 'janedoe');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'Password123!');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123!');
    await user.type(screen.getByLabelText(/admin secret code/i), 'super-secret-blog-code');

    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/login page mock/i)).toBeInTheDocument();
    });
  });
});
