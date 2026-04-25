import { screen, waitFor, render } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { AuthProvider } from '../../context/AuthContext';
import LoginPage from './LoginPage';

const renderWithRouter = (initialRoute = '/login', mockUser = null) => {
  if (mockUser) {
    const payload = { ...mockUser, exp: Math.floor(Date.now() / 1000) + 3600 };
    const mockToken = "header." + btoa(JSON.stringify(payload)) + ".signature";
    window.localStorage.setItem('token', mockToken);
  } else {
    window.localStorage.clear();
  }

  const routes = [
    {
      path: '/login',
      loader: () => {
        if (localStorage.getItem('token')) {
          throw new Response("", { status: 302, headers: { Location: "/" } });
        }
        return null;
      },
      element: <LoginPage />,
      HydrateFallback: () => <div>Loading...</div>,
    },
    {
      path: '/',
      element: <h1>Home Page Mock</h1>,
      HydrateFallback: () => <div>Loading...</div>,
    },
    {
      path: '/register',
      element: <h1>Register Page Mock</h1>,
      HydrateFallback: () => <div>Loading...</div>,
    }
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: [initialRoute],
  });

  return render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

describe('LoginPage Integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders the login form and the register link', async () => {
    renderWithRouter('/login');

    expect(await screen.findByRole('heading', { name: /welcome back, author/i })).toBeInTheDocument();
    
    const registerLink = screen.getByRole('link', { name: /register/i });
    expect(registerLink).toBeInTheDocument();
  });

  it('redirects to the home page if the user is already authenticated', async () => {
    renderWithRouter('/login', { username: 'existinguser' });

    await waitFor(() => {
      expect(screen.getByText(/home page mock/i)).toBeInTheDocument();
    });

    expect(screen.queryByRole('heading', { name: /welcome back, author/i })).not.toBeInTheDocument();
  });
});
