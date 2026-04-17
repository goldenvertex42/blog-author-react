import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { AuthProvider } from '../../context/AuthContext';
import Dashboard from './Dashboard';

vi.mock('../../components/PostList/PostList', () => ({
  default: () => <div data-testid="mock-post-list">Post List Mock</div>
}));

const renderDashboard = (mockUser = { username: 'testuser' }) => {
  const mockToken = "header." + btoa(JSON.stringify(mockUser)) + ".signature";
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
    
    const welcomeHeading = await screen.findByRole('heading', { 
      name: /welcome back, testuser/i 
    });
    
    expect(welcomeHeading).toBeInTheDocument();
  });

  it('contains a link to create a new post', () => {
    renderDashboard();
    const link = screen.getByRole('link', { name: /create new post/i });
    expect(link).toHaveAttribute('href', '/posts/new');
  });

  it('renders the logout button', () => {
    renderDashboard();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });
});
