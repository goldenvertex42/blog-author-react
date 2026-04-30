import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import CommentItem from './CommentItem';
import { commentAction } from '../../pages/CommentPage/CommentPage';
import { renderWithRouter } from '../../../tests/test-utils';

describe('CommentItem Component', () => {
  const mockComment = {
    id: 1,
    userId: "user-123",
    text: "This is a test comment",
    createdAt: new Date().toISOString(),
    user: { username: "TestUser" }
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
    window.confirm = vi.fn(() => true);
  });

  it('renders comment content and username', async () => {
    renderWithRouter(<CommentItem comment={mockComment} />);
    
    expect(await screen.findByText("TestUser")).toBeInTheDocument();
    expect(screen.getByText("This is a test comment")).toBeInTheDocument();
  });

  it('shows Edit button only if the user owns the comment', async () => {
    const { unmount } = renderWithRouter(<CommentItem comment={mockComment} />, {
      userValue: { user: { id: "user-123" } } 
    });
    expect(await screen.findByRole('button', { name: /edit/i })).toBeInTheDocument();
    unmount();

    renderWithRouter(<CommentItem comment={mockComment} />, {
      userValue: { user: { id: "different-id" } }
    });
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
  });

  it('toggles edit mode when Edit is clicked', async () => {
    renderWithRouter(<CommentItem comment={mockComment} />, {
      userValue: { user: { id: "user-123" } }
    });

    const editBtn = await screen.findByRole('button', { name: /edit/i });
    fireEvent.click(editBtn);

    expect(await screen.findByRole('button', { name: /update comment/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    
    expect(screen.queryByRole('button', { name: /^edit$/i })).not.toBeInTheDocument();
  });


  it('triggers optimistic UI and calls delete action on confirmation', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    renderWithRouter(<CommentItem comment={mockComment} />, {
      action: commentAction
    });

    const deleteBtn = await screen.findByRole('button', { name: /delete/i });
    
    fireEvent.click(deleteBtn);
    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining("permanently delete"));

    await waitFor(() => {
      expect(screen.queryByText("This is a test comment")).not.toBeInTheDocument();
    });
  });

  it('prevents deletion if user cancels confirmation', async () => {
    window.confirm = vi.fn(() => false); 

    renderWithRouter(<CommentItem comment={mockComment} />, {
      action: commentAction
    });

    const deleteBtn = await screen.findByRole('button', { name: /delete/i });
    fireEvent.click(deleteBtn);

    expect(screen.getByText("This is a test comment")).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
