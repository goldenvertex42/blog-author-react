import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '../../context/AuthContext';
import PostForm from './PostForm';

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithAuth = (ui) => render(<AuthProvider>{ui}</AuthProvider>);

describe('PostForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.setItem('token', 'mock-token');
  });

  it('submits correctly and navigates to the dashboard on success', async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    
    renderWithAuth(<PostForm onSave={onSave} />);

    await user.type(screen.getByLabelText(/title/i), 'New Post');
    await user.type(screen.getByLabelText(/content/i), 'Some content');

    await user.click(screen.getByRole('button', { name: /create post/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
    
    expect(onSave).toHaveBeenCalled();
  });

  it('stays on the page and shows an error if submission fails', async () => {
    renderWithAuth(<PostForm />);

    fireEvent.click(screen.getByRole('button', { name: /create post/i }));

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('navigates back to dashboard when Cancel is clicked', () => {
    renderWithAuth(<PostForm />);
    
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});

