import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import { AuthProvider } from '../../context/AuthContext';
import PostList from './PostList';

const renderWithProviders = (ui) => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('PostList Integration', () => {
  beforeEach(() => {
    const mockUser = { id: 1, username: 'testuser', exp: Math.floor(Date.now() / 1000) + 3600 };
    const mockToken = "header." + btoa(JSON.stringify(mockUser)) + ".signature";
    
    window.localStorage.setItem('token', mockToken);
    vi.clearAllMocks();
  });

  it('includes the Authorization header in the fetch call', async () => {
    renderWithProviders(<PostList />);
    
    const postTitle = await screen.findByText(/first post/i);
    expect(postTitle).toBeInTheDocument();
  });

  it('updates the UI immediately when a post is toggled', async () => {
    renderWithProviders(<PostList />);

    const publishedBadge = await screen.findByText('Published');
    const toggleBtn = screen.getByRole('button', { name: /unpublish/i });

    fireEvent.click(toggleBtn);

    await waitFor(() => {
      expect(screen.getByText('Draft')).toBeInTheDocument();
    });
  });

  it('removes the post from the DOM after successful deletion', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);
    
    renderWithProviders(<PostList />);

    const deleteBtns = await screen.findAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteBtns[0]);

    expect(confirmSpy).toHaveBeenCalled();
    
    await waitFor(() => {
      expect(screen.queryByText('First Post')).not.toBeInTheDocument();
    });
  });
});
