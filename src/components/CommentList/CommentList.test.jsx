import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CommentList from './CommentList';
import { renderWithRouter } from '../../../tests/test-utils';

describe('CommentList Component', () => {
  const mockComments = [
    {
      id: 1,
      userId: "user-1",
      text: "First comment",
      createdAt: new Date().toISOString(),
      user: { username: "UserOne" }
    },
    {
      id: 2,
      userId: "user-2",
      text: "Second comment",
      createdAt: new Date().toISOString(),
      user: { username: "UserTwo" }
    }
  ];

  it('renders the correct count in the title', async () => {
    renderWithRouter(<CommentList comments={mockComments} />);
    
    const title = await screen.findByText(/Manage Comments \(2\)/i);
    expect(title).toBeInTheDocument();
  });

  it('renders all comment items provided', async () => {
    renderWithRouter(<CommentList comments={mockComments} />);
    
    expect(await screen.findByText("First comment")).toBeInTheDocument();
    expect(screen.getByText("Second comment")).toBeInTheDocument();
    expect(screen.getByText("UserOne")).toBeInTheDocument();
    expect(screen.getByText("UserTwo")).toBeInTheDocument();
  });

  it('renders the empty state message when no comments exist', async () => {
    renderWithRouter(<CommentList comments={[]} />);
    
    const emptyMsg = await screen.findByText(/No comments yet for this post/i);
    expect(emptyMsg).toBeInTheDocument();
    
    expect(screen.getByText(/Manage Comments \(0\)/i)).toBeInTheDocument();
  });
});
