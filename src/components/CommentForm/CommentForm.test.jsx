import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderWithRouter } from '../../../tests/test-utils';
import CommentForm from './CommentForm';

describe('CommentForm', () => {
  const mockPostId = "post-123";

  it('renders correctly for a new comment', async () => {
    renderWithRouter(<CommentForm postId={mockPostId} />);

    expect(await screen.findByPlaceholderText(/share your thoughts/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /post comment/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });

  it('renders correctly for editing an existing comment', async () => {
    const initialData = { id: 1, text: "Existing comment text" };
    renderWithRouter(<CommentForm postId={mockPostId} initialData={initialData} />);

    expect(await screen.findByDisplayValue("Existing comment text")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update comment/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('submits with the correct intent for new comments', async () => {
    const user = userEvent.setup();
    const actionSpy = vi.fn().mockResolvedValue({ success: true });

    renderWithRouter(<CommentForm postId={mockPostId} />, { action: actionSpy });

    const textarea = await screen.findByPlaceholderText(/share your thoughts/i);
    await user.type(textarea, 'New comment');
    await user.click(screen.getByRole('button', { name: /post comment/i }));

    await waitFor(() => {
      const formData = actionSpy.mock.calls[0][0].request.formData();
      return formData.then(data => {
        expect(data.get('intent')).toBe('create');
        expect(data.get('text')).toBe('New comment');
      });
    });
  });

  it('displays server errors when submission fails', async () => {
    const user = userEvent.setup();
    const onCancelSpy = vi.fn();

    const errorAction = async () => ({ serverError: "API is down" });

    renderWithRouter(<CommentForm postId={mockPostId} />, { action: errorAction });

    await user.type(await screen.findByPlaceholderText(/share your thoughts/i), 'Test');
    await user.click(screen.getByRole('button', { name: /post comment/i }));

    expect(await screen.findByText("API is down")).toBeInTheDocument();
    expect(onCancelSpy).not.toHaveBeenCalled();
  });

  it('calls onCancel when the cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancelSpy = vi.fn();
    const initialData = { id: 1, text: "Editing" };

    renderWithRouter(<CommentForm postId={mockPostId} initialData={initialData} onCancel={onCancelSpy} />);

    await user.click(await screen.findByRole('button', { name: /cancel/i }));
    expect(onCancelSpy).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel automatically after a successful edit submission', async () => {
    const user = userEvent.setup();
    const onCancelSpy = vi.fn();
    const initialData = { id: 1, text: "Original Text" };
    
    const successAction = async () => ({ success: true });

    renderWithRouter(
      <CommentForm 
        postId={mockPostId} 
        initialData={initialData} 
        onCancel={onCancelSpy} 
      />, 
      { action: successAction }
    );

    const submitBtn = await screen.findByRole('button', { name: /update comment/i });
    
    await user.click(submitBtn);

    await waitFor(() => {
      expect(onCancelSpy).toHaveBeenCalled();
    }, { timeout: 2000 });
  });
});
