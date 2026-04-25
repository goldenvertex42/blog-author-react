import { screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithRouter } from '../tests/test-utils';
import Dashboard from '../src/pages/Dashboard/Dashboard';
import PostEditor from '../src/pages/PostEditor/PostEditor';
import LoginPage from '../src/pages/Login/LoginPage';

describe('Author Application Integration Tests', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders the Dashboard and modular PostList with loader data', async () => {
    const mockPosts = [
      { id: 1, title: 'My First Post', published: true, createdAt: new Date().toISOString() }
    ];

    renderWithRouter(<Dashboard />, {
      route: '/',
      loaderData: mockPosts,
      userValue: { user: { username: 'testwriter' } }
    });

    expect(await screen.findByRole('heading', { name: /post overview/i })).toBeInTheDocument();

    expect(screen.getByText('My First Post')).toBeInTheDocument();
    expect(screen.getByText(/Published/i)).toBeInTheDocument();
  });

  it('renders the Post Editor in "New" mode', async () => {
    renderWithRouter(<PostEditor />, {
      route: '/posts/new',
      loaderData: null,
      userValue: { user: { username: 'testwriter' } }
    });

    expect(await screen.findByRole('heading', { name: /create new post/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create post/i })).toBeInTheDocument();
  });

  it('renders the Post Editor in "Edit" mode with pre-filled data', async () => {
    const mockPost = { 
      id: '123', 
      title: 'Existing Post', 
      text: 'Hello world', 
      published: false 
    };

    renderWithRouter(<PostEditor />, {
      route: '/posts/123/edit',
      path: '/posts/:postId/edit',
      loaderData: mockPost,
      userValue: { user: { username: 'testwriter' } }
    });

    expect(await screen.findByRole('heading', { name: /edit post/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Post')).toBeInTheDocument();
  });


  it('renders the Login page with correct heading', async () => {
    renderWithRouter(<LoginPage />, {
      route: '/login',
      userValue: { user: null }
    });

    expect(await screen.findByRole('heading', { name: /welcome back, author/i })).toBeInTheDocument();
  });
});
