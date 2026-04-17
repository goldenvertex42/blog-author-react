import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import App from './App';

const renderApp = (initialRoute = '/') => {
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
    const mockToken = "header.eyJ1c2VybmFtZSI6InRlc3R1c2VyIn0.signature";
    window.localStorage.setItem('token', mockToken);

    renderApp('/');

    const dashboardHeading = await screen.findByRole('heading', { 
      name: /author dashboard/i 
    });
    expect(dashboardHeading).toBeInTheDocument();

    const usernameDisplay = await screen.findByText(/testuser/i);
    expect(usernameDisplay).toBeInTheDocument();
  });

  it('redirects an unauthenticated user from PostEditor to Login', async () => {
    renderApp('/posts/new');

    const loginHeading = await screen.findByRole('heading', { name: /welcome back/i });
    expect(loginHeading).toBeInTheDocument();
  });
});
