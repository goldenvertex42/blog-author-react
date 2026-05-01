import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderWithRouter } from '../../../tests/test-utils';
import CommentItem from './CommentItem';

describe('CommentItem', () => {
  const mockComment = {
    id: 1,
    text: "This is a great post!",
    userId: "user-123",
    user: { username: "reader_joe" },
    createdAt: new Date().toISOString()
  };

  const currentUser = { id: "user-123", username: "reader_joe" };

  it('renders comment content and metadata', async () => {
    renderWithRouter(<CommentItem comment={mockComment} currentUser={currentUser} />);

    expect(await screen.findByText('reader_joe')).toBeInTheDocument();
    expect(screen.getByText('This is a great post!')).toBeInTheDocument();
  });

  it('shows edit and delete buttons when the user is the owner', async () => {
    renderWithRouter(
      <CommentItem comment={mockComment} currentUser={currentUser} />
    );
    
    expect(await screen.findByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('hides edit and delete buttons when the user is NOT the owner', async () => {
    const otherUser = { id: "user-999", username: "other_guy" };
    
    renderWithRouter(
      <CommentItem comment={mockComment} currentUser={otherUser} />
    );

    await screen.findByText(mockComment.text);

    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });


  it('toggles edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<CommentItem comment={mockComment} currentUser={currentUser} />);

    const editBtn = await screen.findByRole('button', { name: /edit/i });
    await user.click(editBtn);

    expect(await screen.findByPlaceholderText(/share your thoughts/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("This is a great post!")).toBeInTheDocument();
  });

  it('closes edit mode when cancel is clicked in the form', async () => {
    const user = userEvent.setup();
    renderWithRouter(<CommentItem comment={mockComment} currentUser={currentUser} />);

    await user.click(await screen.findByRole('button', { name: /edit/i }));
    
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelBtn);

    expect(screen.queryByPlaceholderText(/write a comment/i)).not.toBeInTheDocument();
    expect(screen.getByText('This is a great post!')).toBeInTheDocument();
  });

  it('requires confirmation before calling the delete action', async () => {
    const user = userEvent.setup();
    const actionSpy = vi.fn().mockResolvedValue({ success: true });
    
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    renderWithRouter(<CommentItem comment={mockComment} currentUser={currentUser} />, { 
      action: actionSpy 
    });

    const deleteBtn = await screen.findByRole('button', { name: /delete/i });
    await user.click(deleteBtn);

    expect(confirmSpy).toHaveBeenCalled();
    expect(actionSpy).not.toHaveBeenCalled();

    confirmSpy.mockReturnValue(true);
    await user.click(deleteBtn);
    expect(actionSpy).toHaveBeenCalled();
  });
});
