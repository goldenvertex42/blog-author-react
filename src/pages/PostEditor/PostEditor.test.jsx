import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router';
import { AuthProvider } from '../../context/AuthContext';
import PostEditor from './PostEditor';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const renderPostEditor = (route = '/posts/new', mockUser = { id: 1, username: 'testuser' }) => {
  const payload = { 
    ...mockUser, 
    exp: Math.floor(Date.now() / 1000) + 3600 
  };

  const mockToken = "header." + btoa(JSON.stringify(payload)) + ".signature";
  
  window.localStorage.setItem('token', mockToken);

  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <Routes>
          <Route path="/posts/new" element={<PostEditor />} />
          <Route path="/posts/edit/:postId" element={<PostEditor />} />
          <Route path="/" element={<h1>Dashboard Mock</h1>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};


describe('PostEditor Page', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders "Create New Post" when no ID is provided', () => {
    renderPostEditor('/posts/new');
    expect(screen.getByRole('heading', { name: /create new post/i })).toBeInTheDocument();
  });

  it('renders "Edit Post" and fetches data when a postId is provided', async () => {
    server.use(
      http.get(`${API_URL}/posts/123`, () => {
        return HttpResponse.json({
          id: 123,
          title: 'Fetched Post Title',
          content: 'Fetched content.',
          published: true
        });
      })
    );

    renderPostEditor('/posts/edit/123');

    const heading = await screen.findByRole('heading', { name: /edit post/i });
    expect(heading).toBeInTheDocument();

    const titleInput = await screen.findByLabelText(/title/i);
    expect(titleInput).toHaveValue('Fetched Post Title');
  });
});
