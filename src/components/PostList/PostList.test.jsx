import { screen, render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as router from 'react-router';
import PostList from './PostList';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLoaderData: vi.fn(),
  };
});

vi.mock('../PostItem/PostItem', () => ({
  default: ({ post }) => <div data-testid="mock-post-item">{post.title}</div>
}));

describe('PostList Unit Tests', () => {
  it('renders the empty state when no posts are returned', () => {
    vi.mocked(router.useLoaderData).mockReturnValue([]);

    render(<PostList />);

    expect(screen.getByText(/haven't written any posts yet/i)).toBeInTheDocument();
    expect(screen.queryByTestId('mock-post-item')).not.toBeInTheDocument();
  });

  it('renders a list of PostItems when data is present', () => {
    const mockPosts = [
      { id: 1, title: 'Post One' },
      { id: 2, title: 'Post Two' },
    ];

    vi.mocked(router.useLoaderData).mockReturnValue(mockPosts);

    render(<PostList />);

    const items = screen.getAllByTestId('mock-post-item');
    expect(items).toHaveLength(2);
    expect(screen.getByText('Post One')).toBeInTheDocument();
    expect(screen.getByText('Post Two')).toBeInTheDocument();
  });
});
