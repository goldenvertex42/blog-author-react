import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router';
import { AuthProvider } from '../../context/AuthContext';
import PostEditor from './PostEditor';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

const renderPostEditor = (route = '/posts/new', mockUser = { username: 'testuser' }) => {
  const mockToken = "header." + btoa(JSON.stringify(mockUser)) + ".signature";
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
    // 1. Setup MSW to return a specific post for the ID '123'
    server.use(
      http.get('http://localhost:3000/posts/123', () => {
        return HttpResponse.json({
          id: 123,
          title: 'Fetched Post Title',
          content: 'Fetched content.',
          published: true
        });
      })
    );

    renderPostEditor('/posts/edit/123');

    // 2. Verify the page transitions from loading to the Edit heading
    const heading = await screen.findByRole('heading', { name: /edit post/i });
    expect(heading).toBeInTheDocument();

    // 3. Verify the form is pre-filled with the fetched data
    const titleInput = await screen.findByLabelText(/title/i);
    expect(titleInput).toHaveValue('Fetched Post Title');
  });

  it('navigates back to dashboard when the back link is clicked', async () => {
    renderPostEditor('/posts/new');
    
    const backLink = screen.getByRole('link', { name: /back to dashboard/i });
    expect(backLink).toHaveAttribute('href', '/');
  });
});
