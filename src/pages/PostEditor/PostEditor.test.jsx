import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithRouter } from '../../../tests/test-utils';
import PostEditor, { postEditorLoader, postEditorAction } from './PostEditor';

describe('PostEditor Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    window.localStorage.setItem('token', 'mock-token');
  });

  it('renders "Create New Post" when no postId is present', async () => {
    renderWithRouter(<PostEditor />, {
      route: '/posts/new',
      path: '/posts/new',
      loaderData: null 
    });

    expect(await screen.findByRole('heading', { name: /create new post/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create post/i })).toBeInTheDocument();
  });

  it('renders "Edit Post" and pre-fills data when postId is present', async () => {
    renderWithRouter(<PostEditor />, {
      route: '/posts/123/edit',
      path: '/posts/:postId/edit',
      loaderData: { id: '123', title: 'Existing Post', text: 'Some content' }
    });

    expect(await screen.findByRole('heading', { name: /edit post/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Post')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update post/i })).toBeInTheDocument();
  });

  it('successfully submits the form and triggers the action', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 'new-id' }),
    });

    renderWithRouter(<PostEditor />, {
      route: '/posts/new',
      path: '/posts/new',
      action: postEditorAction 
    });

    const titleInput = await screen.findByLabelText(/title/i);
    const textInput = screen.getByLabelText(/text/i);
    const submitBtn = screen.getByRole('button', { name: /create post/i });

    fireEvent.change(titleInput, { target: { value: 'New Blog Post' } });
    fireEvent.change(textInput, { target: { value: 'Blog content' } });
    
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/posts'),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });

  it('postEditorAction correctly maps server errors', async () => {
    const mockRequest = {
      formData: async () => new FormData(),
    };
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ errors: [{ path: 'title', msg: 'Too short' }] })
    });

    const result = await postEditorAction({ request: mockRequest, params: {} });
    expect(result.errors.title).toBe('Too short');
  });
});
