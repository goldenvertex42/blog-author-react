import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider } from '../../context/AuthContext';
import PostList from './PostList';

const renderWithAuth = (ui) => render(<AuthProvider>{ui}</AuthProvider>);

describe('PostList Component', () => {
  it('renders loading state and then the list of posts', async () => {
    window.localStorage.setItem('token', 'mock-token');

    renderWithAuth(<PostList />);

    expect(screen.getByText(/loading posts.../i)).toBeInTheDocument();

    const firstPost = await screen.findByText('First Post');
    expect(firstPost).toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();
  });

  it('removes a post from the list when deleted', async () => {
    window.localStorage.setItem('token', 'mock-token');
    vi.spyOn(window, 'confirm').mockImplementation(() => true);

    renderWithAuth(<PostList />);

    const deleteButtons = await screen.findAllByRole('button', { name: /delete/i });
    
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('First Post')).not.toBeInTheDocument();
    });
  });
});
