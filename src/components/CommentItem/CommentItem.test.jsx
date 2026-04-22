import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '../../context/AuthContext';
import CommentItem from './CommentItem';

const renderWithUser = (ui, mockUser) => {
  const payload = {
    ...mockUser,
    exp: Math.floor(Date.now() / 1000) + 3600 
  };

  const mockToken = "header." + btoa(JSON.stringify(payload)) + ".signature";
  
  window.localStorage.setItem('token', mockToken);

  return render(
    <AuthProvider>
      {ui}
    </AuthProvider>
  );
};


describe('CommentItem', () => {
  const mockComment = {
    id: 'c1',
    text: 'This is a test comment',
    userId: 'user-123',
    user: { username: 'Test Author' },
    createdAt: new Date().toISOString()
  };

  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('shows the Edit button if the logged-in user is the comment author', async () => {
    renderWithUser(
      <CommentItem comment={mockComment} onDelete={vi.fn()} onEdit={vi.fn()} />,
      { id: 'user-123', username: 'Test Author' }
    );

    const editBtn = await screen.findByRole('button', { name: /edit/i });
    expect(editBtn).toBeInTheDocument();
  });

  it('hides the Edit button if the logged-in user is NOT the comment author', async () => {
    renderWithUser(
      <CommentItem comment={mockComment} onDelete={vi.fn()} onEdit={vi.fn()} />,
      { id: 'author-456', username: 'Post Owner' }
    );

    await screen.findByText('Test Author');
    
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
  });

  it('always shows the Delete button (for post owners/authors)', async () => {
    renderWithUser(
      <CommentItem comment={mockComment} onDelete={vi.fn()} onEdit={vi.fn()} />,
      { id: 'random-user' }
    );

    const deleteBtn = await screen.findByRole('button', { name: /delete/i });
    expect(deleteBtn).toBeInTheDocument();
    expect(deleteBtn).toHaveAttribute('data-variant', 'secondary');
  });

  it('calls onDelete with the correct ID when clicked', async () => {
    const onDeleteMock = vi.fn();
    const user = userEvent.setup();
    
    renderWithUser(
      <CommentItem comment={mockComment} onDelete={onDeleteMock} onEdit={vi.fn()} />,
      { id: 'user-123' }
    );

    const deleteBtn = await screen.findByRole('button', { name: /delete/i });
    await user.click(deleteBtn);

    expect(onDeleteMock).toHaveBeenCalledWith('c1');
  });
});
