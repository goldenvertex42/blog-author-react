import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import App from './App';

const renderApp = (initialRoute = '/', mockUser = null) => {
  if (mockUser) {
    const payload = { 
      ...mockUser, 
      exp: Math.floor(Date.now() / 1000) + 3600 
    };
    const mockToken = "header." + btoa(JSON.stringify(payload)) + ".signature";
    window.localStorage.setItem('token', mockToken);
  }

  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('App Routing and Protection', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('redirects an unauthenticated user from Dashboard to Login', async () => {
    renderApp('/');

    const loginHeading = await screen.findByRole('heading', { name: /welcome back/i });
    expect(loginHeading).toBeInTheDocument();
  });

  it('allows an authenticated user to access the Dashboard', async () => {
  renderApp('/', { username: 'testuser' });

  expect(await screen.findByText(/testuser/i)).toBeInTheDocument();
  expect(screen.getByText(/Welcome back,/i)).toBeInTheDocument();
});


  it('redirects an unauthenticated user from PostEditor to Login', async () => {
    renderApp('/posts/new');

    const loginHeading = await screen.findByRole('heading', { name: /welcome back/i });
    expect(loginHeading).toBeInTheDocument();
  });
});
