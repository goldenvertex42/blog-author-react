import { screen, render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as router from 'react-router';
import * as authContext from '../../context/AuthContext';
import Sidebar from './Sidebar';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    NavLink: ({ children, to }) => <a href={to}>{children}</a>,
    Form: ({ children, onSubmit, ...props }) => (
      <form {...props} onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        {children}
      </form>
    ),
  };
});

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Sidebar Unit Tests', () => {
  const mockLogout = vi.fn();
  const mockUser = { username: 'testauthor' };

  it('renders the welcome message with the username', () => {
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });

    render(<Sidebar />);

    expect(screen.getByText(/welcome back,/i)).toBeInTheDocument();
    expect(screen.getByText('testauthor')).toBeInTheDocument();
  });

  it('contains the correct navigation links', () => {
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });

    render(<Sidebar />);

    expect(screen.getByRole('link', { name: /posts overview/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /new post/i })).toHaveAttribute('href', 'posts/new');
    expect(screen.getByText(/public blog view/i)).toBeInTheDocument();
  });

  it('calls the logout context function when the form is submitted', () => {
    vi.mocked(authContext.useAuth).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });

    render(<Sidebar />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.submit(logoutButton.closest('form'));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
