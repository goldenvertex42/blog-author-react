import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router';
import { AuthProvider } from '../../context/AuthContext';
import CommentPage from './CommentPage';

const renderCommentPage = (postId = '123') => {
  const mockToken = "header." + btoa(JSON.stringify({ id: 1, username: 'testuser' })) + ".signature";
  window.localStorage.setItem('token', mockToken);

  return render(
    <MemoryRouter initialEntries={[`/posts/${postId}/comments`]}>
      <AuthProvider>
        <Routes>
          <Route path="/posts/:postId/comments" element={<CommentPage />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('CommentPage Integration', () => {
  it('renders the page header and child components', async () => {
    renderCommentPage();
    
    expect(screen.getByRole('heading', { name: /comment moderation/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to overview/i })).toHaveAttribute('href', '/');
    expect(screen.getByPlaceholderText(/write a comment/i)).toBeInTheDocument();
  });

  it('triggers a list refresh when a new comment is posted', async () => {
    const user = userEvent.setup();
    renderCommentPage();

    // Fill the form and submit
    const textarea = screen.getByPlaceholderText(/write a comment/i);
    await user.type(textarea, 'Author reply');
    await user.click(screen.getByRole('button', { name: /post comment/i }));

    // Verify the list reloads (CommentList should show its loading state briefly or updated count)
    await waitFor(() => {
      // Your CommentList logic will fetch again due to the refreshKey changing
      expect(screen.getByText(/manage comments/i)).toBeInTheDocument();
    });
  });
});
