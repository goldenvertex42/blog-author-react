import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router';
import { AuthProvider } from '../../context/AuthContext';
import CommentList from './CommentList';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

const renderCommentList = (postId = '1', mockUser = { id: 1, username: 'testuser' }) => {
  const mockToken = "header." + btoa(JSON.stringify(mockUser)) + ".signature";
  window.localStorage.setItem('token', mockToken);

  return render(
    <MemoryRouter initialEntries={[`/posts/${postId}/comments`]}>
      <AuthProvider>
        <Routes>
          <Route path="/posts/:postId/comments" element={<CommentList />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('CommentList Integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders a list of comments for a specific post', async () => {
    server.use(
      http.get('*/posts/1/comments', () => {
        return HttpResponse.json([
          { id: 'c1', content: 'Great post!', authorName: 'User A', createdAt: new Date().toISOString() },
          { id: 'c2', content: 'Very helpful.', authorName: 'User B', createdAt: new Date().toISOString() }
        ]);
      })
    );

    renderCommentList('1');

    expect(screen.getByText(/loading comments.../i)).toBeInTheDocument();
    
    const comments = await screen.findAllByText(/great post!|very helpful\./i);
    expect(comments).toHaveLength(2);
    expect(screen.getByText(/manage comments \(2\)/i)).toBeInTheDocument();
  });
});
