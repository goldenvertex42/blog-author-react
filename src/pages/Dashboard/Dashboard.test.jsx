import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { AuthProvider } from '../../context/AuthContext';
import Dashboard from './Dashboard';

vi.mock('../../components/PostList/PostList', () => ({
  default: () => <div data-testid="mock-post-list">Post List Mock</div>
}));

const renderDashboard = (mockUser = { username: 'testuser' }) => {
  const payload = { 
    ...mockUser, 
    exp: Math.floor(Date.now() / 1000) + 3600 
  };
  const mockToken = "header." + btoa(JSON.stringify(payload)) + ".signature";
  window.localStorage.setItem('token', mockToken);

  return render(
    <MemoryRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Dashboard Component', () => {
  it('renders the welcome message with the correct username', async () => {
    renderDashboard();
    const welcomeHeading = await screen.findByRole('heading', { name: /welcome back, testuser/i });
    expect(welcomeHeading).toBeInTheDocument();
  });

  it('renders the PostList component', () => {
    renderDashboard();
    expect(screen.getByTestId('mock-post-list')).toBeInTheDocument();
  });
});

