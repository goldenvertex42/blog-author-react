import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '../../context/AuthContext';
import CommentForm from './CommentForm';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

const renderWithAuth = (ui, mockUser = { id: 1, username: 'testuser' }) => {
  const mockToken = "header." + btoa(JSON.stringify(mockUser)) + ".signature";
  window.localStorage.setItem('token', mockToken);
  
  return render(
    <AuthProvider>
      {ui}
    </AuthProvider>
  );
};

describe('CommentForm Component', () => {
  const mockPostId = '123';

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it('renders a blank form for new comments', () => {
    renderWithAuth(<CommentForm postId={mockPostId} />);
    
    const textarea = screen.getByPlaceholderText(/write a comment/i);
    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toBe('');
    expect(screen.getByRole('button', { name: /post comment/i })).toBeInTheDocument();
  });

  it('pre-fills data and shows "Update" button when in Edit mode', () => {
    const initialData = { id: 'c1', content: 'Original comment text' };
    renderWithAuth(<CommentForm initialData={initialData} />);
    
    const textarea = screen.getByPlaceholderText(/write a comment/i);
    expect(textarea.value).toBe('Original comment text');
    expect(screen.getByRole('button', { name: /update comment/i })).toBeInTheDocument();
  });

  it('submits a new comment and calls onSuccess', async () => {
    const onSuccessMock = vi.fn();
    const user = userEvent.setup();
    
    renderWithAuth(<CommentForm postId={mockPostId} onSuccess={onSuccessMock} />);

    const textarea = screen.getByPlaceholderText(/write a comment/i);
    await user.type(textarea, 'This is a new test comment');
    await user.click(screen.getByRole('button', { name: /post comment/i }));

    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalledTimes(1);
    });
    
    expect(textarea.value).toBe('');
  });

  it('submits an edited comment and calls onSuccess', async () => {
    const initialData = { id: 'c1', content: 'Old content' };
    const onSuccessMock = vi.fn();
    const user = userEvent.setup();

    server.use(
      http.put('*/comments/c1', () => HttpResponse.json({ message: 'Updated' }))
    );

    renderWithAuth(
      <CommentForm initialData={initialData} onSuccess={onSuccessMock} />
    );

    const textarea = screen.getByPlaceholderText(/write a comment/i);
    await user.clear(textarea);
    await user.type(textarea, 'Updated content');
    await user.click(screen.getByRole('button', { name: /update comment/i }));

    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onCancel when the cancel button is clicked', async () => {
    const onCancelMock = vi.fn();
    const user = userEvent.setup();
    
    renderWithAuth(<CommentForm onCancel={onCancelMock} />);
    
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelBtn);
    
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });
});
