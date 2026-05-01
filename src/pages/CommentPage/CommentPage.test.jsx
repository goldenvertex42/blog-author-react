import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CommentPage, { commentLoader, commentAction } from './CommentPage';
import { renderWithRouter } from '../../../tests/test-utils';

describe('CommentPage Integration', () => {
  const mockPostId = "123";
  const mockComments = [
    {
      id: "c1",
      userId: "u1",
      text: "First test comment",
      createdAt: new Date().toISOString(),
      user: { username: "UserOne" }
    }
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
    storageMock();
    localStorage.setItem('token', 'fake-token');
  });

  it('loads and displays comments on mount', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockComments,
    });

    renderWithRouter(<CommentPage />, {
      path: '/posts/:postId/comments',
      route: `/posts/${mockPostId}/comments`,
      loaderData: mockComments
    });

    expect(await screen.findByText(/Comment Moderation/i)).toBeInTheDocument();
    expect(screen.getByText("First test comment")).toBeInTheDocument();
    expect(screen.getByText("UserOne")).toBeInTheDocument();
  });

  it('handles the "create comment" flow through the action', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockComments,
    });
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    renderWithRouter(<CommentPage />, {
      path: '/posts/:postId/comments',
      route: `/posts/${mockPostId}/comments`,
      action: commentAction,
      loaderData: mockComments
    });

    const textarea = await screen.findByPlaceholderText(/share your thoughts/i);
    const submitBtn = screen.getByRole('button', { name: /post comment/i });

    fireEvent.change(textarea, { target: { name: 'text', value: 'Fresh new comment' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/posts/${mockPostId}/comments`),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });
});

function storageMock() {
  let storage = {};
  return {
    setItem: (key, value) => storage[key] = value || '',
    getItem: (key) => storage[key] || null,
    removeItem: (key) => delete storage[key],
    clear: () => storage = {},
  };
}
