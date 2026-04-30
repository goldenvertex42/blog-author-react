import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import CommentForm from './CommentForm';
import { commentAction } from '../../pages/CommentPage/CommentPage';
import { renderWithRouter } from '../../../tests/test-utils';

describe('CommentForm Component', () => {
  const mockPostId = "post-123";

  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  it('renders correctly for a new comment', async () => {
    renderWithRouter(<CommentForm postId={mockPostId} />);
    
    const textarea = await screen.findByPlaceholderText(/write a comment/i);
    expect(textarea).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /post comment/i })).toBeInTheDocument();
  });

  it('renders correctly for editing an existing comment', async () => {
    const initialData = { id: "comm-1", text: "Original Comment" };
    renderWithRouter(<CommentForm postId={mockPostId} initialData={initialData} />);
    
    const textarea = await screen.findByDisplayValue("Original Comment");
    expect(textarea).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update comment/i })).toBeInTheDocument();
  });

  it('successfully submits and calls onSuccess', async () => {
    const onSuccess = vi.fn();
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    renderWithRouter(
      <CommentForm postId={mockPostId} onSuccess={onSuccess} />, 
      { 
        path: '/posts/:postId/comments', 
        route: `/posts/${mockPostId}/comments`,
        action: commentAction 
      }
    );

    const textarea = await screen.findByPlaceholderText(/write a comment/i);
    const submitBtn = screen.getByRole('button', { name: /post comment/i });

    fireEvent.change(textarea, { target: { name: 'text', value: 'New Test Comment' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });

    expect(textarea.value).toBe('');
  });

  it('displays server errors when submission fails', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Comment is too offensive" }),
    });

    renderWithRouter(
      <CommentForm postId={mockPostId} />, 
      { 
        path: '/posts/:postId/comments', 
        route: `/posts/${mockPostId}/comments`,
        action: commentAction 
      }
    );

    const textarea = await screen.findByPlaceholderText(/write a comment/i);
    fireEvent.change(textarea, { target: { name: 'text', value: 'Bad word' } });
    fireEvent.click(screen.getByRole('button', { name: /post comment/i }));

    const errorMsg = await screen.findByText(/submission failed/i);
    expect(errorMsg).toBeInTheDocument();
  });
});
