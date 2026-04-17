import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router';
import { AuthProvider } from '../../context/AuthContext';
import LoginPage from './LoginPage';

const renderLoginPage = (mockUser = null) => {
  if (mockUser) {
    const mockToken = "header." + btoa(JSON.stringify(mockUser)) + ".signature";
    window.localStorage.setItem('token', mockToken);
  } else {
    window.localStorage.clear();
  }

  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<h1>Home Page Mock</h1>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('LoginPage Integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders the login form and the register link', () => {
    renderLoginPage(null);
    expect(screen.getByRole('heading', { name: /welcome back/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register/i })).toHaveAttribute('href', '/register');
  });

  it('redirects to the home page if the user is already authenticated', async () => {
    renderLoginPage({ username: 'testuser' });
    
    await waitFor(() => {
      expect(screen.getByText(/home page mock/i)).toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: /welcome back/i, level: 1 })).not.toBeInTheDocument();
    });
  });
});
